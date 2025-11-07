#!/bin/bash
set -e

# Zmiana: Domyślna ścieżka PGDATA dla baz B
PGDATA="${PGDATA:-/var/lib/postgresql/data}"
# !! KLUCZOWA ZMIANA: Host główny to teraz expense-B1 !!
PRIMARY_HOST="expense-B1"

# Sprawdź, czy katalog danych jest pusty
if [ -z "$(ls -A "$PGDATA")" ]; then
    echo "Katalog danych B jest pusty. Inicjalizacja repliki z $PRIMARY_HOST..."

    export PGPASSWORD="$POSTGRES_PASSWORD"
    pg_basebackup -h $PRIMARY_HOST -U $POSTGRES_USER -D "$PGDATA" -Fp -Xs -P -R

    echo "Kopia bazowa B zakończona pomyślnie."
    unset PGPASSWORD

    echo "Zmiana właściciela plików B na postgres..."
    chown -R postgres:postgres "$PGDATA"
    chmod 0700 "$PGDATA"

else
    echo "Katalog danych B już istnieje. Pomijam pg_basebackup."
fi

echo "Uruchamiam serwer PostgreSQL B w trybie standby jako użytkownik postgres..."
exec gosu postgres postgres