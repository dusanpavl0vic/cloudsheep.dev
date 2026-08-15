---
description: Skafolduje novi feature folder sa api/components/hooks/store/schemas/locales/testovima, registruje reducer i i18n namespace
argument-hint: [app] [feature]
arguments: app feature
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pnpm lint:*), Bash(pnpm test:*), Bash(pnpm typecheck:*)
---

Skafolduj feature `$feature` u aplikaciji `apps/$app`.

## Prvo pročitaj

- `docs/18-adding-new-feature.md` — kanonski redosled koraka
- `docs/01-architecture.md` — granice i public API feature-a
- `docs/13-hooks.md` — hook-first pravilo
- `docs/03-naming-conventions.md` — imenovanje fajlova

## Koraci

1. **Proveri da li feature uopšte treba.** Ako nema sopstveni domen i URL, ovo je komponenta
   u postojećem feature-u — reci to i stani.

2. Napravi `apps/$app/src/features/$feature/` sa **samo onim folderima koji su potrebni**.
   Prazan `modals/` ili `schemas/` se ne pravi.

3. Popuni redom (svaki korak daje tip koji sledeći koristi):
   `types.ts` → `schemas/` → `api/<feature>Api.ts` → `store/` (samo ako ima client state)
   → `hooks/use<Feature>.ts` → `locales/{sr,en}.json` → `components/` → `index.ts`

4. **Registruj** — ovo se najčešće zaboravi:
   - reducer kroz `injectReducer` (ako ima slice)
   - novi `tagTypes` u `baseApi` (ako ima nove tagove)
   - i18n namespace, lazy uz rutu
   - MSW handleri u test setup-u

5. Generiši testove po piramidi iz `docs/12-testing.md`: zod šema → reducer → selektori →
   **hook (primarni fokus)** → komponenta.

6. Pokreni `pnpm lint`, `pnpm typecheck`, `pnpm test --filter=$app`.

## Pravila koja ne smeš prekršiti

- `index.ts` eksportuje **samo** hookove, tipove i komponente — nikad slice, selektore ni endpointe
- Feature ne importuje drugi feature
- Prevodi idu u **oba** fajla (`sr.json` i `en.json`), ključevi sa `$feature.` prefiksom
- Nula `useEffect`-a; ako ti stvarno treba, mora imati `// effect:` komentar sa whitelist-e
- Najviše 2 `useState` po komponenti
- Server state kroz RTKQ, nikad kopiran u slice

## Acceptance

- `pnpm lint && pnpm typecheck && pnpm test --filter=$app` prolazi bez ijednog upozorenja
- Feature se može obrisati `rm -rf` bez lomljenja ostatka aplikacije
- Prevodi postoje u `sr.json` i `en.json`, isti skup ključeva u oba

Na kraju prijavi: koje si fajlove napravio, šta si registrovao i šta korisnik mora ručno da uradi.
