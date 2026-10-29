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

- Ask the user for SSH access. The checkout is `~/apps/praca-inzynierska`. nginx serves the built frontend
  and proxies `/api/*` to the BFF (port 8080) with the `/api` prefix removed, so the browser calls
  `/api/auth/login` and `/api/api/bff/...`.
- How the four Spring services are started there (Docker, systemd or plain `java -jar`) is not recorded in
  the repository yet. Find out before changing anything and write it down in this section.
- `.github/workflows/deploy.yml` has never worked (secrets `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` are not
  set) and would only restart the database containers anyway. Deployments are manual.

## Pending: deploy the demo (written 2026-10-29)

What the server runs now, seen from outside: login fails (the BFF calls a hardcoded `localhost:8081` and gets
"Connection refused"), and the frontend is `dev` plus an uncommitted edit of `frontend/src/api/apiClient.ts`
(`baseURL: "/api"`). The code to deploy is on branch `claude/tender-mccarthy-ei79vs` (or `dev` once it is
merged): security and data fixes, demo accounts, reset script, demo panel on the login page.

1. Look before touching anything:
   ```bash
   cd ~/apps/praca-inzynierska && git status --short && git diff --stat && git log -1 --oneline
   docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}'
   ps -eo pid,args | grep -E '[j]ava ' | cut -c1-220
   ```
   Save local edits first: `git diff > ~/praca-local-changes-$(date +%F).patch`. The `apiClient.ts` edit is
   replaced by `frontend/.env.production` and can be discarded. Any other edit (properties, compose) holds
   real server configuration: move it into environment variables or re-apply it after the update, never
   just drop it.
2. Update the code: discard or stash the saved edits, then
   `git fetch origin && git checkout claude/tender-mccarthy-ei79vs && git pull`.
3. Service configuration, wherever the services are started:
   - `JWT_SECRET`: one value for both `user-service` and `bff`, generated once with
     `openssl rand -base64 48` and kept only on the server. Without it both use the development key from
     this public repository, with which anyone can sign a token for any account. Changing it logs
     everybody out, which is expected.
   - BFF: `user-service.url`, `budget-service.url` and `expense-service.url` must reach the running services
     (env `USERSERVICE_URL`, `BUDGETSERVICE_URL`, `EXPENSESERVICE_URL`). The login proxy now uses
     `user-service.url` as well; that is the fix for the broken login.
4. Databases: `docker compose up -d` recreates the database containers with ports published on
   `127.0.0.1` only (volumes keep the data). Before that, check that nothing reaches the databases through
   the public IP; services on the host use `localhost`, services in the compose network use container
   names. Check that the replicas `expense-A2` and `expense-B2` are running (their entrypoint scripts were
   not executable before).
5. Rebuild and restart the four services (`mvn -DskipTests package` in each module, or the existing
   mechanism) and the frontend (`cd frontend && npm ci && npm run build`, then publish `dist/` where nginx
   serves it from). `user-service` adds the `users.is_demo` column itself on startup.
6. Databases for the demo:
   ```bash
   ./db/setup-foreign-tables.sh   # idempotent; container names can be overridden, see db/common.sh
   ./db/reset-demo-data.sh        # deletes ALL accounts and data, then creates the demo accounts
   ```
   Expected last line: 3 users, 18 categories, about 2160 budgets and 3200 expenses on shards A + B.
7. Cron (user must be in the `docker` group): add the line from `db/README.md`, which runs
   `db/reset-demo-data.sh` every 2 hours and appends to `~/demo-reset.log`.
8. Verify:
   ```bash
   B=https://inzynierka.nkocjan.pl/api
   curl -s -X POST $B/auth/login -H 'Content-Type: application/json' -d '{"username":"demo","password":"demo1234"}'   # {"token":...}
   curl -s -o /dev/null -w '%{http_code}\n' -X POST $B/auth/login -H 'Content-Type: application/json' -d '{"username":"demo","password":"x"}'   # 401
   curl -s -o /dev/null -w '%{http_code}\n' $B/api/bff/categories   # 401 (it was 500: requests without a token reached the services)
   ```
   Then open the site, use one-click login on each demo account, and from another machine confirm that the
   database ports (15432, 5433-5437) are closed.
9. When done: record how the services run in the Server section, delete this Pending section and tell the
   user. For the portfolio screenshot of this app, capture the dashboard, not the login page: it shows the
   demo password.
