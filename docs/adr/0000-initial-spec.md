# ADR 0000 — Inicijalni SPEC (arhiva)

> Status: **superseded by `docs/`** | Datum: 2026-08-15
>
> Ovo je izvorni ulazni dokument (`SPEC-react-monorepo-template.md`, v2) iz koga je generisana
> sva dokumentacija u `docs/`. **Arhiviran je i više nije izvor istine** — gde god se razilazi
> sa `docs/*.md`, važi `docs/`.
>
> Čuva se zbog konteksta: sadrži obrazloženja izbora, Definition of Done (§26) i iskrene
> napomene o granicama sopstvenih pravila (§27) koje su ugrađene u pojedinačne dokumente.
>
> **Poznata odstupanja implementacije od ovog SPEC-a:**
> - Verzije steka (§2) su zastarele — vidi [`docs/16-tooling-ci.md`](../16-tooling-ci.md) §1
> - `packages/ui` struktura — vidi [`0007`](0007-ui-flat-vs-folder.md)
> - Dark mode strategija — vidi [`0008`](0008-theme-data-attribute.md)
> - `vitest-axe` zamenjen `jest-axe`-om — vidi `docs/16` §1.5 C

---

# SPEC: React + pnpm Monorepo Template (multi-app, feature folders, performance-first)

> **Ovo je ulazni dokument za Claude Code.**
> Claude Code na osnovu ovog fajla treba da: (1) generiše `docs/` MD fajlove, (2) generiše `CLAUDE.md`,
> (3) generiše `.claude/commands/` slash komande i `.claude/agents/`, (4) skafolduje monorepo,
> i (5) **od tog trenutka nadalje se drži isključivo generisanih MD fajlova** kao izvora istine.
>
> Ovaj SPEC fajl se posle bootstrap-a arhivira u `docs/adr/0000-initial-spec.md`.
>
> **Verzija 2 — struktura usklađena sa mainstream praksom.** Vidi §29 za listu izmena u odnosu na v1.

---

## 0. Kako Claude Code treba da izvrši ovaj dokument

Izvršavaj u fazama. **Ne preskači faze, ne radi sve odjednom.** Posle svake faze stani i prijavi šta je urađeno.

| Faza | Šta se radi | Deliverable |
|---|---|---|
| F0 | Verifikuj najnovije stabilne verzije svih paketa iz §2 (`pnpm view <pkg> version`). Ako se verzija razlikuje od predložene, koristi noviju i zabeleži u `docs/16-tooling-ci.md`. | Tabela pinovanih verzija |
| F1 | Generiši **sve** MD fajlove iz §21 i §22. Prvo dokumentacija, tek onda kod. | `docs/*.md`, `CLAUDE.md` |
| F2 | Generiši `.claude/commands/*.md`, `.claude/agents/*.md`, `.claude/settings.json` hooks | Alati za razvoj |
| F3 | Skafolduj monorepo skelet (workspace, tooling, config paketi) — bez feature koda | Build prolazi prazan |
| F4 | Implementiraj `packages/*` (core, ui, i18n, utils, hooks, testing) | Paketi buildaju + testovi |
| F5 | Implementiraj `apps/web` sa jednim kompletnim feature-om (`auth`) kao živi primer svih pravila | App radi |
| F6 | CI, Lighthouse CI, bundle budžeti, coverage pragovi | Zeleni pipeline |
| F7 | Self-review preko `/review` komande + popravke | Definition of Done iz §26 |

**Pravilo:** svaki generisani MD fajl mora biti *izvršiv* — konkretna pravila, primeri koda, lista zabranjenih obrazaca.
Ne piši eseje. Ne piši "treba voditi računa o performansama" — piši "zabranjeno je X, umesto toga Y, evo koda".

---

## 1. Cilj i ne-ciljevi

**Cilj:** monorepo template iz koga se pravi N nezavisnih React SPA aplikacija koje dele UI, state infrastrukturu,
i18n, utils i tooling. Struktura mora biti **prepoznatljiva svakom React developeru koji uđe u projekat** —
bez custom terminologije koju treba učiti.

**Ne-ciljevi:**
- Nije SSR/Next.js framework. (Ako zatreba SSR za jednu app — to je ADR odluka, ne default.)
- Nije kanonski Feature-Sliced Design. (Vidi §4 i ADR 0004 za obrazloženje.)
- Nije React Native monorepo (može kasnije, kroz `packages/core` reuse).

---

## 2. Tehnički stek (pinuj verzije u F0)

### Jezgro
| Sloj | Izbor | Zašto |
|---|---|---|
| Package manager | **pnpm 10+** workspaces | strict node_modules, brz, nema phantom deps |
| Task runner | **Turborepo** | remote+local cache, task graph, `--filter` |
| Build | **Vite 6+** + `@vitejs/plugin-react` (Babel, ne SWC) | Babel je potreban za React Compiler plugin |
| Jezik | **TypeScript 5.7+**, `strict: true` + `noUncheckedIndexedAccess` | |
| React | **React 19.2.x** | Compiler, `use`, Actions, `useOptimistic` |
| React Compiler | `babel-plugin-react-compiler` **1.x, exact pin** | auto-memoizacija; vidi §10 |

### Aplikativni sloj
| Sloj | Izbor | Alternativa (razmotrena, odbačena) |
|---|---|---|
| Routing | **React Router v7** (declarative/data mode) | TanStack Router — bolji type-safety, manji ekosistem |
| Client state | **Redux Toolkit 2.x** | Zustand/Jotai — odbačeno, RTK je eksplicitan zahtev |
| Server state | **RTK Query** | TanStack Query — bolji cache API, ali RTKQ ostaje u istom store-u/devtools-u |
| Styling | **Tailwind CSS v4** (CSS-first, `@theme`) | vidi §11 |
| UI komponente | **shadcn/ui** (canary CLI, new-york style) + Radix + **CVA** | |
| Ikone | `lucide-react` (per-icon import) | |
| Forme | **react-hook-form 7.x** + **zod** + `@hookform/resolvers` | |
| i18n | **i18next** + `react-i18next` + `i18next-icu` + `i18next-browser-languagedetector` | |
| Notifikacije | `sonner` | shadcn deprecirao `toast` |
| Datumi | `date-fns` | `moment`/`dayjs` — odbačeno |
| Virtualizacija | `@tanstack/react-virtual` | obavezno za liste > 100 stavki |

