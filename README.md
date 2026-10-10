# CloudSheep

Jedna Next.js aplikacija: javni sajt `cloudsheep.dev` (en, sr), admin panel na `/admin` i
API na `/api` (ADR 0009). Baza je Postgres preko Prisma-e, a deploy je jedan Docker image
iz CI-ja (ADR 0017).

## Quickstart

```bash
corepack enable
pnpm install
docker compose -f infra/docker-compose.dev.yml up -d   # Postgres: appdb + appdb_test na :5432
cp .env.example .env                                     # popuni JWT_SECRET i SEED_ADMIN_*
pnpm db:deploy && pnpm db:seed                           # šema + početni sadržaj i admin nalog
pnpm dev                                                 # http://localhost:3000
```

Admin je na http://localhost:3000/admin (nalog iz `SEED_ADMIN_EMAIL/PASSWORD`). Bez SMTP-a
u `.env` dev server ne šalje mejl, nego link za potvrdu upita i newslettera ispiše u log.

## Komande

```bash
pnpm dev              # dev server
pnpm test             # Vitest: unit + baza (appdb_test)
pnpm e2e              # Playwright nad produkcionim build-om
pnpm lint             # ESLint (sa pravilima repoa iz eslint-rules/)
pnpm typecheck        # tsc --noEmit
pnpm build            # produkcioni build (standalone)
pnpm size             # JS budžet po javnoj ruti (200 KB gzip, ADR 0014)
pnpm lh               # Lighthouse CI
pnpm validate         # typecheck · lint · test · build · size — mora proći pre PR-a
```

## Provera produkcionog image-a lokalno

```bash
docker build -t cloudsheep:local .
export JWT_SECRET=$(openssl rand -hex 24) SEED_ADMIN_PASSWORD=$(openssl rand -hex 12)
docker compose -f infra/docker-compose.yml up          # app :3000, Mailpit :8025, mem_limit 768m
```

Detalji i e2e nad image-om su u [`DEPLOYMENT.md`](DEPLOYMENT.md) §4.

## Stek

Next.js 16 (App Router, Turbopack, standalone) · React 19.2 + React Compiler · TypeScript 6
· next-yak (CSS bez runtime-a) · next-intl · Redux Toolkit + RTK Query (admin) · react-hook-form
+ zod 4 · Prisma 6 + PostgreSQL 17 · nodemailer (Gmail SMTP) · Vitest 4 · Playwright

Pinovane verzije su u [`docs/16-tooling-ci.md`](docs/16-tooling-ci.md) §1.

## Dokumentacija

**Počni od [`docs/README.md`](docs/README.md).** Tamo su redosled čitanja i mapa po zadatku.
Pravila za AI agente su u [`CLAUDE.md`](CLAUDE.md), a arhitektonske odluke u [`docs/adr/`](docs/adr/).

## Deploy

Push u `prod` → CI (provera, image na GHCR) → Coolify webhook → pull + restart. Na serveru se
ništa ne gradi. Grane, env promenljive i rollback su u [`DEPLOYMENT.md`](DEPLOYMENT.md), server
u [`infra/SERVER-SETUP.md`](infra/SERVER-SETUP.md), a Coolify u [`infra/COOLIFY.md`](infra/COOLIFY.md).
