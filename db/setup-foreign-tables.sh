#!/usr/bin/env bash
# Creates the postgres_fdw foreign tables (user_rep, category_rep, budget_rep) that budget-service
# and expense-service read, and the expenses table on shard B. Idempotent.
#
# Run it after the services have started once (Hibernate creates the base tables), e.g.:
#   ./db/setup-foreign-tables.sh
# FDW_* are addresses as seen from inside the database containers (compose service names).

source "$(dirname "$0")/common.sh"

if [ "$DB_MODE" = "docker" ]; then
    FDW_USERDB_HOST="${FDW_USERDB_HOST:-userdb}"
    FDW_USERDB_PORT="${FDW_USERDB_PORT:-5432}"
    FDW_BUDGETDB_HOST="${FDW_BUDGETDB_HOST:-budgetdb}"
    FDW_BUDGETDB_PORT="${FDW_BUDGETDB_PORT:-5432}"
else
    FDW_USERDB_HOST="${FDW_USERDB_HOST:-$PGHOST}"
    FDW_USERDB_PORT="${FDW_USERDB_PORT:-$USERDB_PORT}"
    FDW_BUDGETDB_HOST="${FDW_BUDGETDB_HOST:-$PGHOST}"
    FDW_BUDGETDB_PORT="${FDW_BUDGETDB_PORT:-$BUDGETDB_PORT}"
fi

fdw_vars=(
    -v "userdb_host=$FDW_USERDB_HOST" -v "userdb_port=$FDW_USERDB_PORT" -v "userdb_name=$USERDB_NAME"
    -v "budgetdb_host=$FDW_BUDGETDB_HOST" -v "budgetdb_port=$FDW_BUDGETDB_PORT" -v "budgetdb_name=$BUDGETDB_NAME"
    -v "remote_user=$PGUSER" -v "remote_password=$PGPASSWORD"
)

log "budgetdb: user_rep -> userdb.users"
run_sql budgetdb "${fdw_vars[@]}" < "$SQL_DIR/fdw-budgetdb.sql"

for shard in expense-a expense-b; do
    log "$shard: expenses table + user_rep, category_rep, budget_rep"
    run_sql "$shard" "${fdw_vars[@]}" < "$SQL_DIR/fdw-expense-shard.sql"
done

log "Foreign tables ready"