### Kvalitet
| Sloj | Izbor |
|---|---|
| Unit/integration | **Vitest 3** + `@testing-library/react` + `@testing-library/user-event` |
| API mock | **MSW 2** |
| E2E | **Playwright** |
| A11y | `vitest-axe` + `@axe-core/playwright` |
| Lint | **ESLint 9 flat config** + `typescript-eslint` (strict-type-checked) + `eslint-plugin-react-hooks` v6 + `eslint-plugin-import` + `eslint-plugin-jsx-a11y` + `eslint-plugin-i18next` |
| Format | **Prettier 3** + `prettier-plugin-tailwindcss` |
| Git hooks | `husky` + `lint-staged` + `commitlint` |
| Versioning | `changesets` |
| Bundle budžet | `size-limit` + `rollup-plugin-visualizer` |
| Perf CI | `@lhci/cli` |

---

## 3. Struktura monorepa

Ovo je **standardni Turborepo layout** (`apps/` + `packages/`) sa **feature-folders** strukturom unutar aplikacije.
Nema izmišljene terminologije — svaki folder je ime koje React developer već zna.

```
.
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── main.tsx              # entry
│   │   │   ├── App.tsx               # root kompozicija
│   │   │   ├── providers/            # StoreProvider, I18nProvider, ThemeProvider, ErrorBoundary, ModalRoot
│   │   │   ├── routes/               # router.tsx, routes definicije, guards
│   │   │   ├── store/                # configureStore, rootReducer, middleware, hooks (useAppDispatch)
│   │   │   ├── pages/                # route-level komponente, BEZ logike (samo kompozicija)
│   │   │   ├── features/             # domenski moduli — vidi §4
│   │   │   │   └── auth/
│   │   │   │       ├── api/          # authApi.ts (RTKQ injectEndpoints)
│   │   │   │       ├── components/   # LoginForm.tsx, UserMenu.tsx
│   │   │   │       ├── modals/       # LoginModal.tsx
│   │   │   │       ├── hooks/        # useAuth.ts, useLogin.ts  ← javni API feature-a
│   │   │   │       ├── store/        # auth.slice.ts, auth.selectors.ts
│   │   │   │       ├── schemas/      # login.schema.ts (zod)
│   │   │   │       ├── locales/      # sr.json, en.json (namespace "auth")
│   │   │   │       ├── types.ts
│   │   │   │       ├── __tests__/
│   │   │   │       └── index.ts      # public API
│   │   │   ├── components/           # app-specifične deljene komponente (Header, Sidebar, Layout)
│   │   │   ├── hooks/                # app-specifični deljeni hookovi
│   │   │   ├── lib/                  # app-specifični helperi, cn(), konstante, config
│   │   │   ├── locales/              # common.json, errors.json (globalni namespace-ovi)
│   │   │   └── types/                # globalni tipovi, ambient deklaracije
│   │   ├── e2e/
│   │   ├── public/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── lighthouserc.json
│   └── admin/                        # druga app — ista struktura, deli packages/
│
├── packages/
│   ├── ui/                           # dizajn sistem (atomic — vidi §4.2)
│   │   ├── src/
│   │   │   ├── ui/                   # shadcn output — FLAT, tako CLI očekuje (button.tsx, dialog.tsx...)
│   │   │   ├── atoms/                # sopstveni primitivi (Icon, Text, Spinner)
│   │   │   ├── molecules/            # FormField, SearchInput, Card, Pagination
│   │   │   ├── organisms/            # DataTable, FilterPanel, ModalShell
│   │   │   ├── layouts/              # PageLayout, AuthLayout, SplitLayout
│   │   │   ├── lib/                  # cn(), CVA helperi
│   │   │   ├── styles/               # theme.css (@theme tokeni), globals.css
│   │   │   └── index.ts
│   │   └── components.json           # shadcn config
│   ├── core/                         # store factory, baseApi, modal engine, logger
│   ├── i18n/                         # i18next init, tipovi, formatteri, languages registry
│   ├── utils/                        # čiste funkcije, zero React deps
│   ├── hooks/                        # generički React hookovi
│   ├── testing/                      # renderWithProviders, MSW server, factories
│   └── config/
│       ├── eslint-config/
│       ├── typescript-config/
│       ├── tailwind-config/
│       └── vite-config/
│
├── docs/
├── .claude/
├── CLAUDE.md
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

**Naming paketa:** `@app/ui`, `@app/core`, `@app/utils`, `@app/i18n`, `@app/hooks`, `@app/testing`,
`@app/eslint-config`, `@app/typescript-config`. Zameni `@app` scope-om iz `/new-workspace` komande.

**Prag za izdizanje u `packages/`:** kod ide u `packages/` tek kad ga koristi **druga** aplikacija.
Do tada živi u `apps/<x>/lib` ili `apps/<x>/components`. Prerano izdizanje je najčešća greška u monorepoima.

---

## 4. Arhitektura i pravila zavisnosti

### 4.1 Feature folders (aplikacija)

Aplikacija se seče **po domenu**, ne po tipu fajla. Feature folder sadrži sve što taj domen treba
(API, komponente, hookove, slice, šeme, prevode, testove) i briše se u jednom potezu.

**Zašto ne kanonski FSD:** FSD (`app/pages/widgets/features/entities/shared` + segmenti `ui/model/api/lib`)
je rigorozniji i ima svoj linter (`steiger`, `@feature-sliced/eslint-config`). Legitiman je izbor, ali:
- `entities` sloj je najčešći izvor timskih rasprava ("da li je ovo entity ili feature?"),
- `widgets` sloj je terminologija koju treba učiti,
- za tim od 1–4 čoveka ceremonijal košta više nego što donosi.

Feature folders je ono što realno vidiš u većini profesionalnih React kodnih baza. **Ako projekat naraste
preko ~20 feature-a i 5+ developera, migracija na FSD je logičan sledeći korak** — zapiši to u `docs/01`.

**Hijerarhija (import sme samo naniže):**
```
providers / routes / store   →  sve
pages                        →  features, components, hooks, lib, packages
features                     →  components, hooks, lib, packages
                                ❌ feature NE SME importovati drugi feature
