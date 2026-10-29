-- userdb: wipe all accounts and recreate the demo ones. Runs after demo-data.sql.

BEGIN;

-- user-service adds this column itself on startup; adding it here lets the reset run first.
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_demo boolean;

TRUNCATE users;

INSERT INTO users (id, name, surname, username, email, phone_number, password,
                   is_active, is_premium, is_demo, created_at, updated_at)
SELECT id, name, surname, username, email, phone_number,
       '$2a$10$IoEEef94x1LTm5/f4zNr7eUW3qiIQs0DWbywXwQgoah3hO517ijXC',
       true, false, true, p.history_start, p.history_start
FROM demo_users, demo_period p;

COMMIT;
