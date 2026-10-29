-- An expense shard (primary) reads users from userdb and categories/budgets from budgetdb
-- through postgres_fdw. The read replicas get all of this through streaming replication.
-- Idempotent: safe to run on every deploy.
-- psql variables: userdb_host, userdb_port, userdb_name,
--                 budgetdb_host, budgetdb_port, budgetdb_name, remote_user, remote_password

SET client_min_messages = warning;

CREATE EXTENSION IF NOT EXISTS postgres_fdw;

SELECT format('CREATE SERVER user_server FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host %L, port %L, dbname %L)',
              :'userdb_host', :'userdb_port', :'userdb_name')
WHERE NOT EXISTS (SELECT 1 FROM pg_foreign_server WHERE srvname = 'user_server') \gexec

SELECT format('CREATE SERVER budget_server FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host %L, port %L, dbname %L)',
              :'budgetdb_host', :'budgetdb_port', :'budgetdb_name')
WHERE NOT EXISTS (SELECT 1 FROM pg_foreign_server WHERE srvname = 'budget_server') \gexec

SELECT format('CREATE USER MAPPING IF NOT EXISTS FOR CURRENT_USER SERVER %I OPTIONS (user %L, password %L)',
              srv, :'remote_user', :'remote_password')
FROM unnest(ARRAY['user_server', 'budget_server']) AS srv \gexec

-- Hibernate creates the schema only on the default data source (shard A), so shard B starts empty.
-- Same DDL as Hibernate generates, minus the foreign keys to the *_rep tables.
CREATE TABLE IF NOT EXISTS public.expenses (
    id          uuid NOT NULL PRIMARY KEY,
    amount      numeric(38, 2),
    created_at  timestamp(6),
    date        timestamp(6),
    description varchar(255),
    is_planned  boolean,
    name        varchar(255),
    updated_at  timestamp(6),
    category_id uuid NOT NULL,
    user_id     uuid
);

-- Replace plain *_rep tables that Hibernate may have created (always empty, they break inserts).
SELECT format('DROP TABLE public.%I CASCADE', c.relname)
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
  AND c.relname IN ('user_rep', 'category_rep', 'budget_rep') \gexec

CREATE FOREIGN TABLE IF NOT EXISTS public.user_rep (
    id         uuid NOT NULL,
    is_active  boolean,
    is_premium boolean
) SERVER user_server OPTIONS (schema_name 'public', table_name 'users');

CREATE FOREIGN TABLE IF NOT EXISTS public.category_rep (
    id        uuid NOT NULL,
    is_active boolean,
    name      varchar(255)
) SERVER budget_server OPTIONS (schema_name 'public', table_name 'categories');

CREATE FOREIGN TABLE IF NOT EXISTS public.budget_rep (
    id           uuid NOT NULL,
    amount       numeric(38, 2),
    category_id  uuid,
    period       varchar(255),
    period_start timestamp(6),
    period_end   timestamp(6)
) SERVER budget_server OPTIONS (schema_name 'public', table_name 'budgets');