components / hooks / lib     →  packages
packages/ui                  →  packages/utils, packages/hooks   ❌ ne sme core/store
packages/core                →  packages/utils
packages/utils               →  ništa (zero-dep)
```

**Cross-feature komunikacija:** ako feature A treba nešto iz B → izdigni u `components/`/`hooks/`/`lib/`,
ili komuniciraj preko store-a. Direktan import feature↔feature je greška.

**Enforcement:** `eslint-plugin-import` sa `no-restricted-paths` zonama (standardan pristup, bez dodatnih plugina):
```js
'import/no-restricted-paths': ['error', { zones: [
  { target: './src/features/*', from: './src/features/*', except: ['./index.ts'] },
  { target: './src/components', from: './src/features' },
  { target: './src/lib', from: ['./src/features', './src/pages'] },
]}]
```

**Public API feature-a:** `index.ts` eksportuje **samo** hookove, tipove i komponente.
Slice, selektori i API endpointi se ne eksportuju napolje.
```ts
// features/auth/index.ts
export { useAuth, useLogin } from './hooks';
export { LoginForm } from './components/LoginForm';
export type { AuthUser } from './types';
// ❌ export { authSlice } — NIKAD
```

> **Trade-off koji treba znati (ADR 0005):** barrel fajlovi mogu pogoršati tree-shaking i usporiti Vite dev server
> na velikim repoima. Zato: barrel **samo** na granici feature-a i paketa, nikad unutar foldera
> (`components/index.ts` koji re-eksportuje 40 komponenti je anti-pattern). Meri sa `/bundle-check`.

### 4.2 Atomic design (samo u `packages/ui`)

Atomic ostaje tamo gde je jak — u dizajn sistemu bez domena:
`ui/` (shadcn primitivi, flat jer CLI tako generiše) → `atoms/` → `molecules/` → `organisms/` → `layouts/`.

Pravilo: komponenta u `packages/ui` **ne sme** znati za domen, store ni i18n ključeve.
Prima sve preko propsa. Ako joj treba `useAuth` — nije u `packages/ui`, nego u feature-u.

---

## 5. Konvencije imenovanja

| Entitet | Konvencija | Primer |
|---|---|---|
| Folder | `kebab-case` | `user-profile/` |
| React komponenta (fajl + export) | `PascalCase` | `UserCard.tsx` |
| Hook | `camelCase` sa `use` prefiksom | `useUserProfile.ts` |
| Slice | `<domain>.slice.ts` | `auth.slice.ts` |
| Selektori | `<domain>.selectors.ts`, export `select*` | `selectCurrentUser` |
| RTKQ API | `<domain>Api.ts` | `authApi.ts` |
| Zod šema | `<name>.schema.ts`, export `*Schema` | `loginSchema` |
| Tipovi | `types.ts`, bez `I` prefiksa | `type User = {}` |
| Test | kolokovan `*.test.ts(x)` | `useAuth.test.ts` |
| E2E | `e2e/*.spec.ts` | `login.spec.ts` |
| Konstante | `constants.ts`, `SCREAMING_SNAKE` | `MAX_UPLOAD_SIZE` |
| Barrel | `index.ts` — samo na granici feature-a/paketa | |

**Zabranjeno:** `default export` za komponente (osim lazy route modula), `utils.ts` kao kanta za smeće,
`components/` bez domena unutar feature-a, fajlovi > 200 linija, komponente > 150 linija.

---

## 6. State management

### Tri kategorije stanja — svaka ima jedno mesto
1. **Server state** → RTK Query. Nikad ne kopiraj RTKQ podatke u slice.
2. **Globalni client state** → Redux slice (session, tema, jezik, modali, sidebar).
3. **Lokalni UI state** → `useState`/`useReducer`. Ne dizati u Redux ako ne prelazi granicu komponente.

### Pravila
- `createSlice` uvek. `createAsyncThunk` samo za ne-HTTP async; HTTP ide kroz RTKQ.
- Lazy registracija reducera (`store.injectReducer`) za code-split feature-e.
- Selektori: `createSelector` za sve što izvodi/filtrira/mapira. Nikad inline `useSelector(s => s.x.list.filter(...))`.
- Parametrizovani selektori: selector factory + `useMemo` (legitiman slučaj, §10.2).
- Kolekcije: `createEntityAdapter`.
- `serializableCheck`/`immutableCheck` ON u dev, OFF u prod.

### RTK Query
- Jedan `baseApi` u `packages/core`; feature-i rade `injectEndpoints()`. Nikad drugi `createApi`.
- Invalidacija preko `providesTags`/`invalidatesTags`. Nema ručnog `refetch()` osim user-triggered.
- Nema `useEffect` + `fetch`. Ikad.

---

## 7. Routing

- `createBrowserRouter` sa objektnim rutama u `src/routes/router.tsx`.
- **Svaka ruta je lazy**: `lazy: () => import('@/pages/Dashboard')`.
- Guards kao wrapper komponente (`<RequireAuth>`) koje čitaju iz auth hooka — ne `useEffect` + `navigate`.
- URL query params su izvor istine za filtere/paginaciju (`useSearchParams`), **ne Redux**.
- Preload na hover: `<Link>` wrapper koji poziva `route.lazy()` na `onMouseEnter`.
- `errorElement` na root nivou + per-route gde ima smisla.
- Breadcrumbs iz `handle: { crumb }` na route objektu.

---

## 8. Modal / Dialog sistem (Redux-driven)

**Zahtev:** svi dijalozi se otvaraju preko Redux-a, ne preko lokalnog `isOpen` state-a.

> **Alternativa iz prakse (ADR 0006):** `@ebay/nice-modal-react` rešava tačno ovaj problem
> (promise-based modali, registry, bez lokalnog state-a) i široko se koristi. Ako je prioritet
> "manje sopstvenog koda" — uzmi nju. Ovde je opisan sopstveni engine jer je Redux eksplicitan zahtev
> i jer daje potpunu kontrolu nad devtools/time-travel. Proveri obe opcije u F4 pre odluke.

### Dizajn
```
packages/core/src/modals/
├── modal.slice.ts       # stack modala
├── modal.types.ts       # ModalId union, ModalPropsMap (type-safe payload)
├── useModal.ts          # javni hook API
└── ModalRoot.tsx        # jedini renderer, lazy-uje komponente
```

**Stack, ne single modal** — podržava confirm-preko-forme:
```ts
type ModalEntry<K extends ModalId = ModalId> = {
  key: string;
  id: K;
  props: ModalPropsMap[K];
  meta?: { dismissible?: boolean; size?: 'sm'|'md'|'lg'|'full' };
};
type ModalState = { stack: ModalEntry[] };
```

**Type-safe registry:**
```ts
// apps/web/src/providers/modalRegistry.ts
export const modalRegistry = {
  'confirm-delete': lazy(() => import('@/features/x/modals/ConfirmDelete')),
  'auth.login':     lazy(() => import('@/features/auth/modals/LoginModal')),
} satisfies Record<ModalId, LazyExoticComponent<any>>;

declare module '@app/core' {
  interface ModalPropsMap {
    'confirm-delete': { entityId: string; entityName: string };
    'auth.login': { redirectTo?: string };
  }
}
```

**Hook API:**
```ts
const { open, close, closeAll, isOpen } = useModal();
const confirmed = await open('confirm-delete', { entityId, entityName });
if (confirmed) deleteEntity(entityId);
```
Funkcije nisu serializable, pa `resolve` živi u `Map<key, resolve>` van Redux-a
(`packages/core/modals/resolvers.ts`); slice drži samo serializable podatke.
Ovo eliminiše klasičan `useEffect` koji sluša rezultat modala.

**ModalRoot pravila:** renderuje se jednom u `providers/`, ispod router-a; `<Suspense>` po ulazu;
Radix `Dialog` kao mehanika (focus trap, `aria-modal`, ESC, scroll lock); zatvaranje na route change
(jedan dokumentovan `useEffect`). Drawer/Sheet/AlertDialog su varijante istog sistema.

**Zabranjeno:** `useState(false)` za dijalog koji nosi domensku akciju.
Dozvoljeno samo za prezentacione popovere/tooltipove/dropdown-ove.

---

## 9. Hook-first pravilo

**Svaka funkcionalnost se izlaže kroz hook. Komponente su glupe.**

- Komponenta ne sme direktno da zove `useSelector`, `useDispatch` ili RTKQ hook — sve kroz feature hook.
- Feature hook je jedini sloj koji zna za Redux.
- Hook vraća objekat sa stabilnim ključevima: `{ data, isLoading, error, ...actions }`.
- Hook nikad ne vraća JSX. Hook koji radi više stvari se deli.

```ts
// ✅ features/auth/hooks/useAuth.ts
export function useAuth() {
  const user = useAppSelector(selectCurrentUser);
  const [login, { isLoading }] = useLoginMutation();
  return { user, isAuthenticated: user !== null, isLoading, login };
}

// ❌ u komponenti
const user = useSelector((s: RootState) => s.auth.user);
```

| Tip hooka | Lokacija |
|---|---|
| Domenski | `features/<x>/hooks/` |
| App-specifičan deljeni | `apps/<x>/src/hooks/` |
| Generički React | `packages/hooks` (`useDebounce`, `useMediaQuery`, `useIntersection`) |
| Store-tipizirani | `apps/<x>/src/store/hooks.ts` (`useAppDispatch`, `useAppSelector`) |
| UI (ne-domenski) | `packages/ui` (`useDisclosure`) |

---

## 10. Performanse

### 10.1 React Compiler je default
Uključi u deljenom Vite presetu za sve app-ove i `packages/ui`. `eslint-plugin-react-hooks` v6 nosi
compiler pravila — kršenje je **error**.

### 10.2 `useMemo` — korekcija zahteva
Uz uključen React Compiler, ručni `useMemo`/`useCallback` je uglavnom redundantan, a ponekad se sudara
sa compiler analizom. `useMemo` nije besplatan: alocira dependency array i poredi ga svaki render —
za jeftin izraz košta više nego sam izračun.

> `useMemo` je dozvoljen samo u tri slučaja, svaki sa komentarom `// memo: <razlog>`:
> 1. **Skupa kalkulacija** — O(n) ili gore nad kolekcijom, parsiranje/formatiranje u petlji.
> 2. **Referencijalna stabilnost** za vrednost koja ide u dependency array drugog hooka ili u context value.
> 3. **Selector factory** — `useMemo(() => makeSelectItemById(id), [id])`.

Legitimna alternativa: compiler OFF + ručna memoizacija. Ali ne oba. Preporuka: compiler ON. → ADR 0001.

### 10.3 `useEffect` — whitelist
Dozvoljen **samo** za sinhronizaciju sa spoljnim sistemom: pretplata na browser/DOM/3rd-party event
(prefer `useSyncExternalStore`), imperativni DOM rad (focus, scroll restore, canvas, mape), setup/teardown
ne-React biblioteke, analytics page-view, WebSocket lifecycle.

| Anti-pattern | Zamena |
|---|---|
| Fetch podataka | RTK Query hook |
| Derivirani state | izračunaj tokom rendera |
| Reset state-a na promenu prop-a | `key` prop |
| Sinhronizacija dva state-a | jedan izvor istine |
| Logika koja pripada handleru | u handler |
| Transformacija pred render | `select` u RTKQ ili `createSelector` |
| Slušanje rezultata modala | promise-based `useModal` (§8) |

Svaki `useEffect` mora imati komentar `// effect: <koji spoljni sistem sinhronizuje>`.

### 10.4 `useState` — max 2 po komponenti
Kad prekoračiš 2: (1) derivirano → izbriši; (2) povezana polja → `useReducer`; (3) forma → RHF;
(4) prelazi granicu komponente → Redux preko hooka; (5) URL state → `useSearchParams`.
Ako i dalje treba 3+ — komponenta radi previše. Podeli je.

### 10.5 Render-perf
- Liste > 100 stavki → `@tanstack/react-virtual`. Bez izuzetka.
- `key` nikad `index` za dinamičke liste.
- Context split na `StateContext`/`DispatchContext`; za često-menjajuće podatke koristi Redux, ne Context.
- `useDeferredValue` za search-as-you-type, `useTransition` za skupu navigaciju/filter.
- `content-visibility: auto` ispod fold-a.

### 10.6 Bundle
- Route-level splitting obavezan; feature-level za teške feature-e.
- Manual chunks: `react-vendor`, `redux-vendor`, `ui-vendor` (ne previše granularno).
- **Budžeti (CI fail):** initial JS gzip ≤ **150 KB**, CSS gzip ≤ **20 KB**, po ruti ≤ 60 KB.
- Zabranjeno: `moment`, ceo `lodash`, cele icon biblioteke.
- `import()` za: chart, rich text, PDF, mape, date picker.
- Novi dependency > 20 KB gzip → ADR.

### 10.7 Lighthouse
| Metrika | Cilj | Mehanizam |
|---|---|---|
| LCP | < 1.8 s | preload hero/font, `fetchpriority="high"` |
| CLS | 0 | `width`/`height` na `<img>`, `aspect-ratio`, rezervisani skeletoni, `font-display` + size-adjust |
| INP | < 200 ms | `useTransition`, virtualizacija, nema sinhronog rada > 50 ms u handleru |
| TBT | < 150 ms | code splitting, defer non-critical JS |
| Fontovi | self-hosted, subset `latin`+`latin-ext` (srpski), `woff2`, preload |
| Slike | AVIF/WebP, `<picture>`, `loading="lazy"` osim LCP, `srcset` |
| A11y 100 | jsx-a11y error, axe u CI, kontrast ≥ 4.5:1, focus-visible |
| Best practices | CSP, bez console grešaka, HTTPS, `rel="noopener"` |
| SEO | meta per route (React 19 `<title>`/`<meta>` hoisting), `lang` prati i18n |

**Pošteno:** Lighthouse 100 u lab-u (throttled, prazan cache) je ostvarivo za SPA. Field (CrUX) zavisi od
mreže i hostinga. LHCI assertions: 0.95+ performance, 1.0 a11y/best-practices/seo.

---

## 11. Styling & UI

**Izbor: Tailwind CSS v4.**

| Opcija | Za | Protiv |
|---|---|---|
| **Tailwind v4** ✅ | zero-runtime, ogroman ekosistem, shadcn radi samo sa njim, v4 engine drastično brži, `@theme` u CSS-u | dugački class stringovi |
| Panda CSS | zero-runtime, type-safe recepti | mali ekosistem, gubiš shadcn |
| vanilla-extract | zero-runtime, pun TS | verbozno, gubiš shadcn |
| CSS Modules | najjednostavnije | nema token sistem ni varijante |
| Emotion/styled-components ❌ | — | runtime CSS-in-JS, protiv Lighthouse cilja — **zabranjeno** |

**Pravila:**
- Tokeni **samo** u `packages/config/tailwind-config/theme.css` preko `@theme`. Nema hex vrednosti u komponentama.
- Boje u **OKLCH** (shadcn v4 default).
- Varijante **isključivo** preko CVA, nikad `clsx` lestvica uslova.
- `cn()` (`clsx` + `tailwind-merge`) u `packages/ui/lib`.
- shadcn output ide u `packages/ui/src/ui/` (flat) i **wrap-uje se** pre upotrebe u app-u.
- Dark mode: `class` strategija, tema u Redux + `localStorage`, inline script u `index.html` protiv FOUC-a.
- RTL: logička svojstva (`ps-4` umesto `pl-4`) svuda.

---

## 12. i18n

- **Struktura:** namespace po feature-u — `features/auth/locales/{sr,en}.json` → namespace `auth`.
  Globalni: `apps/<x>/src/locales/{common,errors}.json`.
- **Lazy loading:** namespace se učitava sa feature chunk-om (`i18n.loadNamespaces('auth')` u route loader-u).
- **Type-safety obavezan:**
```ts
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: typeof resources;
    returnNull: false;
  }
}
```
- **Ključevi:** `feature.section.element`. Nikad tekst kao ključ.
- **Plural/gender:** ICU (`i18next-icu`) — srpski ima 3 forme (`one`/`few`/`other`), obavezno testirati.
- **Brojevi/datumi/valute:** `Intl.*` preko formattera u `packages/i18n/formatters.ts`.
- **Jezici:** registry `{ code, label, dir, dateLocale }` — dodavanje jezika je izmena jednog niza. Default `sr`, `en`.
- **`<html lang>`/`dir`** prate aktivan jezik (jedan dokumentovan `useEffect`).
- **Tooling:** `i18next-parser` + CI check za nedostajuće/nekorišćene ključeve;
  `eslint-plugin-i18next/no-literal-string` kao **error** u `features/` i `pages/`.
- **Testovi:** `lng: 'cimode'` — testiraj ključeve, ne prevode.

---

## 13. Forme i validacija

- `react-hook-form` + `zodResolver`. **Nula `useState` u formama.**
- Zod šema je jedini izvor istine: `type LoginInput = z.infer<typeof loginSchema>`.
- Ista šema za validaciju API odgovora gde ima smisla (`safeParse` u `transformResponse`).
- `mode: 'onTouched'`, `reValidateMode: 'onChange'`.
- Poruke grešaka su i18n ključevi: `z.string().min(8, { message: 'auth.errors.passwordTooShort' })`.
- `FormField` iz `packages/ui` povezuje RHF ↔ shadcn ↔ a11y (`aria-invalid`, `aria-describedby`, `id`).
- Server greške → `setError` na polje, ne toast (osim 5xx).

---

## 14. Data fetching

- `baseQuery` sa: base URL iz env-a, auth header iz store-a, retry sa exponential backoff,
  401 → refresh mutex → re-issue, globalni error normalizer.
- `transformResponse` za snake_case → camelCase (jedno mesto).
- Optimistic updates preko `onQueryStarted` + `updateQueryData` — obavezno za toggle/like/delete (INP).
- Polling samo eksplicitno per-endpoint.
- Prefetch na hover: `dispatch(api.util.prefetch(...))`.
- Tipovi iz OpenAPI (`@rtk-query/codegen-openapi`) ako postoji shema.

---

## 15. Helperi i utils

`packages/utils` — čiste funkcije, bez React-a, **100% coverage**:
```
utils/src/
├── string/     slugify, truncate, capitalize, mask
├── number/     clamp, round, percentage, bytes
├── date/       isExpired, toISODate, diffInDays   // formatiranje je u i18n
├── array/      groupBy, uniqueBy, chunk, partition, sortBy
├── object/     pick, omit, deepMerge, isEmpty
├── validation/ isEmail, isJMBG, isPIB, isPhoneRS
├── storage/    typed localStorage wrapper (zod parse + try/catch)
├── url/        buildQuery, parseQuery
├── async/      sleep, withTimeout, pRetry
└── env/        zod-validiran env parser
```
Jedna funkcija = jedan fajl = jedan test. Bez `any`, bez side-efekata, bez direktnog `Date.now()`
(injektuj clock radi testabilnosti).

---

## 16. Error handling & observability

- `ErrorBoundary` na tri nivoa: app root, route, oko lazy widgeta. (`react-error-boundary`)
- Normalizovan `AppError`: `{ code, messageKey, status, details }` — UI prikazuje `t(messageKey)`.
- Globalni handleri: `window.onerror`, `unhandledrejection` → logger.
- `packages/core/logger.ts` — apstrakcija nad Sentry/console.
- Sentry opciono (ADR): source maps u CI, konzervativan `tracesSampleRate`, release iz changesets verzije.
- **Web Vitals:** `web-vitals` → analytics endpoint. Jedini način da znaš da li si stvarno na 100.

---

## 17. Pristupačnost

- Radix primitivi znače da su focus trap, roving tabindex i ARIA rešeni — ne pisati ručno.
- `eslint-plugin-jsx-a11y` recommended kao **error**.
- Obavezno: skip-link, `focus-visible`, landmark elementi, `aria-live` za toast, label linkovanje,
  kontrast ≥ 4.5:1, `prefers-reduced-motion`.
- `vitest-axe` u svakom organism testu, `@axe-core/playwright` na svakoj e2e strani. CI fail na violation.

---

## 18. Testiranje

| Nivo | Alat | Coverage | Šta |
|---|---|---|---|
| Unit | Vitest | 100% `packages/utils` | čiste funkcije, reduceri, selektori, zod šeme |
| Hook | `renderHook` | 90% `features/*/hooks` | **primarni fokus** — logika živi u hookovima |
| Komponenta | RTL + `user-event` | 80% | ponašanje, ne implementacija |
| Integracija | RTL + MSW + pravi store | ključni flow-ovi | feature end-to-end u JSDOM-u |
| E2E | Playwright | kritični putevi | login, CRUD, i18n switch, modal flow |

**Pravila:** nikad ne testiraj implementaciju (bez `container.querySelector`);
query prioritet `getByRole` > `getByLabelText` > `getByText` > `getByTestId`;
`renderWithProviders` iz `packages/testing`; MSW handleri kolokovani uz feature;
test data preko factory funkcija (`makeUser({ role: 'admin' })`), ne JSON blobova;
coverage pragovi u `vitest.config.ts` sa CI fail-om; svaki bug fix počinje failing testom.

---

## 19. Tooling, CI/CD i enforcement

**Pravilo koje nije mašinski proverljivo biće prekršeno.**

| Pravilo | Enforcement |
|---|---|
| Granice slojeva | `eslint-plugin-import` → `no-restricted-paths` |
| Import samo iz barrel-a | `import/no-internal-modules` |
| Hook pravila + compiler | `eslint-plugin-react-hooks` v6 |
| Bez literal stringova u UI | `eslint-plugin-i18next` |
| A11y | `eslint-plugin-jsx-a11y` |
| Bez `any`, bez `!` | `typescript-eslint` strict-type-checked |
| Bundle budžet | `size-limit` u CI |
| Lighthouse | `@lhci/cli` assertions |
| Coverage | Vitest thresholds |
| Max `useState` / `useEffect` komentar | custom ESLint rule u `packages/config/eslint-config/rules/` — **napiši je** |
| Commit format | `commitlint` |
| i18n rupe | `i18next-parser` + diff check |

**CI (GitHub Actions):**
```
install (pnpm cache) → typecheck → lint → test (+coverage) → build →
size-limit → lighthouse-ci → e2e (playwright) → changesets release
```
Turborepo `--filter=[origin/main]` da se gradi samo promenjeno.

**Env:** `packages/utils/env` sa zod šemom; build pada ako fali obavezna varijabla.
Nikad `import.meta.env.X` direktno — samo kroz `env` objekat.

---

## 20. Sigurnost

- CSP (bez `unsafe-inline`), HSTS, `X-Content-Type-Options`.
- Access token u memoriji (Redux), refresh u `httpOnly` cookie. **Nikad JWT u `localStorage`** → ADR.
- `dangerouslySetInnerHTML` zabranjen; ako mora — `DOMPurify` + eksplicitan ESLint izuzetak.
- `pnpm audit` + Renovate/Dependabot.
- `VITE_` prefiks je javno vidljiv — dokumentuj eksplicitno.

---

## 21. MD fajlovi koje treba generisati (`docs/`)

Svaki fajl: max ~200 linija, sekcije **Pravila / Primeri / Anti-patterns / Checklist**.
Na vrhu: `> Status: active | Last review: <date>`.

| Fajl | Sadržaj |
|---|---|
| `docs/README.md` | index + reading order za novog developera/agenta |
| `docs/00-overview.md` | šta je repo, koje app-ove sadrži, glosar |
| `docs/01-architecture.md` | feature folders, dijagram zavisnosti, kada migrirati na FSD (§4) |
| `docs/02-folder-structure.md` | kompletno stablo sa objašnjenjem svakog foldera (§3) |
| `docs/03-naming-conventions.md` | §5 + zabranjeni obrasci |
| `docs/04-state-management.md` | §6 sa primerima slice/selector/entityAdapter |
| `docs/05-routing.md` | §7, primer router.tsx, guard, preload link |
| `docs/06-modals.md` | §8 kompletno sa celim kodom modal engine-a |
| `docs/07-performance.md` | §10 — **najvažniji dokument** |
| `docs/08-styling-ui.md` | §11, tokeni, CVA, dark mode, RTL |
| `docs/09-i18n.md` | §12, kako dodati jezik/namespace, ICU plural za srpski |
| `docs/10-forms-validation.md` | §13 |
| `docs/11-data-fetching.md` | §14, baseQuery kod, optimistic update |
| `docs/12-testing.md` | §18, primeri po nivou, `renderWithProviders` API |
| `docs/13-hooks.md` | §9 + katalog postojećih hookova |
| `docs/14-helpers-utils.md` | §15 + katalog funkcija |
| `docs/15-accessibility.md` | §17 |
| `docs/16-tooling-ci.md` | §19, pinovane verzije iz F0, sva lint pravila i zašto |
| `docs/17-adding-new-app.md` | korak-po-korak za novu app |
| `docs/18-adding-new-feature.md` | korak-po-korak za feature folder |
| `docs/19-code-review-checklist.md` | lista koju `/review` koristi |
| `docs/20-security.md` | §20 |
| `docs/21-glossary.md` | pojmovi |
| `docs/adr/0000-initial-spec.md` | arhiva ovog dokumenta |
| `docs/adr/0001-react-compiler.md` | compiler ON, ručni memo OFF |
| `docs/adr/0002-router-choice.md` | React Router v7 vs TanStack Router |
| `docs/adr/0003-styling-choice.md` | Tailwind v4 vs alternative |
| `docs/adr/0004-feature-folders-vs-fsd.md` | zašto feature folders, kada migrirati |
| `docs/adr/0005-barrel-files.md` | barrel samo na granicama, merenje uticaja |
| `docs/adr/0006-modal-engine.md` | sopstveni Redux engine vs `@ebay/nice-modal-react` |
| `docs/adr/template.md` | Context / Decision / Consequences / Alternatives |

---

## 22. `CLAUDE.md` (root)

Kratak (< 150 linija), učitava se u svaki kontekst:
1. **Šta je projekat** — 3 rečenice.
2. **Komande** — `pnpm dev/test/lint/typecheck/build/e2e/lh`.
3. **Zlatna pravila** (bullet, bez objašnjenja):
   - Logika ide u hookove, komponente su glupe.
   - `useEffect` samo za spoljne sisteme; obavezan `// effect:` komentar.
   - Max 2 `useState` po komponenti.
   - `useMemo` samo u 3 slučaja iz `docs/07-performance.md`.
   - Modali isključivo preko `useModal`.
   - Bez literal stringova u UI — sve kroz `t()`.
   - Feature ne importuje feature.
   - Import samo iz barrel-a feature-a/paketa.
   - Server state je RTKQ, ne slice.
   - Kod ide u `packages/` tek kad ga koristi druga app.
   - Novi dependency > 20 KB → ADR.
