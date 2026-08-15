---
description: Dodaje RTK Query endpoint sa tagovima, tipovima, MSW handlerom i testom
argument-hint: [feature] [name] [method]
arguments: feature name method
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pnpm lint:*), Bash(pnpm test:*)
---

Dodaj endpoint `$name` (`$method`) u `features/$feature/api/<feature>Api.ts`.

## Prvo pročitaj

- `docs/11-data-fetching.md` — baseQuery, tagovi, optimistic update
- `docs/10-forms-validation.md` — validacija odgovora zod šemom

## Koraci

1. Dodaj kroz **`baseApi.injectEndpoints`** — nikad novi `createApi`
2. Eksplicitni tipovi zahteva i odgovora, bez `any`
3. **Tagovi:**
   - query → `providesTags`, uključujući `{ type: 'X', id: 'LIST' }` za liste
   - mutation → `invalidatesTags`
   - novi `tagType` mora u `baseApi.tagTypes`
4. **Ako `$method` nije GET i menja vidljivo stanje → obavezan optimistic update**
   (`onQueryStarted` + `updateQueryData` + `patch.undo()` u `catch`). Ovo je INP metrika,
   ne kozmetika.
5. MSW handler **kolokovan uz feature**, ne u globalnom fajlu
6. Test: loading → success → error putanja

## Pravila

- Bez ručnog `refetch()` — invalidacija ide preko tagova
- `transformResponse` za snake_case → camelCase se radi u `baseQuery`, na jednom mestu
- Komponenta ne uvozi generisani hook — troši ga feature hook
- Greške prolaze kroz `normalizeError`; UI prikazuje `t(messageKey)`, nikad sirovu serversku poruku

## Acceptance

- `pnpm lint && pnpm typecheck && pnpm test` prolazi
- Mutacija koja menja vidljivo stanje ima optimistic update sa `undo` na grešku
- MSW handler postoji i test pokriva sve tri putanje
