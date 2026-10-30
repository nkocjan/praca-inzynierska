# syntax=docker/dockerfile:1

# ── Build (React + Vite) ──────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Produkcyjny build: VITE_API_URL=/api z .env.production
RUN npm run build

# ── Serwer statyczny ──────────────────────────────────────────
# TLS, domenę i proxy /api do BFF obsługuje brama (Caddy z repo my_own_page).
FROM caddy:2-alpine
COPY docker/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