4. **Mapa dokumentacije** — "ako radiš X, pročitaj `docs/YY`".
5. **Workflow** — pročitaj doc pre koda; pokreni `/review` posle.
6. **Održavanje** — ako se pravilo menja, prvo doc, pa kod.

Dodatno: `apps/web/CLAUDE.md` i `packages/ui/CLAUDE.md` sa specifičnostima.

---

## 23. `.claude/commands/`

Svaka komanda je MD fajl sa frontmatter-om (`description`, `argument-hint`, dozvoljeni alati) i telom koje:
(a) kaže koje `docs/` fajlove da pročita, (b) daje tačne korake, (c) daje acceptance kriterijum.

### Scaffolding
| Komanda | Argumenti | Šta radi |
|---|---|---|
| `/new-app` | `<name>` | Nova app, kompletan skelet, tsconfig refs, turbo pipeline, lighthouserc, e2e, CI matrix |
| `/new-feature` | `<app> <feature>` | `api/ components/ modals/ hooks/ store/ schemas/ locales/ types.ts __tests__/ index.ts`, registruje reducer, dodaje namespace i sr+en JSON, generiše prazne testove |
| `/new-component` | `<atom\|molecule\|organism> <Name>` | Komponenta u `packages/ui` sa CVA varijantama, tipovima, testom, axe testom |
| `/new-modal` | `<app> <feature> <Name>` | Modal + upis u `modalRegistry` + `ModalPropsMap` + i18n ključevi + test open/close/confirm |
| `/new-hook` | `<scope> <useName>` | Hook + test + upis u `docs/13-hooks.md` |
| `/new-slice` | `<app> <feature>` | Slice + entityAdapter + selektori + testovi reducera |
| `/new-endpoint` | `<feature> <name> <method>` | RTKQ endpoint + tagovi + tipovi + MSW handler + test |
| `/new-page` | `<app> <Name> <path>` | Page + lazy route + meta + breadcrumb handle + e2e smoke |

