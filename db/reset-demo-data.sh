#!/usr/bin/env bash
# Resets the whole application to the initial demo state: removes every account, category,
# budget and expense (including accounts registered by visitors) and recreates the demo
# accounts with about two years of data, generated relative to today.
#
# Demo accounts (password: demo1234): demo, student, rodzina.
#
# Meant to run from cron on the server, e.g. every 2 hours:
#   0 */2 * * * /home/nkocjan/apps/praca-inzynierska/db/reset-demo-data.sh >> /home/nkocjan/logs/demo-reset.log 2>&1
# Requires db/setup-foreign-tables.sh to have been run once.

source "$(dirname "$0")/common.sh"

relkind_of() { # <database> <table> -> r (table), f (foreign table) or empty
    run_sql "$1" -At -c "SELECT relkind FROM pg_class WHERE oid = to_regclass('public.$2')"
}

require_foreign() { # <database> <table>...
    local db="$1" table kind
    shift
    for table in "$@"; do
        kind="$(relkind_of "$db" "$table")"
        if [ "$kind" != "f" ]; then
            log "ERROR: $db.$table is not a foreign table (relkind='$kind'). Run db/setup-foreign-tables.sh first."
            exit 1
        fi
    done
}

require_table() { # <database> <table>
    if [ "$(relkind_of "$1" "$2")" != "r" ]; then
        log "ERROR: $1.$2 does not exist. Start the services once so Hibernate creates the schema."
        exit 1
    fi
}

require_table userdb users
require_table budgetdb categories
require_foreign budgetdb user_rep
for shard in expense-a expense-b; do
    require_table "$shard" expenses
    require_foreign "$shard" user_rep category_rep budget_rep
done

log "Resetting demo data"
cat "$SQL_DIR/demo-data.sql" "$SQL_DIR/demo-expenses.sql" | run_sql expense-a -v shard=A
cat "$SQL_DIR/demo-data.sql" "$SQL_DIR/demo-expenses.sql" | run_sql expense-b -v shard=B
cat "$SQL_DIR/demo-data.sql" "$SQL_DIR/demo-budgetdb.sql" | run_sql budgetdb
cat "$SQL_DIR/demo-data.sql" "$SQL_DIR/demo-userdb.sql" | run_sql userdb

summary="$(run_sql userdb -At -c "SELECT count(*) FROM users")"
summary+=" users, $(run_sql budgetdb -At -c "SELECT count(*) FROM categories") categories"
summary+=", $(run_sql budgetdb -At -c "SELECT count(*) FROM budgets") budgets"
summary+=", $(run_sql expense-a -At -c "SELECT count(*) FROM expenses") + $(run_sql expense-b -At -c "SELECT count(*) FROM expenses") expenses (shard A + B)"
log "Done: $summary"
