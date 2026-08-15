# 02 — Struktura foldera

> Status: active | Last review: 2026-08-15

## Stablo

```
.
├── apps/
│   ├── web/                          # cloudsheep.dev — javni sajt
│   │   ├── src/
│   │   │   ├── main.tsx              # entry
│   │   │   ├── App.tsx               # root kompozicija
│   │   │   ├── providers/            # StoreProvider, I18nProvider, ErrorBoundary, ModalRoot
│   │   │   ├── routes/               # router.tsx, guards
│   │   │   ├── store/                # configureStore, rootReducer, hooks (useAppDispatch)
│   │   │   ├── pages/                # route-level komponente — BEZ logike
│   │   │   ├── features/             # domenski moduli (vidi 01-architecture)
│   │   │   ├── components/           # app-specifične deljene komponente
│   │   │   ├── hooks/                # app-specifični deljeni hookovi
│   │   │   ├── lib/                  # app-specifični helperi, config
│   │   │   ├── locales/              # common.json, errors.json — globalni namespace-ovi
│   │   │   └── types/                # globalni tipovi, ambient deklaracije
│   │   ├── e2e/                      # Playwright
│   │   ├── public/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── lighthouserc.json
│   │   ├── vercel.json
│   │   └── CLAUDE.md
│   └── admin/                        # ista struktura
│
├── packages/
│   ├── ui/                           # dizajn sistem
│   │   ├── src/
│   │   │   ├── ui/                   # shadcn output — FLAT (button.tsx, dialog.tsx)
│   │   │   ├── atoms/                # Icon/, Text/, Spinner/
│   │   │   ├── molecules/            # FormField/, SearchInput/, Pagination/
│   │   │   ├── organisms/            # DataTable/, FilterPanel/, ModalShell/
│   │   │   ├── layouts/              # PageLayout/, AuthLayout/
│   │   │   ├── lib/                  # cn(), CVA helperi
│   │   │   └── index.ts
│   │   ├── components.json           # shadcn config
│   │   └── CLAUDE.md
│   ├── core/                         # store factory, baseApi, modal engine, logger
│   ├── i18n/                         # i18next init, formatteri, registry jezika
│   ├── utils/                        # čiste funkcije, zero-dep
│   ├── hooks/                        # generički React hookovi
│   ├── testing/                      # renderWithProviders, MSW, factories
│   └── config/
│       ├── eslint-config/
│       ├── typescript-config/
│       ├── tailwind-config/
│       └── vite-config/
│
├── docs/
├── .claude/                          # commands, agents, settings.json
├── CLAUDE.md
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Šta gde ide — tabela odlučivanja

| Pišeš… | Ide u |
|---|---|
| komponentu koju koristi jedan feature | `features/<x>/components/` |
| komponentu koju koriste dva feature-a iste app-e | `apps/<x>/src/components/` |
| komponentu koju koriste dve app-e | `packages/ui/` (atoms/molecules/organisms) |
| shadcn primitiv | `packages/ui/src/ui/` — flat, kako CLI generiše |
| hook koji zna za domen | `features/<x>/hooks/` |
| hook bez domena (`useDebounce`) | `packages/hooks/` |
| `useAppDispatch`/`useAppSelector` | `apps/<x>/src/store/hooks.ts` |
| čistu funkciju bez React-a | `packages/utils/` |
| helper koji zna za ovu app | `apps/<x>/src/lib/` |
| route-level komponentu | `pages/` — **samo kompozicija** |
| zod šemu | `features/<x>/schemas/` |
| prevod feature-a | `features/<x>/locales/{sr,en}.json` |
| globalni prevod | `apps/<x>/src/locales/common.json` |

## Pravila

1. **`pages/` nema logiku.** Page uvozi feature komponente i slaže ih. Ako page ima
   `useState` ili `useSelector`, logika pripada feature hooku.
2. **`lib/` nije `utils.ts`.** Svaki fajl ima ime po poslu koji radi (`formatInvoice.ts`),
   nikad `helpers.ts`/`misc.ts`.
3. **Nema `containers/`, `views/`, `widgets/`.** To su slojevi iz drugih metodologija;
   ovde bi bili treće mesto za istu stvar.
4. **`packages/ui/src/ui/` je flat.** Tako `pnpm dlx shadcn add` piše i tako se ažurira
   bez ručnog preuređivanja. Sve ostalo u `ui` paketu je folder + `.variants.ts` + `index.ts`
   ([`adr/0007`](adr/0007-ui-flat-vs-folder.md)).
5. **Test je kolokovan.** `useAuth.ts` → `useAuth.test.ts` pored njega, ne u `__tests__/`
   na drugom kraju repoa. `__tests__/` je samo za integracione testove feature-a.

## Komponenta = folder

Van `packages/ui/src/ui/`, svaka komponenta je folder:

```
ProjectCard/
├── ProjectCard.tsx            # struktura — JSX, bez Tailwind class stringova
├── ProjectCard.variants.ts    # stil — cva
├── ProjectCard.constants.ts   # ostale konstante (opciono)
├── ProjectCard.test.tsx
└── index.ts                   # barrel
```

**Sav vizuelni stil živi u `.variants.ts`, i kad komponenta nema varijante** — tada je fajl
samo `cva('...klase...')`. U `.tsx` ostaje `cn(xxxVariants(...), className)`.
Inline utility klase su dozvoljene isključivo za **layout kompoziciju** (`flex`, `gap`,
`max-w`), nikad za vizuelni stil.

## Anti-patterns

| ❌ | ✅ |
|---|---|
| `src/components/index.ts` koji re-eksportuje 40 komponenti | barrel po komponenti; nikad zbirni ([`adr/0005`](adr/0005-barrel-files.md)) |
| `features/x/utils.ts` | `features/x/lib/formatPrice.ts` |
| `pages/Dashboard.tsx` sa `useQuery` i tri `useState`-a | logika u `features/dashboard/hooks/useDashboard.ts` |
| `packages/ui/src/ui/Button/Button.tsx` | `packages/ui/src/ui/button.tsx` (flat) |
| Tailwind klase u `.tsx` fajlu komponente | `.variants.ts` |
| `types/index.ts` sa 300 linija svih tipova | tip živi uz svoj domen: `features/x/types.ts` |

## Checklist

- [ ] Novi fajl je na najnižem nivou koji ga može držati (feature pre app-a, app pre paketa)
- [ ] Komponenta je folder sa `.tsx` + `.variants.ts` + `index.ts` (osim u `ui/`)
- [ ] U `.tsx` nema Tailwind class stringova osim layout utility klasa
- [ ] Test je pored fajla koji testira
- [ ] Nijedan novi folder ne uvodi terminologiju koje nema u ovom dokumentu