### Kvalitet
| Komanda | Šta radi |
|---|---|
| `/review` | Audit izmenjenih fajlova protiv `docs/19`. Tabela `fajl \| pravilo \| ozbiljnost \| fix`. Ne menja kod bez potvrde. |
| `/perf-audit` | Build + `size-limit` + `lhci autorun` + analiza chunkova, sa procenom dobitka u KB/ms |
| `/audit-effects` | Klasifikuje sve `useEffect` po whitelist-u (§10.3), predlaže zamenu |
| `/audit-state` | Nalazi komponente sa 3+ `useState`, predlaže zamenu |
| `/audit-memo` | Nalazi `useMemo`/`useCallback` van 3 dozvoljena slučaja |
| `/audit-boundaries` | Provera granica slojeva i cross-feature importa |
| `/i18n-check` | Nedostajući/nekorišćeni ključevi, hardkodovani stringovi, `sr` plural forme |
| `/a11y-audit` | axe + jsx-a11y + kontrast OKLCH tokena |
| `/test-gen` | Generiše testove po piramidi (§18) |
| `/bundle-check` | Šta je u kom chunku, najveći dep, duplikati, uticaj barrel fajlova |
| `/deps-check` | Zastareli/ranjivi paketi, duplikati u lock-u |
| `/adr` | `<naslov>` — novi ADR iz šablona + link u `docs/README.md` |
| `/docs-sync` | Divergencija koda i `docs/` |
| `/refactor-to-hook` | Izvlači logiku iz komponente u feature hook + test |
| `/explain-arch` | Gde nova funkcionalnost treba da živi |

