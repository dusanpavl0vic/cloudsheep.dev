# Isto kao `web.Dockerfile`, tri razlike: `--filter admin`, drugi `dist`, i `noindex`.
# Build context je KOREN monorepoa (u Coolify-u: Base Directory `/`).

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

# Koren repoa ima `"prepare": "husky"`, a `.git` nije u build kontekstu.
ENV HUSKY=0

# ── deps ────────────────────────────────────────────────────────────────────────
FROM base AS deps

COPY .npmrc pnpm-lock.yaml pnpm-workspace.yaml package.json ./

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

RUN pnpm install --frozen-lockfile --filter "admin..."

# ── build ───────────────────────────────────────────────────────────────────────
FROM deps AS build
COPY . .

# `admin/src/lib/env.ts` obe varijable validira zodom pri učitavanju modula. Ako fale,
# build PROLAZI (Vite ugradi `undefined`), a app puca u pretraživaču pri prvom otvaranju.
ARG VITE_API_URL
ARG VITE_APP_ENV=production
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_ENV=$VITE_APP_ENV

RUN pnpm --filter admin build

# ── runtime ─────────────────────────────────────────────────────────────────────
FROM nginx:alpine AS runtime

COPY infra/nginx/spa.conf              /etc/nginx/conf.d/default.conf
COPY infra/nginx/security-headers.conf /etc/nginx/conf.d/security-headers.conf

ARG VITE_API_URL
RUN sed -i "s|__API_ORIGIN__|${VITE_API_URL}|" /etc/nginx/conf.d/security-headers.conf \
    # Interni panel nema šta da traži u pretrazi. `web` ovu liniju namerno nema.
 && sed -i 's|# __ROBOTS__|add_header X-Robots-Tag "noindex, nofollow" always;|' /etc/nginx/conf.d/default.conf

COPY --from=build /app/apps/admin/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
