# 00 — Pregled

> Status: active | Last review: 2026-08-15

## Šta je ovo

pnpm monorepo iz koga se prave **nezavisne React SPA aplikacije** koje dele UI, state
infrastrukturu, i18n, utils i tooling. Nije SSR framework, nije Next.js, nije React Native.

Cilj strukture: developer koji prvi put uđe u repo **ne mora ništa da uči** — svaki folder
nosi ime koje već zna. Nema izmišljene terminologije.

## Aplikacije

| App | Šta je | Ruta | Deploy |
|---|---|---|---|
| `apps/web` | cloudsheep.dev — javni marketinški sajt | `/` | Vercel `cloudsheep-web` |
| `apps/admin` | interni panel iza autentikacije | `/` (odvojen domen) | Vercel `cloudsheep-admin` |

Obe app-e buildaju nezavisno i dele `packages/*`. Nova app se dodaje sa `/new-app`
(vidi [`17-adding-new-app.md`](17-adding-new-app.md)).

## Paketi

| Paket | Sadržaj | Sme da zavisi od |
|---|---|---|
| `@app/utils` | čiste funkcije, zero React | **ničega** |
| `@app/hooks` | generički React hookovi | `utils` |
| `@app/i18n` | i18next init, formatteri, registry jezika | `utils` |
| `@app/core` | store factory, `baseApi`, modal engine, logger | `utils` |
| `@app/ui` | dizajn sistem | `utils`, `hooks` |
| `@app/testing` | `renderWithProviders`, MSW, factories | sve |
| `@app/eslint-config`, `@app/typescript-config`, `@app/tailwind-config`, `@app/vite-config` | deljena konfiguracija | — |

**`@app/ui` ne sme da zna za `core`/store.** Komponenta dizajn sistema prima sve preko propsa.
Kompletna pravila zavisnosti: [`01-architecture.md`](01-architecture.md).

## Stek

React 19.2 · TypeScript 6 · Vite 8 (rolldown) · React Compiler 1.0 · React Router 8 ·
Redux Toolkit 2 + RTK Query · Tailwind v4 · shadcn/ui + Radix + CVA · react-hook-form + zod 4 ·
i18next 26 + ICU · Vitest 4 + Testing Library + MSW 2 · Playwright.

Pinovane verzije i obrazloženja odstupanja: [`16-tooling-ci.md`](16-tooling-ci.md) §1.

## Komande

```bash
pnpm dev                    # sve app-e
pnpm dev --filter=web       # jedna
pnpm test                   # unit + integracija
pnpm e2e                    # Playwright
pnpm lint                   # ESLint
pnpm typecheck              # tsc --noEmit
pnpm build                  # produkcijski build
pnpm size                   # bundle budžeti
pnpm lh                     # Lighthouse CI
pnpm validate               # sve gore — ovo mora proći pre PR-a
```

## Glosar (kratko)

Pun spisak: [`21-glossary.md`](21-glossary.md).

| Pojam | Značenje ovde |
|---|---|
| **feature** | domenski modul u `apps/<x>/src/features/<ime>/` — briše se u jednom potezu |
| **page** | route-level komponenta, **samo kompozicija**, bez logike |
| **feature hook** | jedini sloj koji zna za Redux; javni API feature-a |
| **barrel** | `index.ts` koji re-eksportuje; dozvoljen **samo** na granici feature-a/paketa |
| **server state** | podaci sa API-ja → uvek RTK Query, nikad slice |
| **client state** | globalni UI state → Redux slice |
| **primitiv** | shadcn komponenta u `packages/ui/src/ui/`, flat fajl |

## Tri pravila koja objašnjavaju sve ostalo

1. **Logika ide u hookove, komponente su glupe.** Komponenta ne zove `useSelector`,
   `useDispatch` ni RTKQ hook direktno — sve kroz feature hook.
2. **Svako pravilo ima lint rule.** Pravilo koje nije mašinski proverljivo biće prekršeno.
   Najveći rizik ovog repoa nije stek nego drift.
3. **Kod ide u `packages/` tek kad ga koristi druga app.** Prerano izdizanje je
   najčešća greška u monorepoima.
