# ADR 0012 — Jezik u URL-u (`/`, `/sr`) preko next-intl

> Status: accepted
> Datum: 2026-10-08
> Učesnici: Dušan Pavlović

## Context

Do sada je jedna adresa služila oba jezika; jezik je birao detektor pregledača. Statični HTML
je bio engleski, pa Google nikad nije video srpsku verziju — sajt studija iz Niša nije mogao
da se nađe na srpskom.

## Decision

Javni sajt ima **engleski na `/` i srpski na `/sr/…`** (`localePrefix: 'as-needed'`), sa
`hreflang` parovima (`en`, `sr`, `x-default` → engleski) u metapodacima i u sitemap-u. Jezik se
**ne pogađa po pregledaču** (`localeDetection: false`): ista adresa uvek daje isti jezik.
Biblioteka je **next-intl**, čiji je API `use-intl` koji šablon propisuje (`useTranslations`).
Poruke su tipizovani TS objekti `constants/i18n/en.ts` i `sr.ts`.

Admin nije indeksiran i nema prefiks; jezik admin-a je u `preferences` slice-u (šablon §9.1).

## Consequences

### Pozitivne
- Obe jezičke verzije su indeksabilne i povezane hreflang-om.
- Nema preusmeravanja po `Accept-Language`, pa Googlebot i keš uvek dobijaju isto.
- `sr.ts` koji nema ključ iz `en.ts` je greška tipa, ne prazan string na ekranu.

### Negativne
- Broj stranica za održavanje (i sitemap) se duplira.
- Posetilac iz Srbije prvo vidi engleski i mora da klikne SR.
- Postojeći srpski linkovi bez prefiksa sada daju engleski.

### Neutralne / posledice po proces
- `docs/05-routing.md`, `docs/09-i18n.md`; `Link` i `useRouter` se uvoze iz `@/i18n/navigation`.

## Alternatives considered

| Opcija | Za | Protiv | Zašto odbačena |
|---|---|---|---|
| Jedna adresa, jezik iz kolačića | jednostavno | Google vidi samo jedan jezik | to je problem koji rešavamo |
| Prefiks za oba (`/en`, `/sr`) | simetrično | lomi sve postojeće indeksirane adrese | `as-needed` čuva postojeće |
| Detekcija + preusmeravanje | posetilac odmah na svom jeziku | Google odvraća od toga; keš i bot dobijaju različito | rizik za indeksiranje |

## Revisit when

Ako srpski saobraćaj pređe engleski — tada razmotriti `sr` kao podrazumevani.

## Reference

- `docs/05-routing.md`, `docs/09-i18n.md`
- https://developers.google.com/search/docs/specialty/international/localized-versions