### Release
`/changeset` (changeset iz git diff-a), `/release-check` (typecheck+lint+test+build+size+lh izveštaj).

### `.claude/agents/`
`perf-auditor` (read-only, §10), `test-writer` (samo testovi, zna `docs/12`), `arch-guard` (read-only, granice).

### `.claude/settings.json` hooks
- `PostToolUse` na `Edit|Write` za `*.ts(x)` → `pnpm lint --fix` + `tsc --noEmit` na tom paketu.
- `PreToolUse` → blokiraj pisanje u `pnpm-lock.yaml` i `docs/adr/*` (samo preko `/adr`).
- `Stop` → podseti na `/review` ako je diff > 100 linija.

*(Ako se sintaksa hookova/subagenata razlikuje u aktuelnoj verziji Claude Code-a, proveri zvaničnu
dokumentaciju u F2 i prilagodi — ne izmišljaj polja.)*

---

## 24. Referentni feature (`auth`)

`apps/web` dobija kompletan `auth` feature kao **živu dokumentaciju**:
RTKQ endpointi (`login`, `logout`, `me`, `refresh`) sa tagovima; slice sa session stanjem;
`useAuth`/`useLogin`/`useLogout`; `LoginForm` (RHF + zod + i18n greške); `LoginModal` u registry-ju
sa promise rezultatom; `RequireAuth` guard + zaštićena ruta; pun set testova (utils → reducer → hook →
komponenta → integracija → e2e); `sr.json` + `en.json` sa plural primerom.
**0 `useEffect`, ≤ 2 `useState` u celom feature-u.**

