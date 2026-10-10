---
description: Dodaje API rutu (route.ts nad servisom) i RTK Query endpoint za admin, sa tagovima i testom
argument-hint: [domain] [name] [method]
arguments: domain name method
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pnpm lint:*), Bash(pnpm test:*), Bash(pnpm exec eslint:*), Bash(pnpm exec vitest:*)
---

Dodaj endpoint `$name` (`$method`) za domen `$domain`.

## Prvo pročitaj

`docs/11-data-fetching.md` §3–4.

## Server

- `src/app/api/…/route.ts`: tanak — `handle`/`handleAdmin` → `readJson` (POST/PUT) ili
  **`readPatch` (PATCH)** → servis → `json(...)` / `noContent()`
- Greške kao `HttpError(status, '<domen>.errors.<ključ>', { field })`; ključ u `en.ts` i `sr.ts`
- URL u `API_ENDPOINTS` (`constants/api.ts`)
- Test servisa nad bazom (`*.db.test.ts`) ili čiste logike (`*.test.ts`)

## Klijent (samo admin — javne stranice ne koriste RTKQ)

- `src/store/api/admin/$domain.ts`: `build.query` / `build.mutation`, `providesTags` /
  `invalidatesTags` iz `API_TAGS`; fajl/Blob nikad u store (tekst ili object URL)
- Poziv samo iz domenskog hooka (`src/hooks/admin/$domain/`)
