# Plan refaktorisanja: cloudsheep.dev → pnpm monorepo template

> Izvor: `SPEC-react-monorepo-template.md` (v2). Ovaj plan je radni dokument za trajanje
> refaktorisanja; posle F7 se briše, a izvor istine postaju `docs/*.md` + `CLAUDE.md`.
>
> **Odluke donete pre starta:** scope `@app` · app-ovi `web` + `admin` · jezici `sr`, `en` ·
> postojeći sajt se migrira u `apps/web` i refaktoriše po novim pravilima.

---

## 0. Preduslov — blokira sve

Node i pnpm ne postoje na ovoj mašini (nema ih u `/opt/homebrew/bin`, `/usr/local/bin`,
nema nvm/fnm/volta). Bez njih ne mogu ni F0 (pinovanje verzija), ni build, ni test, ni lint.

```bash
brew install node          # Node 22 LTS ili noviji
corepack enable            # pnpm dolazi kroz corepack
corepack prepare pnpm@latest --activate
node -v && pnpm -v         # očekivano: v22+ i 10+
```

Dok ovo ne prođe, radim samo dokumentaciju (F1–F2) i to bez F0 tabele verzija.

---

## 1. Šta postoji danas (polazno stanje)

| | |
|---|---|
| Struktura | single-app Vite SPA, `src/` sa `app/ components/ features/ hooks/ i18n/ layouts/ lib/ store/ styles/` |
| Veličina | 145 fajlova, ~4.640 linija |
| Feature-i | `landing` (8 sekcija), `projects`, `contact`, `uses`, `notFound` |
| UI | 8 primitiva u `components/ui/`, 14 kompozitnih u `components/` — svi folder+cva+barrel |
| State | Redux Toolkit + listener middleware za temu; `baseApi` postoji ali **nije registrovan** u store-u (namerno, zbog bundle-a) |
| i18n | jedan globalni `translation` namespace, `sr.json` + `en.json` |
| Testovi | **nema ih** — 0 fajlova |
| Kvalitet koda | 5 `useEffect`-a, svi već opravdani komentarom; max 2 `useState` po komponenti; 3 `useMemo`-a; cva dosledno |

**Zaključak:** kod je već usklađen sa duhom SPEC-a. Posao nije čišćenje koda nego
**restrukturiranje u monorepo + infrastruktura koje nema** (testovi, CI, budžeti, modal engine, docs).

---

## 2. Konflikti postojećih pravila i SPEC-a — moraju se rešiti ADR-om

Ovo su mesta gde `PROJECT_GUIDE.md` i SPEC govore različito. Ne improvizujem — svako ide u ADR.

| # | Postojeće pravilo | SPEC | Predlog |
|---|---|---|---|
| K1 | Komponenta = folder (`Button/Button.tsx` + `.variants.ts` + `index.ts`) | `packages/ui/src/ui/` **flat**, jer shadcn CLI tako generiše (§4.2) | **ADR 0007**: flat u `ui/` (da `shadcn add` radi bez ručnog preuređivanja), folder+variants u `atoms/molecules/organisms`. Postojećih 8 primitiva se spljošti. |
| K2 | Jedan globalni i18n namespace | namespace po feature-u, lazy sa chunk-om (§12) | Migracija: `landing.*` ključevi → `features/landing/locales/`, ostatak → `common.json`/`errors.json` |
| K3 | Tema preko `data-theme` atributa + `@custom-variant dark` | dark mode `class` strategija (§11) | **Zadržati `data-theme`** — radi, testirano, `@custom-variant` je legitiman Tailwind v4 pristup. Zapisati u ADR 0008 kao svesno odstupanje. |
| K4 | `baseApi` namerno van store-a zbog ~25 KB | jedan `baseApi` u `packages/core`, feature-i `injectEndpoints` (§6) | `apps/web` nema backend → ostaje isključen; `apps/admin` ga uključuje (ima `auth`). Isti paket, per-app registracija. |
| K5 | ESLint warning na `useEffect` import | `// effect:` komentar + custom lint pravilo (§10.3, §19) | Zameniti postojeći warning custom pravilom — jače je i pokriva oba zahteva |
| K6 | Prettier bez semicolon-a, `npm` | SPEC ne diktira | Zadržati postojeći `.prettierrc`; `npm` → `pnpm` |

