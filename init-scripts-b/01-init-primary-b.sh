#!/bin/bash
set -e

# $PGDATA jest automatycznie ustawiane przez oficjalny obraz postgres
echo "host replication all 0.0.0.0/0 trust" >> "$PGDATA/pg_hba.conf"