-- Expense shard: wipe all expenses and generate the demo ones for the users living on this shard.
-- Runs after demo-data.sql. psql variable: shard (A or B).

BEGIN;

TRUNCATE expenses;

WITH days AS (
    SELECT d::date AS day
    FROM demo_period p, generate_series(p.history_start, current_date + 31, interval '1 day') AS d
),
candidates AS (
    SELECT t.*, u.id AS user_id, c.id AS category_id, days.day,
           extract(day FROM (date_trunc('month', days.day) + interval '1 month - 1 day')) AS month_length
    FROM demo_templates t
    JOIN demo_users u USING (username)
    JOIN demo_categories c ON c.username = t.username AND c.code = t.category_code
    CROSS JOIN days
    WHERE u.shard = :'shard'
      AND (t.months IS NULL OR extract(month FROM days.day) = ANY (t.months))
),
picked AS (
    SELECT *,
           pg_temp.rnd('amount:' || username || name || day) AS r_amount,
           pg_temp.rnd('time:' || username || name || day) AS r_time
    FROM candidates
    WHERE CASE kind
              WHEN 'monthly' THEN extract(day FROM day) = least(param, month_length)
              WHEN 'weekly'  THEN extract(isodow FROM day) = param
                                  AND pg_temp.rnd('hit:' || username || name || day) < prob
              WHEN 'daily'   THEN pg_temp.rnd('hit:' || username || name || day) < prob
              WHEN 'workday' THEN extract(isodow FROM day) <= 5
                                  AND pg_temp.rnd('hit:' || username || name || day) < prob
          END
      -- Only recurring bills are known in advance; they show up as planned expenses.
      AND (day <= current_date OR kind = 'monthly')
)
INSERT INTO expenses (id, user_id, category_id, name, description, amount, date, is_planned, created_at, updated_at)
SELECT md5('expense:' || username || name || day)::uuid,
       user_id,
       category_id,
       name,
       CASE WHEN kind = 'monthly' AND months IS NULL THEN 'Za ' || to_char(day, 'MM.YYYY') END,
       round(amount_min + (amount_max - amount_min) * r_amount, 2),
       ts,
       ts > localtimestamp,
       least(ts, localtimestamp),
       least(ts, localtimestamp)
FROM picked
CROSS JOIN LATERAL (
    SELECT CASE
               -- Today's expenses already happened, between midnight and now.
               WHEN day = current_date THEN current_date + (localtimestamp - current_date) * r_time
               ELSE day + interval '7 hours' + interval '14 hours' * r_time
           END AS ts
) AS t;

COMMIT;
