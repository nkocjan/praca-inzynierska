#!/bin/bash
set -e

PGDATA="${PGDATA:-/var/lib/postgresql/data/pgdata}"
PRIMARY_HOST="expense-A1"

if [ -z "$(ls -A "$PGDATA")" ]; then
    echo "Katalog danych jest pusty. Inicjalizacja repliki z $PRIMARY_HOST"

    export PGPASSWORD="$POSTGRES_PASSWORD"

    pg_basebackup -h $PRIMARY_HOST -U $POSTGRES_USER -D "$PGDATA" -Fp -Xs -P -R

    unset PGPASSWORD

    chown -R postgres:postgres "$PGDATA"

    chmod 0700 "$PGDATA"

else
    echo "Katalog danych już istnieje. Pomijam pg_basebackup."
fi

exec gosu postgres postgres