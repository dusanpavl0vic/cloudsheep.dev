# Build context je KOREN monorepoa (u Coolify-u: Base Directory `/`).
#
# `api` nema nijednu `workspace:*` zavisnost u produkciji — namerno. Da je ima, runtime
# image bi morao da nosi i TypeScript izvor tih paketa (`@app/*` izvoze `.ts`, ne `dist`),
# a Node ne izvršava `.ts`.

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

# Koren repoa ima `"prepare": "husky"`. `.git` nije u build kontekstu, pa husky nema šta
# da instalira — ovo mu ne da ni da pokuša.
ENV HUSKY=0

# ── deps ────────────────────────────────────────────────────────────────────────
FROM base AS deps

COPY .npmrc pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Svi manifesti, jer `--frozen-lockfile` proverava lockfile prema celom workspace-u.
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

RUN pnpm install --frozen-lockfile --filter "api..."

# ── build ───────────────────────────────────────────────────────────────────────
FROM deps AS build
COPY . .

# `build` = `prisma generate && tsc -b`. Redosled je bitan: `tsc` proverava tipove
# generisanog klijenta, pa `generate` mora prvi.
RUN pnpm --filter api build

# `pnpm deploy` pravi samostalan folder: `dist`, `prisma/` i node_modules bez dev
# zavisnosti, bez workspace simlinkova. `--legacy` je obavezan jer `node-linker=isolated`
# (`.npmrc`) inače traži `inject-workspace-packages`. Šta se kopira bira `files` polje
# u `apps/api/package.json`.
RUN pnpm deploy --filter=api --prod --legacy /prod/api

# `prisma generate` MORA ponovo, ovde.
#
# `pnpm deploy` radi svež install u ciljnom folderu, pa `@prisma/client` tamo dolazi
# negenerisan — postinstall ne nađe schema.prisma i tiho ostavi stub. Build prođe,
# a kontejner padne na prvom upitu sa „@prisma/client did not initialize yet".
RUN cd /prod/api && ./node_modules/.bin/prisma generate

# ── runtime ─────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /prod/api ./

# Folder za otpremljene datoteke se pravi OVDE, pre `USER node`.
#
# Docker prazan imenovani volumen inicijalizuje sadržajem i VLASNIŠTVOM putanje iz image-a.
# Da se folder pravi tek pri prvom upload-u, vlasnik bi bio root, a proces radi kao `node` —
# i prvi upload bi pao na EACCES, tek u produkciji.
RUN mkdir -p /app/uploads

# Ne radi kao root. `node` korisnik već postoji u zvaničnom image-u.
RUN chown -R node:node /app
USER node

# Otpremljene datoteke su STANJE van baze — ne ulaze u backup Postgresa.
# U Coolify-u ovome odgovara „Persistent Storage" na resursu `api` (infra/COOLIFY.md).
VOLUME ["/app/uploads"]

EXPOSE 3000

# Gleda `/health` (liveness), NE `/health/ready` — ovaj drugi zove bazu, pa bi pad
# Postgresa restartovao API u petlji zbog tuđeg kvara.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

# Migracije se NE pokreću ovde — to je Coolify pre-deployment komanda, inače bi se
# izvršavale na svaki restart kontejnera i na svaku repliku paralelno:
#   ./node_modules/.bin/prisma migrate deploy
CMD ["node", "dist/main.js"]
