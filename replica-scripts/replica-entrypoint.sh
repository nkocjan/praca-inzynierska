#!/bin/bash
set -e

# Użyj zmiennej środowiskowej PGDATA
PGDATA="${PGDATA:-/var/lib/postgresql/data/pgdata}"
PRIMARY_HOST="expense-A1"

# Sprawdź, czy katalog danych jest pusty
if [ -z "$(ls -A "$PGDATA")" ]; then
    echo "Katalog danych jest pusty. Inicjalizacja repliki z $PRIMARY_HOST..."

    export PGPASSWORD="$POSTGRES_PASSWORD"

    pg_basebackup -h $PRIMARY_HOST -U $POSTGRES_USER -D "$PGDATA" -Fp -Xs -P -R

    echo "Kopia bazowa zakończona pomyślnie."
    unset PGPASSWORD

    # !! TO JEST KLUCZOWA ZMIANA !!
    # Zmień właściciela wszystkich skopiowanych plików na użytkownika "postgres"
    echo "Zmiana właściciela plików na postgres..."
    chown -R postgres:postgres "$PGDATA"

    # Ustaw odpowiednie uprawnienia dla katalogu danych
    chmod 0700 "$PGDATA"

else
    echo "Katalog danych już istnieje. Pomijam pg_basebackup."
fi

echo "Uruchamiam serwer PostgreSQL w trybie standby jako użytkownik postgres..."
exec gosu postgres postgres