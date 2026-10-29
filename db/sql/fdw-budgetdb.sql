-- budgetdb reads users from userdb through postgres_fdw (user_rep is a foreign table).
-- Idempotent: safe to run on every deploy.
-- psql variables: userdb_host, userdb_port, userdb_name, remote_user, remote_password

SET client_min_messages = warning;

CREATE EXTENSION IF NOT EXISTS postgres_fdw;

SELECT format('CREATE SERVER user_server FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host %L, port %L, dbname %L)',
              :'userdb_host', :'userdb_port', :'userdb_name')
WHERE NOT EXISTS (SELECT 1 FROM pg_foreign_server WHERE srvname = 'user_server') \gexec

SELECT format('CREATE USER MAPPING IF NOT EXISTS FOR CURRENT_USER SERVER user_server OPTIONS (user %L, password %L)',
              :'remote_user', :'remote_password') \gexec

-- Hibernate (ddl-auto=update) creates user_rep as a plain, always-empty table when it starts
-- before this script, which breaks the categories.user_id foreign key on registration.
-- Replace such a table; CASCADE drops the foreign key that points at it.
SELECT 'DROP TABLE public.user_rep CASCADE'
WHERE EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
              WHERE n.nspname = 'public' AND c.relname = 'user_rep' AND c.relkind = 'r') \gexec

CREATE FOREIGN TABLE IF NOT EXISTS public.user_rep (
    id         uuid NOT NULL,
    is_active  boolean,
    is_premium boolean
) SERVER user_server OPTIONS (schema_name 'public', table_name 'users');