**K7 — biznis odluka, ne tehnička:** `apps/web` je marketinški sajt sa Lighthouse budžetom
150 KB initial JS. Dodavanje `react-hook-form`, modal engine-a i RTKQ u njega troši budžet
bez potrebe. Predlog: sav taj aparat živi u `packages/*` i koristi ga **`apps/admin`**;
`apps/web` uvlači samo ono što stvarno renderuje. Ovo je i dokaz da packages/* rade za dve app-e.

---

## 3. Faze

### F0 — Verzije (blokirano dok nema Node-a)
`pnpm view <pkg> version` za svaki paket iz SPEC §2. Rezultat: tabela pinovanih verzija u
`docs/16-tooling-ci.md`. Posebno proveriti: React 19.2.x, `babel-plugin-react-compiler` (exact pin),
`eslint-plugin-react-hooks` v6 (postojeći je v5 — mora up), Vite 6+, Tailwind v4, Vitest 3, MSW 2.

**Deliverable:** tabela verzija · **Ne piše se kod.**

---

### F1 — Dokumentacija (31 MD fajl)

Svaki fajl: max ~200 linija, header `> Status: active | Last review: 2026-08-15`,
sekcije **Pravila / Primeri / Anti-patterns / Checklist**. Izvršiv, ne esejistički.

**`docs/` — 23 fajla**

| # | Fajl | Izvor u SPEC-u | Napomena |
|---|---|---|---|
| 1 | `docs/README.md` | §21 | index + reading order |
| 2 | `docs/00-overview.md` | §1 | web + admin, glosar |
| 3 | `docs/01-architecture.md` | §4, §27 | + kada migrirati na FSD |
| 4 | `docs/02-folder-structure.md` | §3 | kompletno stablo |
| 5 | `docs/03-naming-conventions.md` | §5 | + zabranjeni obrasci |
| 6 | `docs/04-state-management.md` | §6 | slice/selector/entityAdapter primeri |
| 7 | `docs/05-routing.md` | §7 | router.tsx, guard, preload link |
| 8 | `docs/06-modals.md` | §8 | **ceo kod modal engine-a** |
| 9 | `docs/07-performance.md` | §10, §27 | **najvažniji** — useMemo 3 slučaja, useEffect whitelist |
| 10 | `docs/08-styling-ui.md` | §11 | tokeni, CVA, dark mode, RTL |
| 11 | `docs/09-i18n.md` | §12 | ICU plural za srpski (one/few/other) |
| 12 | `docs/10-forms-validation.md` | §13 | RHF + zod, nula useState |
| 13 | `docs/11-data-fetching.md` | §14 | baseQuery kod, optimistic update |
| 14 | `docs/12-testing.md` | §18 | `renderWithProviders` API |
| 15 | `docs/13-hooks.md` | §9 | + katalog hookova |
| 16 | `docs/14-helpers-utils.md` | §15 | + katalog funkcija |
| 17 | `docs/15-accessibility.md` | §17 | |
| 18 | `docs/16-tooling-ci.md` | §19 + F0 | pinovane verzije, sva lint pravila i zašto |
| 19 | `docs/17-adding-new-app.md` | §23 | korak-po-korak |
| 20 | `docs/18-adding-new-feature.md` | §23 | korak-po-korak |
| 21 | `docs/19-code-review-checklist.md` | §26 | lista koju `/review` koristi |
| 22 | `docs/20-security.md` | §20 | |
| 23 | `docs/21-glossary.md` | §21 | |

**`docs/adr/` — 8 + 2 novih = 10 fajlova**

| # | Fajl | Odluka |
|---|---|---|
| 24 | `docs/adr/template.md` | Context / Decision / Consequences / Alternatives |
| 25 | `docs/adr/0000-initial-spec.md` | arhiva SPEC-a (fajl se premešta ovde) |
| 26 | `docs/adr/0001-react-compiler.md` | compiler ON, ručni memo OFF |
| 27 | `docs/adr/0002-router-choice.md` | React Router v7 vs TanStack Router |
| 28 | `docs/adr/0003-styling-choice.md` | Tailwind v4 vs Panda/vanilla-extract |
| 29 | `docs/adr/0004-feature-folders-vs-fsd.md` | + migracioni put |
| 30 | `docs/adr/0005-barrel-files.md` | barrel samo na granicama |
| 31 | `docs/adr/0006-modal-engine.md` | sopstveni Redux engine vs `@ebay/nice-modal-react` — **odluka se donosi u F4, ne sada** |
| 32 | `docs/adr/0007-ui-flat-vs-folder.md` | **novo** — K1 iz §2 |
| 33 | `docs/adr/0008-theme-data-attribute.md` | **novo** — K3 iz §2 |

**`CLAUDE.md` — 4 fajla**

| # | Fajl |
|---|---|
| 34 | `CLAUDE.md` (root, < 150 linija, zlatna pravila + mapa docs-a) |
| 35 | `apps/web/CLAUDE.md` |
| 36 | `apps/admin/CLAUDE.md` |
| 37 | `packages/ui/CLAUDE.md` |

**Sudbina postojećih MD fajlova:**
- `PROJECT_GUIDE.md` → sadržaj se raspoređuje po `docs/*`, fajl se **briše** (nema dva izvora istine)
- `DEPLOYMENT.md` → prepisuje se za monorepo (Vercel root directory po app-u), ostaje u rootu
- `README.md` → quickstart u < 5 komandi (DoD §26)
- `SPEC-react-monorepo-template.md` → `docs/adr/0000-initial-spec.md`

**Stop point:** pokazujem sve, čekam odobrenje. Kod se ne piše dok F1 nije odobren.

---

### F2 — Alati za razvoj (28 fajlova)

**`.claude/commands/` — 25 komandi.** Svaka: frontmatter (`description`, `argument-hint`,
`allowed-tools`) + telo koje kaže (a) koje `docs/` fajlove pročitati, (b) tačne korake,
(c) acceptance kriterijum.

- *Scaffolding (8):* `/new-app` `/new-feature` `/new-component` `/new-modal` `/new-hook` `/new-slice` `/new-endpoint` `/new-page`
- *Kvalitet (15):* `/review` `/perf-audit` `/audit-effects` `/audit-state` `/audit-memo` `/audit-boundaries` `/i18n-check` `/a11y-audit` `/test-gen` `/bundle-check` `/deps-check` `/adr` `/docs-sync` `/refactor-to-hook` `/explain-arch`
- *Release (2):* `/changeset` `/release-check`

**`.claude/agents/` — 3:** `perf-auditor` (read-only), `test-writer`, `arch-guard` (read-only).

**`.claude/settings.json`** — hooks: `PostToolUse` (lint+tsc na izmenjeni paket),
`PreToolUse` (blokiraj `pnpm-lock.yaml` i `docs/adr/*`), `Stop` (podseti na `/review` ako je diff > 100 linija).
Sintaksu hookova proveravam u zvaničnoj dokumentaciji — ne izmišljam polja.

---

### F3 — Skelet monorepa (bez feature koda)

`pnpm-workspace.yaml`, root `package.json` sa svim skriptama iz §25, `turbo.json`,
`packages/config/{eslint-config,typescript-config,tailwind-config,vite-config}`,
`.github/workflows/ci.yml` skelet, husky + lint-staged + commitlint, changesets.

Uključuje **custom ESLint pravila** (§19): `max-usestate` i `require-effect-comment`
u `packages/config/eslint-config/rules/` — SPEC eksplicitno kaže "napiši ih".

**Acceptance:** `pnpm validate` prolazi na praznom repou.

---

### F4 — `packages/*`

`utils` (100% coverage, jedna funkcija = jedan fajl = jedan test) → `hooks` → `i18n` →
`core` (store factory, baseApi, **modal engine — prvo odluka ADR 0006**, logger) →
`ui` (tokeni iz postojećeg `global.css`, migracija 8 primitiva + 14 kompozitnih) →
`testing` (`renderWithProviders`, MSW server, factories).

Redosled je namerno takav — zavisnosti idu samo naniže (§4.1).

**Acceptance:** svaki paket buildá i ima testove.

---

### F5 — Aplikacije

1. **`apps/web`** — migracija postojećeg sajta: `providers/ routes/ store/ pages/ features/ components/ hooks/ lib/ locales/ types/`.
   Postojeće stranice postaju `pages/` (samo kompozicija), sekcije ostaju u `features/landing/`.
   i18n se cepa na namespace-ove (K2). Sve rute lazy.
2. **`apps/admin`** — nova app sa kompletnim `auth` feature-om iz §24: RTKQ (`login/logout/me/refresh`),
   slice, `useAuth`/`useLogin`/`useLogout`, `LoginForm` (RHF+zod+i18n greške), `LoginModal` u registry-ju,
   `RequireAuth` guard, pun set testova, sr+en sa plural primerom. **0 `useEffect`, ≤ 2 `useState`.**

---

### F6 — CI i budžeti

GitHub Actions: `install → typecheck → lint → test+coverage → build → size-limit → lhci → e2e → changesets`,
sa `turbo --filter=[origin/dev]`. Coverage pragovi, `size-limit` (150 KB JS / 20 KB CSS gzip),
`lighthouserc.json` po app-u, Playwright e2e (login, logout, guard redirect, modal confirm, jezik, dark mode).

---

### F7 — Self-review

`/review` nad celim repoom protiv `docs/19`, pa Definition of Done iz §26 — uključujući dokaze:
namerno kršenje granice obara build, `/review` na namerno lošem kodu hvata sve tri greške,
`/new-feature test-feature` proizvodi feature koji odmah prolazi lint+test.

---

## 4. Git strategija

Rad ide na granu `refactor/monorepo`, jedan commit po fazi (`F1: docs`, `F2: claude tooling`, ...).
Grana `dev` ostaje netaknuta dok F7 ne prođe — sajt je live na Vercelu.
Vercel konfiguracija (`vercel.json`, root directory) se menja u F6, ne ranije.

---

## 5. Rizici

| Rizik | Ublažavanje |
|---|---|
| Lighthouse regresija na `apps/web` posle monorepo seobe | Izmeriti **pre** F5 (baseline: desktop 100 / mobile 92) i posle; K7 drži teške pakete van web-a |
| React Compiler menja ponašanje postojećih animacija (`useTypewriter`, `Reveal`, hero mousemove) | Compiler se uključuje u F3, a `apps/web` migrira u F5 — ima vremena da se uhvati razlika |
| `eslint-plugin-react-hooks` v5 → v6 prijavi lavinu grešaka | Očekivano; rešava se u F3 pre nego što ima puno koda |
| Obim: 62 MD fajla + 2 app-a + 7 paketa | Fazni stop-pointi; ne prelazim u sledeću fazu bez tvoje potvrde |
