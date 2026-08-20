# Build context je KOREN monorepoa, ne `apps/web`:
#   docker build -f infra/docker/web.Dockerfile .
# U Coolify-u to znači Base Directory `/`.

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

# Koren repoa ima `"prepare": "husky"`, a `.git` nije u build kontekstu.
ENV HUSKY=0

# ── deps ────────────────────────────────────────────────────────────────────────
# Samo manifesti, pre koda. Docker keš na `pnpm install` tako preživi svaku izmenu
# izvornog koda — a to je najskuplji sloj u celom buildu.
#
# Manifesti se nabrajaju eksplicitno. Postoji trik sa `find`-om koji ih kupi sam, ali
# je krhak i tiho instalira pogrešno kad neko doda paket; ovde je bolje da build pukne.
FROM base AS deps

# `.npmrc` NIJE opcion: nosi `node-linker=isolated` i `strict-peer-dependencies=true`.
# Bez njega install proizvede drugačije stablo od onog koje lockfile opisuje.
COPY .npmrc pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# `--frozen-lockfile` proverava lockfile prema CELOM workspace-u, pa svi manifesti moraju
# biti tu čak i za app-u koju ne gradimo.
COPY apps/web/package.json                       apps/web/
COPY apps/admin/package.json                     apps/admin/
COPY apps/api/package.json                       apps/api/
COPY packages/core/package.json                  packages/core/
COPY packages/hooks/package.json                 packages/hooks/
COPY packages/i18n/package.json                  packages/i18n/
COPY packages/testing/package.json               packages/testing/
COPY packages/ui/package.json                    packages/ui/
COPY packages/utils/package.json                 packages/utils/
COPY packages/config/eslint-config/package.json  packages/config/eslint-config/
COPY packages/config/tailwind-config/package.json packages/config/tailwind-config/
COPY packages/config/typescript-config/package.json packages/config/typescript-config/
COPY packages/config/vite-config/package.json    packages/config/vite-config/

# `web...` = web i sve od čega zavisi. Bez toga bi se instalirale i `api` zavisnosti
# (Prisma engine, ~50 MB) koje ovaj image nikad neće videti.
RUN pnpm install --frozen-lockfile --filter "web..."

# ── build ───────────────────────────────────────────────────────────────────────
FROM deps AS build
COPY . .

# VITE_* su BUILD-TIME. Vite ih ugrađuje u bundle; runtime env varijabla u kontejneru
# ne postoji jer se JS više ne prevodi. Zato ARG, a u Coolify-u "Build Variables".
ARG VITE_API_URL
ARG VITE_APP_ENV=production
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_ENV=$VITE_APP_ENV

RUN pnpm --filter web build

# ── runtime ─────────────────────────────────────────────────────────────────────
FROM nginx:alpine AS runtime

COPY infra/nginx/spa.conf              /etc/nginx/conf.d/default.conf
COPY infra/nginx/security-headers.conf /etc/nginx/conf.d/security-headers.conf

# CSP `connect-src` mora da zna gde je API. Ista vrednost kao VITE_API_URL — ako se
# raziđu, app zove adresu koju CSP blokira.
ARG VITE_API_URL
RUN sed -i "s|__API_ORIGIN__|${VITE_API_URL}|" /etc/nginx/conf.d/security-headers.conf

COPY --from=build /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
