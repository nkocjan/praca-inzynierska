# praca-inzynierska: notes for agents

Household budget app (engineering thesis), public demo at https://inzynierka.nkocjan.pl.
Modules, ports and local setup: `README.md`. Databases, demo data and the reset script: `db/README.md`.

## Rules

- Demo accounts (`demo`, `student`, `rodzina`, password `demo1234`) are defined in `db/sql/demo-data.sql`
  and listed on the login page in `frontend/src/components/routes/login/DemoAccountsPanel.tsx` (texts in
  the `auth` translations under `demo`). Change them together.
- UI text goes through react-i18next: add every key to both `frontend/src/i18n/locales/pl` and `en`.
- `npm run build` runs `tsc -b` first, so an unused variable fails the build.
- Never commit secrets (`JWT_SECRET`, database passwords) or the server's address and SSH login: this
  repository is public.

## Server (VPS)

- Checkout `~/apps/praca-inzynierska` on `dev`. Everything runs from `docker-compose.yaml` (since
  2026-10-29): six Postgres containers (ports on 127.0.0.1 only), the four Spring services with the
  `docker` profile (`application-docker.properties`: container names instead of localhost) and
  `inz-frontend` (Vite build served as static files). Never edit files on the server: a dirty checkout
  makes the deploy's `git pull` fail (that is why it never worked before).
- HTTPS and routing come from the Caddy gateway in the owner's private repo `my_own_page`:
  `/api/*` goes to `inz-bff:8080` with the prefix stripped, everything else to `inz-frontend:80`, both over
  the external Docker network `web-gateway`. The browser calls `/api/auth/login` and `/api/api/bff/...`.
- `.env` next to the compose file is a symlink into `my_own_page` and holds `JWT_SECRET` (shared by
  `user-service` and `bff`). It never goes into this public repository.
- Deploy: `.github/workflows/deploy.yml` on push to `dev` (SSH, `git pull --ff-only`, images built one at a
  time, `up -d`). Needs the repository secrets `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (same values as the
  owner's other repositories).
- After the first start of fresh databases run `./db/setup-foreign-tables.sh` (idempotent; done on
  2026-10-29).

## Pending (written 2026-10-29)

1. Repository secrets `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` are still missing: the workflow fails in a few
   seconds without connecting. The 2026-10-29 deploy of `dev` was run by hand on the server with the
   workflow's own commands. After the owner adds them, check with a push or "Run workflow".
2. Demo data: the `users` table is empty, so the demo accounts do not exist yet. Run
   `./db/reset-demo-data.sh` (deletes ALL accounts and data, then creates the demo accounts; expected last
   line: 3 users, 18 categories, about 2160 budgets and 3200 expenses) and add the cron line from
   `db/README.md` — only with the owner's go-ahead.
3. Then verify:
   ```bash
   B=https://inzynierka.nkocjan.pl/api
   curl -s -X POST $B/auth/login -H 'Content-Type: application/json' -d '{"username":"demo","password":"demo1234"}'   # {"token":...}
   curl -s -o /dev/null -w '%{http_code}\n' -X POST $B/auth/login -H 'Content-Type: application/json' -d '{"username":"demo","password":"x"}'   # 401
   curl -s -o /dev/null -w '%{http_code}\n' $B/api/bff/categories   # 401
   ```
   and use one-click login on each demo account. For the portfolio screenshot of this app, capture the
   dashboard, not the login page: it shows the demo password.
