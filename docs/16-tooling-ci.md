# 16 — Tooling i CI

> Status: active | Last review: 2026-10-08

## 1. Verzije

Toolchain: **Node 24**, **pnpm 11.22.0** (kroz `corepack`). Jedna aplikacija u korenu — verzije
su tačne (bez `^`) u `package.json`; `pnpm-workspace.yaml` postoji samo zbog `allowBuilds`.

| Paket                                             | Verzija                      | Napomena                                                         |
| ------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------- |
| `next` / `@next/eslint-plugin-next`               | `16.3.8`                     | **ne 16.4.0** — vidi D                                           |
| `react` / `react-dom`                             | `19.2.8`                     |                                                                  |
| `babel-plugin-react-compiler`                     | `1.0.0`                      | exact pin (ADR 0001); Next ga koristi kroz `reactCompiler: true` |
| `next-yak`                                        | `9.10.2`                     | CSS u build-u (`withYak`, `transpilationMode: 'Css'`), ADR 0015 |
| `next-intl`                                       | `4.14.9`                     | API `use-intl`                                                   |
| `@reduxjs/toolkit` / `react-redux`                | `2.12.0` / `9.3.0`           |                                                                  |
| `react-hook-form` / `@hookform/resolvers` / `zod` | `7.85.0` / `5.7.1` / `4.4.3` |                                                                  |
| `prisma` / `@prisma/client`                       | `6.19.3`                     | **ne 7** — vidi C                                                |
| `typescript`                                      | `6.0.3`                      | **ne 7** — vidi A                                                |
| `eslint`                                          | `9.39.5`                     | **ne 10** — vidi B                                               |
| `vitest`                                          | `4.1.10`                     |                                                                  |
| `@playwright/test`                                | `1.62.1`                     |                                                                  |

### Odstupanja od „najnovije" — sa razlogom

**A. TypeScript 6, ne 7.** `typescript-eslint@8.67` ima peer `>=4.8.4 <6.1.0`; TS 7 bi isključio
type-aware lint, koji je glavni mehanizam za „bez `any`, bez `!`". _Revidirati kad typescript-eslint
podrži TS 7._ TS 6 je zastareo `baseUrl` — `paths` radi bez njega.

**B. ESLint 9, ne 10.** `eslint-plugin-import` i `eslint-plugin-jsx-a11y` još nemaju podršku za
ESLint 10, a a11y je error nivo. _Revidirati kad jsx-a11y podrži 10._

**C. Prisma 6, ne 7.** Sedmica izbacuje `url` iz `datasource` bloka i traži `prisma.config.ts` uz
driver adapter — to je druga postavka, ne nadogradnja. Šestica je podržana i poklapa se sa
`prisma migrate deploy` tokom pre deploy-a.

**D. Next 16.3.8, ne 16.4.0.** 16.4.0 je objavljen dva dana pre prelaska; pravilo repoa je da
verzija prođe karantin. 16.3.8 je poslednji patch stabilne grane.

## 2. Enforcement — pravilo bez lint rule je želja

| Pravilo                                       | Provera                                                    |
| --------------------------------------------- | ---------------------------------------------------------- |
| arrow funkcije (šablon §1.7)                  | `func-style: expression`, `prefer-arrow-callback`          |
| default export samo komponente / Next fajlovi | `import/no-default-export` + izuzeci po putanji            |
| komponenta ne čita store, rutu ni query       | `no-restricted-imports` u `src/components/**/*.tsx`        |
| `src/server` samo iz `app/` i `server/`       | `no-restricted-imports` za klijentske foldere              |
| javni linkovi kroz `@/i18n/navigation`        | `no-restricted-syntax` (zabranjen `next/link` van admin-a) |
| granice slojeva (docs/01 §4)                  | `import/no-restricted-paths`                               |
| bez literal stringova u UI                    | `i18next/no-literal-string`                                |
| boje samo iz teme                             | `@app/no-raw-colors` (`eslint-rules/`)                     |
| ≤ 2 `useState` po komponenti                  | `@app/max-usestate`                                        |
| `// effect:` komentar                         | `@app/require-effect-comment`                              |
| React Compiler, hookovi                       | `eslint-plugin-react-hooks` 7 (error)                      |
| a11y                                          | `eslint-plugin-jsx-a11y` (error)                           |
| bez `any`, bez `!`                            | `typescript-eslint` strict-type-checked                    |
| tokeni ne u localStorage                      | `no-restricted-properties`                                 |
| `sr.ts` ima sve ključeve iz `en.ts`           | TypeScript (`Messages` tip)                                |

Lokalna pravila su u `eslint-rules/` sa sopstvenim testovima (`RuleTester`), koji se izvršavaju u
`pnpm test`.

## 3. Skripte

| Skripta                                     | Šta                                                                                 |
| ------------------------------------------- | ----------------------------------------------------------------------------------- |
| `pnpm dev`                                  | `next dev` (treba Postgres — `docker compose -f infra/docker-compose.yml up -d db`) |
| `pnpm build`                                | `prisma generate && next build` → `.next/standalone`                                |
| `pnpm typecheck` / `lint` / `test` / `e2e`  |                                                                                     |
| `pnpm size`                                 | JS budžet po javnoj ruti (`scripts/check-size.mjs`)                                 |
| `pnpm lh`                                   | Lighthouse CI                                                                       |
| `pnpm db:migrate` / `db:deploy` / `db:seed` | Prisma                                                                              |
| `pnpm validate`                             | typecheck · lint · test · build · size                                              |

## 4. Git hookovi

`pre-commit`: lint-staged (ESLint --fix + Prettier na staged fajlovima) · `commit-msg`: commitlint
(conventional) · `pre-push`: `pnpm typecheck`.

## 5. CI i image

GitHub Actions (`.github/workflows/ci.yml`):

1. **validate** — typecheck, lint, test (sa pokrivenošću), build, size; Postgres kao service
   kontejner za `size`.
2. **image** — Docker build (`infra/Dockerfile`); na push u `prod` image se objavljuje na
   **GHCR** (`ghcr.io/<vlasnik>/cloudsheep:prod` i `:<sha>`).

**Server nikad ne gradi image** — ima 4 GB RAM-a, a `next build` troši 1,5–2,5 GB. Coolify povlači
gotov image sa GHCR-a (`infra/COOLIFY.md`).