---

## 25. Skripte (root `package.json`)

```
dev            turbo run dev
build          turbo run build
test           turbo run test
test:cov       turbo run test -- --coverage
e2e            turbo run e2e
lint           turbo run lint
lint:fix       turbo run lint -- --fix
typecheck      turbo run typecheck
format         prettier --write .
size           turbo run size
lh             turbo run lighthouse
i18n:extract   i18next-parser
i18n:check     node scripts/i18n-check.mjs
validate       pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm size
clean          turbo run clean && rm -rf node_modules
```

---

## 26. Definition of Done (F7)

- [ ] `pnpm validate` prolazi bez upozorenja
- [ ] `apps/web` i `apps/admin` postoje, dele `packages/*`, buildaju nezavisno
- [ ] Lighthouse (lab, prod build, throttled) ≥ 95 performance, 100 a11y/best-practices/SEO
- [ ] Initial JS ≤ 150 KB gzip, CSS ≤ 20 KB gzip
- [ ] Coverage: `packages/utils` 100%, `features/*/hooks` ≥ 90%, ukupno ≥ 80%
- [ ] E2E: login, logout, guard redirect, modal confirm flow, promena jezika, dark mode
- [ ] `no-restricted-paths` aktivan — namerno kršenje granice obara build (dokaži testom)
- [ ] Custom lint pravilo za `useState` limit i `useEffect` komentar radi
- [ ] Svi `docs/` fajlovi postoje, nijedan bez sadržaja
- [ ] Sve slash komande postoje; `/new-feature test-feature` proizvodi feature koji odmah prolazi lint+test
- [ ] `/review` na namerno lošem kodu (5 useState, fetch u useEffect, hardkodovan string) hvata sve tri greške
- [ ] README sa quickstart-om u < 5 komandi

