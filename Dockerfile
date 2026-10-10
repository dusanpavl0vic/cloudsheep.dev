# syntax=docker/dockerfile:1.7
#
# Jedan image: sajt + admin + API (ADR 0009). Gradi se u CI-ju i ide na GHCR — VPS (4 GB)
# ga samo povlači, nikad ne gradi (infra/COOLIFY.md). Lokalna provera:
#   docker build -t cloudsheep . && docker compose -f infra/docker-compose.yml up

ARG NODE_IMAGE=node:24-alpine

FROM ${NODE_IMAGE} AS base
RUN corepack enable
WORKDIR /app

# ---- zavisnosti (keš dok se lockfile ne promeni) ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ---- build ----
FROM base AS build
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_* ulaze u bundle pri build-u; promena traži nov image.
ARG NEXT_PUBLIC_SITE_URL=https://cloudsheep.dev
ARG NEXT_PUBLIC_APP_ENV=production
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} NEXT_PUBLIC_APP_ENV=${NEXT_PUBLIC_APP_ENV}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build && pnpm build:seed

# ---- Prisma CLI za `migrate deploy` (standalone ga ne prati) ----
FROM ${NODE_IMAGE} AS prisma-cli
RUN npm install --prefix /opt/prisma --omit=dev --no-audit --no-fund prisma@6.19.3

# ---- runtime ----
FROM ${NODE_IMAGE} AS runner
WORKDIR /app
# Prisma engine na Alpine-u traži OpenSSL 3.
RUN apk add --no-cache openssl && addgroup -S app && adduser -S app -G app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    UPLOAD_DIR=/app/uploads \
    # Heap ispod mem_limit-a kontejnera (768m): GC radi pre nego što kernel ubije proces.
    NODE_OPTIONS=--max-old-space-size=384

COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
COPY --from=build --chown=app:app /app/prisma ./prisma
COPY --from=build --chown=app:app /app/dist/seed.cjs ./dist/seed.cjs
COPY --from=prisma-cli /opt/prisma /opt/prisma
COPY --chown=app:app --chmod=755 scripts/docker-start.sh ./start.sh
RUN mkdir -p /app/uploads && chown app:app /app/uploads

USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["./start.sh"]
