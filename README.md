# praca-inzynierska

Aplikacja do planowania budżetu domowego (projekt inżynierski): frontend React + MUI, backend w Spring Boot
podzielony na mikroserwisy, PostgreSQL ze shardingiem i replikacją.

Demo: https://inzynierka.nkocjan.pl (konta `demo`, `student`, `rodzina`, hasło `demo1234`).

| Moduł | Port | Opis |
| --- | --- | --- |
| `frontend` | 5173 (dev) | React, Vite |
| `bff` | 8080 | Backend for Frontend: JWT, agregacja danych, proxy do serwisów |
| `user-service` | 8081 | Konta i logowanie (`userdb`) |
| `expense-service` | 28081 | Wydatki, dwa shardy z replikami (`expenseA`, `expenseB`) |
| `budget-service` | 28082 | Kategorie i budżety (`budgetdb`) |

## Uruchomienie lokalne

1. `docker compose up -d` - bazy danych.
2. Start serwisów (`mvn spring-boot:run` w katalogu każdego z nich).
3. `./db/setup-foreign-tables.sh` - jednorazowo, po pierwszym starcie serwisów.
4. `./db/reset-demo-data.sh` - konta i dane demo.
5. `cd frontend && npm ci && npm run dev`.

Szczegóły baz danych, danych demo i resetu przez cron: [db/README.md](db/README.md).

## Konfiguracja na serwerze

- `JWT_SECRET` - ta sama wartość dla `user-service` i `bff` (np. `openssl rand -base64 48`). Bez niej
  serwisy używają klucza deweloperskiego z repozytorium, którym każdy może podpisać własny token.
- Frontend budowany przez `npm run build` używa `VITE_API_URL` z `frontend/.env.production` (`/api`).
