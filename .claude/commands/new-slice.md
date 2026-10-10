---
description: Pravi Redux slice (samo klijentsko stanje — server state je RTKQ), lenjo ubačen, sa selektorima i testom reducera
argument-hint: [name]
arguments: name
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pnpm lint:*), Bash(pnpm test:*), Bash(pnpm exec vitest:*)
---

Napravi slice `$name`.

## Prvo pročitaj

`docs/04-state-management.md` — **server state je RTKQ, ne slice**; filteri i paginacija su u
URL-u. Slice postoji samo za čisto klijentsko stanje (UI, sesija u memoriji).

## Struktura

```
src/store/slices/$name/
├── types/index.ts
├── reducer/initialState.ts · reducer/index.ts   (createSlice; lenji: rootReducer.inject + LazyLoadedSlices)
├── actions/index.ts
├── selectors/index.ts                            (lenji slice: čitanje sa initialState pre ubacivanja)
└── index.ts
```

- Slice koji treba samo admin ubacuje se lenjo (kao `auth`), da ne ide u JS javnih stranica
- Komponenta ga nikad ne čita direktno — samo kroz hook
- Test reducera i selektora (`*.test.ts`)
