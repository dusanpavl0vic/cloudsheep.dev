# CloudSheep monorepo

pnpm monorepo iz koga se prave nezavisne React SPA aplikacije koje dele UI, state
infrastrukturu, i18n, utils i tooling. Dve app-e: `web` (javni sajt) i `admin` (interni panel).
Nije SSR framework.

**Izvor istine su `docs/*.md`, ne ovaj fajl.** Ovde su samo pravila koja moraju biti u svakom
kontekstu; sve ostalo je u mapi ispod.

## Komande

```bash
pnpm dev --filter=web       # dev server jedne app-e
pnpm test                   # unit + integracija
pnpm e2e                    # Playwright
pnpm lint                   # ESLint
pnpm typecheck              # tsc --noEmit
pnpm build                  # produkcijski build
pnpm size                   # bundle budžeti
pnpm lh                     # Lighthouse CI
pnpm validate               # sve gore — mora proći pre PR-a
```

## Zlatna pravila

- **Logika ide u hookove, komponente su glupe.** Komponenta ne zove `useAppSelector`,
  `useAppDispatch` ni RTKQ hook direktno.
- **`useEffect` samo za sinhronizaciju sa spoljnim sistemom**; obavezan `// effect:` komentar.
  Nikad za fetch, derivirani state ni logiku handlera.
- **Najviše 2 `useState` po komponenti.**
- **`useMemo`/`useCallback` samo u 3 slučaja** iz `docs/07-performance.md` §2, sa `// memo:` komentarom.
- **Modali isključivo preko `useModal`.** Nema `useState(false)` za dijalog sa domenskom akcijom.
- **Bez literal stringova u UI** — sve kroz `t()`, ključ u `sr.json` **i** `en.json`.
- **Feature ne importuje feature.**
- **Import samo iz barrel-a** feature-a/paketa; barrel nikad unutar foldera.
- **Server state je RTKQ, ne slice.** Nikad kopirati RTKQ podatke u Redux.
- **URL je izvor istine za filtere i paginaciju**, ne Redux.
- **Kod ide u `packages/` tek kad ga koristi druga app.**
- **Novi dependency > 20 KB gzip → ADR.**
- **Samo semantičke Tailwind klase** (`bg-primary`), nikad `bg-blue-500` ni `text-[#333]`.
- **Stil u `.variants.ts` (cva)**, `.tsx` sadrži samo layout klase.
- **Nema `default export`-a** osim lazy route modula.
- **Fajl ≤ 200 linija, komponenta ≤ 150.**
- **Nikad JWT u `localStorage`.**

## Mapa dokumentacije

| Radiš… | Čitaj |
|---|---|
| bilo šta, prvi put | `docs/README.md` → `docs/01-architecture.md` |
| performanse, hookove, bundle | **`docs/07-performance.md`** ← najvažniji |
| gde kod treba da živi | `docs/01-architecture.md`, `docs/02-folder-structure.md` |
| imenovanje | `docs/03-naming-conventions.md` |
| state, slice, selektore | `docs/04-state-management.md` |
| rute, guard, lazy | `docs/05-routing.md` |
| dijalog | `docs/06-modals.md` |
| stil, tokene, teme | `docs/08-styling-ui.md` |
| prevode, plural | `docs/09-i18n.md` |
| formu | `docs/10-forms-validation.md` |
| API poziv | `docs/11-data-fetching.md` |
| testove | `docs/12-testing.md` |
| hook | `docs/13-hooks.md` |
| helper funkciju | `docs/14-helpers-utils.md` |
| pristupačnost | `docs/15-accessibility.md` |
| lint, CI, verzije | `docs/16-tooling-ci.md` |
| novu app | `docs/17-adding-new-app.md` |
| novi feature | `docs/18-adding-new-feature.md` |
| sigurnost | `docs/20-security.md` |
| nepoznat pojam | `docs/21-glossary.md` |

Arhitektonske odluke i njihova obrazloženja: `docs/adr/`.

## Workflow

1. **Pročitaj relevantan `docs/` fajl pre nego što napišeš kod.** Nije opciono — pravila
   su konkretna i ne mogu se pogoditi.
2. Za skafolding koristi slash komande (`/new-feature`, `/new-component`, `/new-hook`…) —
   one generišu strukturu koja odmah prolazi lint i test.
3. Posle izmena pokreni **`/review`** (proverava protiv `docs/19-code-review-checklist.md`).
4. `pnpm validate` mora proći pre PR-a.

## Održavanje

- **Ako se pravilo menja: prvo doc, pa kod.** Nikad obrnuto.
- Novo pravilo mora dobiti lint rule (`docs/16-tooling-ci.md` §2) — pravilo koje se ne
  proverava mašinski biće prekršeno. Najveći rizik ovog repoa nije stek nego drift.
- Arhitektonska odluka koja se ne može izvesti iz koda ide u ADR (`/adr <naslov>`).
- Novi deljeni hook ili util se upisuje u katalog (`docs/13`, `docs/14`).

## Specifičnosti po workspace-u

`apps/web/CLAUDE.md` · `apps/admin/CLAUDE.md` · `packages/ui/CLAUDE.md`
