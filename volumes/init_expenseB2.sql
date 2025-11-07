-- 1️⃣ Włącz extension FDW
CREATE EXTENSION IF NOT EXISTS postgres_fdw;

-- 2️⃣ Utwórz serwer zdalny user-postgres
CREATE SERVER user_server
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (
    host 'user-postgres',
    dbname 'userdb',
    port '5432'
);

-- 3️⃣ User mapping dla postgres
CREATE USER MAPPING FOR postgres
SERVER user_server
OPTIONS (user 'postgres', password 'postgres');

-- 4️⃣ Tworzymy foreign table w expense-db
CREATE FOREIGN TABLE user_rep (
    id UUID,
    username TEXT,
    email TEXT,
    is_active BOOLEAN,
    is_premium BOOLEAN
)
SERVER user_server
OPTIONS (schema_name 'public', table_name 'users');

-- 5️⃣ Tworzymy lokalną tabelę expense dla tej instancji
CREATE TABLE IF NOT EXISTS expense (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    category TEXT,
    amount NUMERIC,
    created_at TIMESTAMP DEFAULT now()
);
