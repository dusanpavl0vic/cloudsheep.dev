# 21 — Rečnik pojmova

> Status: active | Last review: 2026-08-15

Pojmovi kako se koriste **u ovom repou**. Isti termin drugde može značiti nešto drugo.

## Struktura

| Pojam | Značenje ovde |
|---|---|
| **app** | nezavisna aplikacija u `apps/*` sa sopstvenim build-om i deploy-em |
| **paket** | deljena biblioteka u `packages/*`, ime `@app/<x>` |
| **feature** | domenski modul u `apps/<x>/src/features/<ime>/`; briše se `rm -rf` bez posledica |
| **page** | route-level komponenta u `pages/` — **samo kompozicija**, bez logike |
| **barrel** | `index.ts` koji re-eksportuje; dozvoljen **samo** na granici feature-a/paketa |
| **public API feature-a** | ono što `index.ts` eksportuje: hookovi, tipovi, komponente — nikad slice |
| **primitiv** | shadcn komponenta u `packages/ui/src/ui/`, flat fajl, `kebab-case` |
| **atom / molecule / organism** | slojevi dizajn sistema u `packages/ui`, folder + cva |
| **granica sloja** | pravilo ko koga sme da uvozi, enforce-ovano `no-restricted-paths` |
| **catalog** | pnpm mehanizam za jednu verziju paketa kroz ceo monorepo (`"react": "catalog:"`) |

## State

| Pojam | Značenje ovde |
|---|---|
| **server state** | podaci sa API-ja → **uvek** RTK Query, nikad slice |
| **client state** | globalni UI state (tema, jezik, sesija, modali) → Redux slice |
| **lokalni state** | `useState`/`useReducer` unutar jedne komponente |
| **URL state** | filteri, paginacija, tabovi → `useSearchParams`, ne Redux |
| **slice** | `createSlice` rezultat; ime fajla `<domain>.slice.ts` |
| **selektor** | funkcija `(state) => vrednost`; izvodeći uvek `createSelector` |
| **selector factory** | funkcija koja pravi parametrizovan selektor; jedan od 3 dozvoljena `useMemo` slučaja |
| **entity adapter** | `createEntityAdapter` — normalizovana kolekcija |
| **lazy reducer** | reducer registrovan tek kad se feature učita (`injectReducer`) |
| **listener middleware** | RTK mehanizam za side-effect na akciju — zamena za `useEffect` |

## Podaci

| Pojam | Značenje ovde |
|---|---|
| **`baseApi`** | jedini `createApi` u repou, u `@app/core` |
| **`injectEndpoints`** | način na koji feature dodaje endpointe u `baseApi` |
| **tag** | RTKQ oznaka za cache invalidaciju (`providesTags`/`invalidatesTags`) |
| **optimistic update** | UI se menja pre odgovora servera; `onQueryStarted` + `updateQueryData` |
| **refresh mutex** | brava koja sprečava paralelne refresh pozive pri više 401 odgovora |
| **`AppError`** | normalizovana greška `{ code, messageKey, status, details }` |

## UI i stil

| Pojam | Značenje ovde |
|---|---|
| **token** | CSS varijabla u `theme.css`; jedini izvor boja/radijusa |
| **semantička klasa** | `bg-primary`, `text-muted-foreground` — nikad `bg-blue-500` |
| **CVA** | `class-variance-authority`; jedini način za varijante |
| **`cn()`** | `clsx` + `tailwind-merge` |
| **inverzna površina** | tamna traka (footer, CTA) koja ostaje tamna i u svetloj temi |
| **`tone` varijanta** | `'default' \| 'inverse'` — ista komponenta na obe podloge |
| **FOUC** | bljesak pogrešne teme pre hidratacije; rešava inline script u `index.html` |

## i18n

| Pojam | Značenje ovde |
|---|---|
| **namespace** | grupa prevoda, jedna po feature-u (`auth`, `landing`) + globalni `common`/`errors` |
| **ICU** | format za plural/rod; srpski ima `one`/`few`/`other` |
| **`cimode`** | test režim gde `t('a.b')` vraća `'a.b'` — testira se ključ, ne prevod |
| **formatter** | `Intl.*` omotač u `@app/i18n` za brojeve, datume, valute |

## Kvalitet

| Pojam | Značenje ovde |
|---|---|
| **`// effect:` komentar** | obavezan iznad svakog `useEffect`-a; **naše pravilo**, ne industrijski standard |
| **`// memo:` komentar** | obavezan iznad `useMemo`/`useCallback`; navodi koji od 3 razloga |
| **whitelist** | spisak dozvoljenih upotreba `useEffect`-a ([`07`](07-performance.md) §3) |
| **budžet** | tvrd limit veličine bundle-a; obara CI |
| **blocker / major / minor** | nivoi ozbiljnosti u `/review` ([`19`](19-code-review-checklist.md)) |
| **drift** | razilaženje koda i dokumentacije — glavni rizik repoa |
| **ADR** | zapisana arhitektonska odluka u `docs/adr/` |
| **DoD** | Definition of Done — lista u [`19`](19-code-review-checklist.md) i ADR 0000 §26 |
| **factory** | `makeUser({ role: 'admin' })` — test podaci, umesto JSON blobova |

## Skraćenice

| | |
|---|---|
| **RTK / RTKQ** | Redux Toolkit / RTK Query |
| **RHF** | react-hook-form |
| **RTL** | dvosmisleno: *Testing Library* (testovi) ili *right-to-left* (stil) — iz konteksta |
| **CVA** | class-variance-authority |
| **FSD** | Feature-Sliced Design — metodologija koju **ne** koristimo ([`adr/0004`](adr/0004-feature-folders-vs-fsd.md)) |
| **LCP / CLS / INP / TBT** | Core Web Vitals ([`07`](07-performance.md) §7) |
| **LHCI** | Lighthouse CI |
| **MSW** | Mock Service Worker |
| **CSP** | Content Security Policy |
| **FOUC** | Flash of Unstyled Content |

## Namerno ne koristimo

| Pojam | Zašto |
|---|---|
| **widget** | FSD terminologija; sadržaj ide u `components/` ili `pages/` |
| **entity** (kao sloj) | FSD sloj; najčešći izvor rasprava "da li je ovo entity ili feature" |
| **container / view** | stara podela na smart/dumb; kod nas to rešava hook-first pravilo |
| **shared** | zamenjeno sa `lib/`, `components/`, `hooks/` — imena koja developer već zna |
| **helper / util** (kao ime fajla) | ime bez značenja; fajl se imenuje po poslu |
