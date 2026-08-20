# CloudSheep

pnpm monorepo iz koga se prave nezavisne React SPA aplikacije koje dele UI, state
infrastrukturu, i18n, utils i tooling.

## Quickstart

```bash
corepack enable && corepack prepare pnpm@latest --activate
pnpm install
pnpm dev --filter=web
```

Otvori http://localhost:5173.

Za `admin` i `api` treba i baza i `.env`:

```bash
docker run -d --name cs-pg -p 5432:5432 \
  -e POSTGRES_USER=app -e POSTGRES_PASSWORD=app -e POSTGRES_DB=appdb postgres:17-alpine

cp apps/api/.env.example apps/api/.env
cp apps/admin/.env.example apps/admin/.env

pnpm --filter api migrate:dev
pnpm --filter api db:seed   # traži SEED_ADMIN_EMAIL i SEED_ADMIN_PASSWORD
pnpm dev --filter=api       # :3000
pnpm dev --filter=admin     # :5174
```

## Provera produkcionog builda lokalno

Isti Docker image-i koji idu na server, na tvojoj mašini:

```bash
docker compose -f infra/docker-compose.yml up --build
```

|                                    |                |
| ---------------------------------- | -------------- |
| http://localhost:8080              | `web`          |
| http://localhost:8081              | `admin`        |
| http://localhost:3000/health       | `api` liveness |
| http://localhost:3000/health/ready | `api` + baza   |

Vredi pokrenuti pre svakog push-a u `prod`: CSP greške, polomljen SPA fallback i
build-time env varijable koje fale **ne postoje** u `pnpm dev` režimu.

## Aplikacije

| App                        | Šta je                          | Deploy                                   |
| -------------------------- | ------------------------------- | ---------------------------------------- |
| [`apps/web`](apps/web)     | cloudsheep.dev — javni sajt     | Coolify `web` → `cloudsheep.dev`         |
| [`apps/admin`](apps/admin) | interni panel iza autentikacije | Coolify `admin` → `admin.cloudsheep.dev` |
| [`apps/api`](apps/api)     | Express + Prisma backend        | Coolify `api` → `api.cloudsheep.dev`     |

## Paketi

`@app/ui` · `@app/core` · `@app/i18n` · `@app/utils` · `@app/hooks` · `@app/testing`
· `@app/eslint-config` · `@app/typescript-config` · `@app/tailwind-config` · `@app/vite-config`

## Komande

```bash
pnpm dev              # sve app-e (--filter=web za jednu)
pnpm test             # unit + integracija
pnpm e2e              # Playwright
pnpm lint             # ESLint
pnpm typecheck        # tsc --noEmit
pnpm build            # produkcijski build
pnpm size             # bundle budžeti
pnpm lh               # Lighthouse CI
pnpm validate         # sve gore — mora proći pre PR-a
```

## Stek

React 19.2 · TypeScript 6 · Vite 8 · React Compiler · React Router 8 · Redux Toolkit + RTK Query
· Tailwind v4 · shadcn/ui + Radix + CVA · react-hook-form + zod · i18next + ICU (sr/en)
· Vitest 4 + Testing Library + MSW · Playwright

Pinovane verzije: [`docs/16-tooling-ci.md`](docs/16-tooling-ci.md) §1.

## Dokumentacija

**Počni od [`docs/README.md`](docs/README.md)** — tamo je redosled čitanja i mapa po zadatku.

Najvažniji: [`docs/07-performance.md`](docs/07-performance.md) (pravila za `useEffect`,
`useMemo`, `useState`, bundle) i [`docs/01-architecture.md`](docs/01-architecture.md)
(gde kod treba da živi).

Pravila za AI agente: [`CLAUDE.md`](CLAUDE.md).
Arhitektonske odluke: [`docs/adr/`](docs/adr/).

## Deploy

Push u `prod` → Coolify webhook → Docker build → Traefik. Bez ručnog koraka.

### Env varijable

Najvažnija razlika, i najčešći uzrok „radi lokalno, ne radi na serveru":

| Varijabla          | Kada se čita                             | Gde se postavlja u Coolify | Resurs         |
| ------------------ | ---------------------------------------- | -------------------------- | -------------- |
| `VITE_API_URL`     | **build-time** — ugrađuje se u JS bundle | **Build Variables**        | `web`, `admin` |
| `VITE_APP_ENV`     | **build-time**                           | **Build Variables**        | `web`, `admin` |
| `DATABASE_URL`     | runtime                                  | Environment Variables      | `api`          |
| `JWT_SECRET`       | runtime                                  | Environment Variables      | `api`          |
| `CORS_ORIGINS`     | runtime                                  | Environment Variables      | `api`          |
| `COOKIE_DOMAIN`    | runtime                                  | Environment Variables      | `api`          |
| `NODE_ENV`, `PORT` | runtime                                  | Environment Variables      | `api`          |

`VITE_*` postavljena kao obična env varijabla **nema nikakvog efekta** — bundle je već
napravljen. Pun spisak sa komentarima: [`.env.example`](.env.example).

### Rollback

Coolify → resurs → Deployments → prethodni uspešan build → **Redeploy**. Traje sekunde,
image već postoji. Migracije se time **ne vraćaju** — vidi
[`infra/COOLIFY.md`](infra/COOLIFY.md) §7.

Grane, prvo puštanje i podešavanje servera:
[`DEPLOYMENT.md`](DEPLOYMENT.md) · [`infra/SERVER-SETUP.md`](infra/SERVER-SETUP.md) ·
[`infra/COOLIFY.md`](infra/COOLIFY.md).
