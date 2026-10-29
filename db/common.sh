#!/usr/bin/env bash
# Shared helpers for the database scripts in this directory.
#
# DB_MODE=docker (default) runs psql inside the Postgres containers from docker-compose.yaml.
# DB_MODE=local connects with a local psql client to the ports published on PGHOST.
# Every name below can be overridden with an environment variable.

set -euo pipefail

DB_MODE="${DB_MODE:-docker}"
PGUSER="${PGUSER:-postgres}"
PGHOST="${PGHOST:-127.0.0.1}"
export PGPASSWORD="${PGPASSWORD:-postgres}"

USERDB_CONTAINER="${USERDB_CONTAINER:-userdb}"
BUDGETDB_CONTAINER="${BUDGETDB_CONTAINER:-budgetdb}"
EXPENSE_A_CONTAINER="${EXPENSE_A_CONTAINER:-expense-A1}"
EXPENSE_B_CONTAINER="${EXPENSE_B_CONTAINER:-expense-B1}"

USERDB_PORT="${USERDB_PORT:-15432}"
BUDGETDB_PORT="${BUDGETDB_PORT:-5433}"
EXPENSE_A_PORT="${EXPENSE_A_PORT:-5434}"
EXPENSE_B_PORT="${EXPENSE_B_PORT:-5436}"

USERDB_NAME="${USERDB_NAME:-userdb}"
BUDGETDB_NAME="${BUDGETDB_NAME:-budgetdb}"
EXPENSE_A_NAME="${EXPENSE_A_NAME:-expenseA}"
EXPENSE_B_NAME="${EXPENSE_B_NAME:-expenseB}"

SQL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/sql"

# run_sql <userdb|budgetdb|expense-a|expense-b> [extra psql args...] < script.sql
run_sql() {
    local target="$1"
    shift
    local container port dbname
    case "$target" in
        userdb)    container="$USERDB_CONTAINER";    port="$USERDB_PORT";    dbname="$USERDB_NAME" ;;
        budgetdb)  container="$BUDGETDB_CONTAINER";  port="$BUDGETDB_PORT";  dbname="$BUDGETDB_NAME" ;;
        expense-a) container="$EXPENSE_A_CONTAINER"; port="$EXPENSE_A_PORT"; dbname="$EXPENSE_A_NAME" ;;
        expense-b) container="$EXPENSE_B_CONTAINER"; port="$EXPENSE_B_PORT"; dbname="$EXPENSE_B_NAME" ;;
        *) echo "Unknown database: $target" >&2; return 1 ;;
    esac

    if [ "$DB_MODE" = "docker" ]; then
        docker exec -i "$container" psql -X -q -v ON_ERROR_STOP=1 -U "$PGUSER" -d "$dbname" "$@"
    else
        psql -X -q -v ON_ERROR_STOP=1 -h "$PGHOST" -p "$port" -U "$PGUSER" -d "$dbname" "$@"
    fi
}

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}
