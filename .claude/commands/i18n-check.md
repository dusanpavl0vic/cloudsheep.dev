---
description: Nalazi nedostajuće i nekorišćene i18n ključeve, hardkodovane stringove i pogrešne srpske plural forme
argument-hint: [opciono: app]
allowed-tools: Read, Grep, Glob, Bash(pnpm i18n:*), Bash(pnpm lint:*)
---

Proveri stanje prevoda (`$ARGUMENTS` ako je dat, inače sve app-e).

## Prvo pročitaj

`docs/09-i18n.md`.

## Četiri provere

### 1. Nedostajući ključevi
Ključ koji postoji u `sr.json` a ne u `en.json` (ili obrnuto). **Skupovi ključeva moraju
biti identični.** Isto za ključ koji kod koristi a nijedan fajl nema.

### 2. Nekorišćeni ključevi
Ključ koji postoji u JSON-u a nigde se ne poziva. Pazi na dinamičke pozive
(`t(\`items.${type}.label\`)`) — to nisu mrtvi ključevi, prijavi ih odvojeno kao "dinamički".

### 3. Hardkodovani stringovi
Literal tekst u JSX-u u `features/` i `pages/`. `pnpm lint` ovo hvata kroz
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

Svaki `{count, plural, ...}` u `sr.json` mora imati `one`, `few` **i** `other`.

## Izlaz

Četiri sekcije, po jedna za svaku proveru. Za svaku: tabela `ključ | fajl | problem | fix`.
Ako je sekcija prazna, napiši „✅ nema nalaza" — ne izostavljaj je.

Na kraju: ukupan broj ključeva po namespace-u i po jeziku.

Ne menjaj fajlove bez potvrde.
