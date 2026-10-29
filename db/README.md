# Skrypty bazodanowe

## Architektura danych

| Baza | Tabele własne | Foreign tables (postgres_fdw) |
| --- | --- | --- |
| `userdb` | `users` | — |
| `budgetdb` | `categories`, `budgets`, `budget_configs_history` | `user_rep` → `userdb.users` |
| `expenseA` / `expenseB` (shardy, primary + replika) | `expenses` | `user_rep` → `userdb.users`, `category_rep` → `budgetdb.categories`, `budget_rep` → `budgetdb.budgets` |

Shard wybierany jest po parzystości ostatniej cyfry UUID użytkownika (`ShardSelectionStrategy`). Zapisy idą
na primary (`expense-A1`, `expense-B1`), odczyty na repliki (`expense-A2`, `expense-B2`), które dostają
wszystko przez replikację strumieniową.

Hibernate (`ddl-auto=update`) tworzy tabele tylko na domyślnym źródle danych, czyli na shardzie A, a tabele
`*_rep` zakłada jako zwykłe, puste tabele — wtedy rejestracja kończy się błędem klucza obcego. Dlatego po
pierwszym starcie serwisów trzeba raz uruchomić `setup-foreign-tables.sh`.

## Skrypty

- `setup-foreign-tables.sh` — tworzy serwery FDW, foreign tables `*_rep` i tabelę `expenses` na shardzie B.
  Idempotentny, można go uruchamiać przy każdym wdrożeniu.
- `reset-demo-data.sh` — przywraca stan początkowy demo: usuwa **wszystkie** konta, kategorie, budżety
  i wydatki (także konta założone przez odwiedzających) i tworzy konta demo z danymi od stycznia
  poprzedniego roku. Dane są generowane deterministycznie z daty kalendarzowej, więc zawsze są „aktualne”.

Konta demo (hasło `demo1234`, flaga `users.is_demo` blokuje zmianę danych logowania, reset danych
i usunięcie konta):

| Login | Persona | Shard |
| --- | --- | --- |
| `demo` | Anna — singielka w dużym mieście | A |
| `student` | Jan — student | B |
| `rodzina` | Rodzina 2+2 | A |

Definicje kont, kategorii, budżetów i szablonów wydatków są w `sql/demo-data.sql`. Lista kont na ekranie
logowania jest w `frontend/src/components/routes/login/DemoAccountsPanel.tsx`.

## Uruchamianie

Domyślnie skrypty wykonują `psql` wewnątrz kontenerów z `docker-compose.yaml` (`docker exec`):

```bash
./db/setup-foreign-tables.sh
./db/reset-demo-data.sh
```

Lokalnie, bez Dockera (Postgres na portach z `docker-compose.yaml`):

```bash
DB_MODE=local ./db/reset-demo-data.sh
```

Nazwy kontenerów, baz, portów i hasło można nadpisać zmiennymi środowiskowymi — patrz `common.sh`.

## Cron na serwerze (reset co 2 godziny)

```cron
0 */2 * * * /home/nkocjan/apps/praca-inzynierska/db/reset-demo-data.sh >> /home/nkocjan/demo-reset.log 2>&1
```

Użytkownik crona musi mieć dostęp do Dockera (grupa `docker`).
