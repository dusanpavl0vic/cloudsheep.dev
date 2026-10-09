---
description: Nalazi nedostajuće i nekorišćene i18n ključeve, hardkodovane stringove i pogrešne srpske plural forme
argument-hint: [opciono: namespace]
allowed-tools: Read, Grep, Glob, Bash(pnpm lint:*), Bash(pnpm typecheck:*)
---

Proveri stanje prevoda (`$ARGUMENTS` ako je dat, inače sve) u `src/constants/i18n/en.ts` i `sr.ts`.

## Prvo pročitaj

`docs/09-i18n.md`.

## Četiri provere

### 1. Nedostajući ključevi
Ključ koji postoji u `sr.ts` a ne u `en.ts` (ili obrnuto). **Skupovi ključeva moraju
biti identični** (`pnpm typecheck` hvata nedostajući ključ u `sr.ts`, jer je tipizovan po `en.ts`). Isto za ključ koji kod koristi a nijedan fajl nema.

### 2. Nekorišćeni ključevi
Ključ koji postoji u porukama a nigde se ne poziva. Pazi na dinamičke pozive
(`t(\`items.${type}.label\`)`) — to nisu mrtvi ključevi, prijavi ih odvojeno kao "dinamički".

### 3. Hardkodovani stringovi
Literal tekst u JSX-u u `src/components/` i `src/app/`. `pnpm lint` ovo hvata kroz
`eslint-plugin-i18next`, ali proveri i `aria-label`, `title`, `alt`, `placeholder` —
tu se najčešće provuku.

### 4. Srpske plural forme — najčešća greška

Srpski ima **tri** forme, engleski dve. Ako je srpski ključ prekopiran po engleskoj strukturi,
dobija se „3 projekat".

| Broj | Forma |
|---|---|
| 1, 21, 31, 101 | `one` |
| 2–4, 22–24 | `few` |
| 0, 5–20, 25–30 | `other` |

Svaki `{count, plural, ...}` u `sr.ts` mora imati `one`, `few` **i** `other`.

I: `{reč}` u tekstu je ICU promenljiva — doslovne vitičaste zagrade u poruci obaraju render
(`FORMATTING_ERROR`).

## Izlaz

Četiri sekcije, po jedna za svaku proveru. Za svaku: tabela `ključ | fajl | problem | fix`.
Ako je sekcija prazna, napiši „✅ nema nalaza" — ne izostavljaj je.

Na kraju: ukupan broj ključeva po namespace-u i po jeziku.

Ne menjaj fajlove bez potvrde.
