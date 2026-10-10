---
description: Skafolduje novi domen od baze do UI-ja — Prisma model + migracija, zod šema, servis, API rute, RTKQ/hook, komponente, i18n, testovi
argument-hint: [domain]
arguments: domain
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pnpm lint:*), Bash(pnpm test:*), Bash(pnpm typecheck:*), Bash(pnpm exec eslint:*), Bash(pnpm exec vitest:*)
---

Dodaj domen `$domain`.

## Prvo pročitaj

`docs/18-adding-new-feature.md`, `docs/01-architecture.md` §4 (granice), `docs/11-data-fetching.md`,
`docs/10-forms-validation.md`.

## Slojevi (redom)

1. **Baza** — model u `prisma/schema.prisma`; migracija kroz `pnpm db:migrate --name $domain`
   (samo dodavanje kolona/tabela — unazad kompatibilno). `migrate reset` samo uz izričitu
   saglasnost vlasnika.
2. **Šema** — `src/schemas/$domain.ts`: zod, poruke su i18n ključevi; `update…Schema =
   schema.partial()`; forma koja se razlikuje od API-ja → `…FormSchema` + `to…Input` (test).
3. **Tipovi** — `src/types/$domain.ts` (javni i `Admin…` oblik).
4. **Servis** — `src/server/services/$domain.ts` (`import 'server-only'`): serializer koji nabraja
   polja, ISO datumi, `cached(..., [CACHE_TAGS.X])` za javno čitanje, `invalidate(tag)` posle
   svake izmene. Test nad bazom: `$domain.db.test.ts`.
5. **API** — `src/app/api/admin/$domain/route.ts` i `[id]/route.ts`: `handleAdmin`, `readJson`
   za POST, **`readPatch` za PATCH** (inače defaults brišu polja), `noContent()` za DELETE.
6. **Klijent (admin)** — `src/store/api/admin/$domain.ts` kroz `crudEndpoints`; hookovi u
   `src/hooks/admin/$domain/` (`use<Domen>s`, `use<Domen>Form`); komponente u
   `src/components/admin/$domain/`; stranica u `src/app/admin/(app)/$domain/`.
7. **Javni sajt** — servis direktno iz serverske komponente (bez RTKQ-a); sitemap ako se indeksira.
8. **i18n** — `admin.$domain.*`, `$domain.errors.invalid` i javni ključevi u `en.ts` **i** `sr.ts`.

## Acceptance

- `pnpm typecheck`, `pnpm lint`, `pnpm test` (unit + db) prolaze
- e2e za kritičan tok (npr. dodaj/izmeni/obriši u admin-u)
- Izmena u admin-u odmah vidljiva na sajtu (invalidate tag)
