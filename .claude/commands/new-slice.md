---
description: Pravi Redux slice sa entityAdapter, selektorima i testovima reducera
argument-hint: [app] [feature]
arguments: app feature
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pnpm lint:*), Bash(pnpm test:*)
---

Napravi slice za `$feature` u `apps/$app`.

## Prvo pročitaj

- `docs/04-state-management.md` — tri kategorije stanja, primeri
- `docs/01-architecture.md` — zašto slice ne izlazi iz feature-a

## Provera pre pisanja — najvažniji korak

**Da li ovo uopšte treba da bude slice?**

| Podatak dolazi… | Ide u |
|---|---|
| sa API-ja | **RTK Query**, ne slice |
| iz URL-a (filteri, paginacija) | `useSearchParams`, ne slice |
| iz jedne komponente | `useState`, ne slice |
| globalni UI state (sesija, tema, izabran red) | ✅ slice |

Ako podatak dolazi sa servera — reci da slice ne treba i predloži RTKQ endpoint. Stani tu.

## Koraci

1. `store/$feature.slice.ts` — `createSlice`, `createEntityAdapter` ako je kolekcija
2. `store/$feature.selectors.ts` — `createSelector` za sve što izvodi/filtrira/mapira
3. Registruj lazy: `store.injectReducer('$feature', <feature>Reducer)`
4. Testovi reducera i selektora

## Pravila

- **Akcije se imenuju kao događaji u prošlom vremenu** (`sessionEstablished`), ne kao komande
  (`setSession`) — slice opisuje šta se desilo
- Selektori se **ne eksportuju** iz `index.ts` feature-a
- Nikad ne kopiraj RTKQ podatke u slice
- Kolekcije idu kroz `createEntityAdapter`

## Acceptance

- `pnpm test --filter=$app` prolazi, reducer i selektori pokriveni
- `index.ts` feature-a ne eksportuje slice ni selektore
- Reducer je registrovan lazy, uz feature chunk