---

## 27. Iskrene napomene (uvrsti u `docs/07` i `docs/01`)

1. **"Više `useMemo`" je pogrešan instinkt** uz React Compiler. Pravilo iz §10.2 daje brz UI bez cargo cult-a.
2. **"Max 2 `useState`" je heuristika, ne zakon** — i **nije industrijski standard**. Kao pritisak ka boljem
   dizajnu odlična; kao dogma vodi u veštačke `useReducer`-e nad tri booleana. Zato eskalaciona lista (§10.4).
3. **`// effect:` komentar nije standardna praksa** — to je custom pravilo da bi zahtev bio proverljiv.
   Ako smeta timu, obriši ga; whitelist iz §10.3 ostaje.
4. **Lighthouse 100 u lab-u ≠ 100 u produkciji.** Zato `web-vitals` reporting iz §16.
5. **Feature folders skalira do određene tačke.** Preko ~20 feature-a i 5+ developera razmisli o kanonskom FSD-u
   (`entities` sloj + `steiger` linter). Migracija je izvodljiva jer su granice već enforce-ovane lintom.
6. **Najveći rizik nije stek nego drift.** Zato §19: svako pravilo dobija lint rule.
   Dokumentacija koja se ne proverava mašinski je dokumentacija koja se ignoriše.

---

## 28. Prompt za pokretanje (kopiraj u Claude Code)

```
Pročitaj SPEC-react-monorepo-template.md u celosti.
Izvrši ga fazno, F0 → F7, kako je opisano u §0.
Posle svake faze stani, prikaži šta si napravio i sačekaj potvrdu.
Ne piši kod pre nego što F1 (dokumentacija) bude gotova i odobrena.
Za sve odluke koje nisu pokrivene spec-om, otvori ADR umesto da improvizuješ.
Scope paketa: @<tvoj-scope>. Aplikacije za start: web, admin. Jezici: sr, en.
```

---

## 29. Izmene u odnosu na v1 (zašto je struktura promenjena)

| v1 (hibrid) | v2 (standard) | Razlog |
|---|---|---|
| `widgets/` sloj | uklonjen | FSD-specifična terminologija; sadržaj ide u `components/` ili `pages/` |
| `shared/` | `lib/`, `components/`, `hooks/` | mainstream imena koja developer već zna (shadcn koristi `lib/`) |
| `app/` folder sa `providers/router/store` | `providers/`, `routes/`, `store/` u root `src/` | ravnija, prepoznatljivija struktura |
| feature segmenti `model/ui/` | `store/ components/ schemas/ types.ts` | eksplicitna imena umesto FSD segmenata |
| `eslint-plugin-boundaries` | `eslint-plugin-import` → `no-restricted-paths` | standardni plugin, manje zavisnosti |
| `packages/config/{eslint,typescript}` | `packages/config/{eslint-config,typescript-config}` | Turborepo konvencija imenovanja |
| modal engine bez alternative | dodat `@ebay/nice-modal-react` kao razmotrena opcija (ADR 0006) | postoji gotovo rešenje iz prakse |
| barrel fajlovi bez napomene | ADR 0005 sa trade-off-om | barrels mogu kvariti tree-shaking |
| — | dodat ADR 0004 (feature folders vs FSD) sa migracionim putem | odluka mora biti zapisana |
