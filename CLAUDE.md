# CloudSheep

Jedna **Next.js** aplikacija (App Router) za `cloudsheep.dev`: javni sajt (`/`, `/sr/…`),
admin panel (`/admin`) i API (`/api`) u istom procesu, nad PostgreSQL-om preko Prisme.
Javne stranice se renderuju na serveru — Google dobija pun HTML.

**Izvor istine su `docs/*.md`, ne ovaj fajl.** Ovde su samo pravila koja moraju biti u svakom
kontekstu; sve ostalo je u mapi ispod.

## Komande

```bash
pnpm dev                    # dev server (treba Postgres: docker compose -f infra/docker-compose.yml up -d db)
pnpm test                   # unit + integracija (Vitest)
pnpm e2e                    # Playwright nad produkcijskim buildom
pnpm lint                   # ESLint
pnpm typecheck              # tsc --noEmit
pnpm build                  # produkcijski build (standalone)
pnpm size                   # JS budžet po javnoj ruti
pnpm lh                     # Lighthouse CI
pnpm validate               # typecheck · lint · test · build · size — mora proći pre PR-a
```

## Zlatna pravila

- **Sve konstante su u `src/constants`** — rute, API endpointi, tagovi, tokeni teme, modali,
  limiti. U komponenti nema URL-a, putanje ni „magičnog" broja.
- **Linkovi samo preko `ROUTES` i buildera** (`projectHref(slug)`), nikad `` `/projects/${slug}` ``.
- **Logika ide u hookove, komponente su prezentacione.** Komponenta ne zove `useAppSelector`,
  `useAppDispatch`, RTKQ hook, `useParams` ni `useSearchParams` direktno.
- **Javne stranice čitaju podatke na serveru** (`src/server/services`); **na klijentu podaci
  stižu samo kroz RTK Query.** Nikad kopirati RTKQ podatke u slice.
- **`src/server/**` se nikad ne uvozi iz klijentskog koda** (lint to sprečava).
- **Svaka komponenta ima svoj folder**: `.tsx` · `.styles.ts` · `.types.ts` · `index.ts`.
  Komponenta je `default export`, sve ostalo `named`.
- **Stil je u `.styles.ts` (styled-components), boje i razmaci samo iz teme** — nikad hex ni
  px vrednost tokena direktno.
- **Funkcije su arrow funkcije** — komponente, hookovi, helperi, selektori.
- **Bez literal stringova u UI** — sve kroz `t()`, ključ u `en.ts` **i** `sr.ts`.
- **`useEffect` samo za sinhronizaciju sa spoljnim sistemom**; obavezan `// effect:` komentar.
- **Najviše 2 `useState` po komponenti.**
- **`useMemo`/`useCallback` samo u 3 slučaja** iz `docs/07-performance.md` §2, sa `// memo:` komentarom.
- **Sve što se otvara ide kroz `useModal`** i `ui.modals` u Redux-u.
- **URL je izvor istine za filtere i paginaciju**, ne Redux.
- **Novi dependency > 20 KB gzip → ADR.** Javni JS ≤ 160 KB gzip po ruti.
- **Fajl ≤ 200 linija, komponenta ≤ 150.**
- **Nikad JWT u `localStorage`.**

## Mapa dokumentacije

| Radiš…                       | Čitaj                                                    |
| ---------------------------- | -------------------------------------------------------- |
| bilo šta, prvi put           | `docs/README.md` → `docs/01-architecture.md`             |
| performanse, hookove, bundle | **`docs/07-performance.md`** ← najvažniji                |
| gde kod treba da živi        | `docs/01-architecture.md`, `docs/02-folder-structure.md` |
| imenovanje                   | `docs/03-naming-conventions.md`                          |
| state, slice, selektore      | `docs/04-state-management.md`                            |
| rute, jezik u URL-u, SEO     | `docs/05-routing.md`                                     |
| dijalog, dropdown, sheet     | `docs/06-modals.md`                                      |
| stil, tokene, teme           | `docs/08-styling-ui.md`, `docs/22-visual-language.md`    |
| prevode                      | `docs/09-i18n.md`                                        |
| formu                        | `docs/10-forms-validation.md`                            |
| podatke (server i klijent)   | `docs/11-data-fetching.md`                               |
| testove                      | `docs/12-testing.md`                                     |
| hook                         | `docs/13-hooks.md`                                       |
| helper funkciju              | `docs/14-helpers-utils.md`                               |
| pristupačnost                | `docs/15-accessibility.md`                               |
| lint, CI, verzije            | `docs/16-tooling-ci.md`                                  |
| API, auth, mejl, upload      | `docs/17-backend.md`                                     |
| novu stranicu ili domen      | `docs/18-adding-new-feature.md`                          |
| sigurnost                    | `docs/20-security.md`                                    |
| nepoznat pojam               | `docs/21-glossary.md`                                    |

Arhitektonske odluke i njihova obrazloženja: `docs/adr/`.

## Workflow

1. **Pročitaj relevantan `docs/` fajl pre nego što napišeš kod.** Pravila su konkretna i ne
   mogu se pogoditi.
2. Posle izmena pokreni **`/review`** (proverava protiv `docs/19-code-review-checklist.md`).
3. `pnpm validate` mora proći pre PR-a.

## Održavanje

- **Ako se pravilo menja: prvo doc, pa kod.** Nikad obrnuto.
- Novo pravilo mora dobiti lint rule (`docs/16-tooling-ci.md` §2) — pravilo koje se ne
  proverava mašinski biće prekršeno.
- Arhitektonska odluka koja se ne može izvesti iz koda ide u ADR (`/adr <naslov>`).
- Novi deljeni hook ili helper se upisuje u katalog (`docs/13`, `docs/14`).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
