---
description: Pravi page komponentu, lazy rutu, meta tagove, breadcrumb handle i e2e smoke test
argument-hint: [app] [Name] [path]
arguments: app Name path
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pnpm lint:*), Bash(pnpm test:*)
---

Napravi stranicu `$Name` na putanji `$path` u `apps/$app`.

## Prvo pročitaj

- `docs/05-routing.md` — lazy rute, guard, preload, meta
- `docs/02-folder-structure.md` — zašto `pages/` nema logiku

## Koraci

1. `apps/$app/src/pages/$Name.tsx` — eksportuje `Component` (lazy route modul)
2. Dodaj putanju u `apps/$app/src/lib/routes.ts` kao konstantu — **nikad literal u linku**.
   Ime konstante je `$Name` u SCREAMING_SNAKE (npr. `ProjectDetail` → `PROJECT_DETAIL`)
3. Registruj rutu u `routes/router.tsx` — obrazac:
   ```ts
   {
     path: ROUTES.PROJECT_DETAIL,
     lazy: () => import('@/pages/ProjectDetail'),
     handle: { crumb: 'nav.projectDetail' },
   }
   ```
4. Meta tagovi kroz React 19 hoisting — `<title>` i `<meta name="description">` iz i18n ključeva
5. i18n ključevi u `sr.json` i `en.json`
6. E2E smoke test u `apps/$app/e2e/`

## Pravila — najvažnije

**Page je samo kompozicija.** Nema `useState`, nema `useSelector`, nema RTKQ hooka.
Uvozi feature komponente i slaže ih. Ako ti treba logika — ide u feature hook.

Ruta je **uvek** lazy. Ako feature ima slice, reducer se registruje lazy uz nju.

## Acceptance

- `pnpm lint && pnpm typecheck` prolazi
- Ruta se učitava lazy — ne povećava initial chunk (`pnpm size --filter=$app` prolazi)
- Stranica ima `<title>` i `<meta name="description">` kroz i18n
- E2E smoke test prolazi
- Page fajl nema nijedan React hook osim eventualnog `useTranslation`
