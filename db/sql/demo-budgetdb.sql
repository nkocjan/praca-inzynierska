-- budgetdb: wipe all categories and budgets and recreate the demo ones. Runs after demo-data.sql.

BEGIN;

TRUNCATE budgets, budget_configs_history, categories;

INSERT INTO categories (id, user_id, name, description, is_active, created_at, updated_at)
SELECT c.id, u.id, c.name, c.description, true, p.history_start, p.history_start
FROM demo_categories c
JOIN demo_users u USING (username)
CROSS JOIN demo_period p;

-- Default amounts used for every new period (Settings -> default budgets).
INSERT INTO budget_configs_history (id, category_id, budget_type, amount, is_active, created_at)
SELECT md5('config:' || c.id || ':' || t.budget_type)::uuid, c.id, t.budget_type, t.amount, true, p.history_start
FROM demo_categories c
CROSS JOIN LATERAL (VALUES ('WEEK', c.weekly), ('MONTH', c.monthly), ('YEAR', c.yearly)) AS t(budget_type, amount)
CROSS JOIN demo_period p;

-- One budget per category and period, from the start of the history up to the current period.
-- Same boundaries as BudgetCommandService.calculateDateRange.
INSERT INTO budgets (id, category_id, period, amount, period_start, period_end, created_at, updated_at)
SELECT md5('budget:' || c.id || ':' || t.period || ':' || s.period_start)::uuid,
       c.id, t.period, t.amount, s.period_start,
       s.period_start + t.length - interval '1 microsecond',
       s.period_start, s.period_start
FROM demo_categories c
CROSS JOIN demo_period p
CROSS JOIN LATERAL (VALUES
    ('WEEK',  c.weekly,  interval '1 week',  date_trunc('week', p.history_start::timestamp)),
    ('MONTH', c.monthly, interval '1 month', p.history_start::timestamp),
    ('YEAR',  c.yearly,  interval '1 year',  p.history_start::timestamp)
) AS t(period, amount, length, first_start)
CROSS JOIN LATERAL generate_series(t.first_start, localtimestamp, t.length) AS s(period_start);

COMMIT;
