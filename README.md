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

## Aplikacije

| App | Šta je | Deploy |
|---|---|---|
| [`apps/web`](apps/web) | cloudsheep.dev — javni sajt | Vercel `cloudsheep-web` |
| [`apps/admin`](apps/admin) | interni panel iza autentikacije | Vercel `cloudsheep-admin` |

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

Grane: `dev` → preview · `main` → test · `prod` → production.
Detalji: [`DEPLOYMENT.md`](DEPLOYMENT.md).
