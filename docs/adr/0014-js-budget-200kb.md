# ADR 0014 — JS budžet javnih ruta: 200 KB gzip, build kroz webpack

> Status: accepted
> Datum: 2026-10-09
> Učesnici: Dušan Pavlović

## Context

Stari sajt (Vite SPA) imao je budžet od 160 KB gzip početnog JS-a, koji je opisivao React,
ruter i aplikaciju. Plan prelaska na Next.js (ADR 0009) je zadržao tu granicu uz kontrolnu
tačku posle početne strane.

Merenje početne posle faze F3. Prvi broj je dobijen brojanjem `<script src>` u HTML-u, što je
kasnije pokazano kao **potcenjeno**: App Router deo chunk-ova učitava iz runtime-a. Merenje u
pravom pregledaču (Playwright, `scripts/check-size.mjs`) dalo je **231 KB** sa webpack-om, a
Lighthouse za mobilni 53 (LCP 5,4 s, TBT 560 ms) — vidi ADR 0015.

Prvo (potcenjeno) merenje:

| | Turbopack | webpack |
|---|---|---|
| React 19 + Next 16 runtime | ~135 KB | 128 KB |
| naš kod | ~106 KB | 84 KB |
| **ukupno** | **241 KB** | **212 KB** |

Od naših 84 KB: styled-components runtime 11,7 · Redux/immer/react-redux 12,7 ·
next-intl na klijentu 11,7 · ikonice 3,2 · komponente i stilovi ostatak. Sam okvir ostavlja
32 KB za ceo sajt — 160 KB nije dostižno bez napuštanja Redux-a, use-intl-a i
styled-components na javnim stranicama, što šablon (ADR 0011) propisuje.

## Decision

**Granica je 200 KB gzip početnog JS-a po javnoj ruti; `pnpm size` je proverava u CI-u.**
Produkcioni build ide kroz **webpack** (`next build --webpack`), jer daje 29 KB manji runtime
od Turbopack-a za isti kod. Razvojni server ostaje na Turbopack-u (brzina).

Uz to: forma u podnožju (prisutna na svakoj stranici) ne uvozi RTK Query — šalje kroz
`fetch` u domenskom hooku. RTK Query ostaje za admin i kontakt stranicu.

## Consequences

### Pozitivne
- Arhitektura ostaje po šablonu (Redux, use-intl, styled-components).
- Budžet je i dalje mašinski proveren — rast od 10+ KB obara CI.

### Negativne
- Javni JS je za ~25 % veći nego što je stari budžet dozvoljavao.
- Dev (Turbopack) i prod (webpack) koriste različite bundlere — greška specifična za jedan
  od njih se vidi tek u `pnpm build`. E2E testovi rade nad produkcionim build-om.
- Forma u podnožju ne dobija keš i stanja RTK Query-ja; ima svoj mali `fetch` sa stanjima.

### Neutralne / posledice po proces
- docs/07 §6 opisuje novi budžet i merenje; CLAUDE.md navodi 200 KB.

## Alternatives considered

| Opcija | Za | Protiv | Zašto odbačena |
|---|---|---|---|
| Zadržati 160 KB: next-yak + bez Redux-a i klijentskog next-intl-a na javnim stranicama | stari budžet | veliki refaktor, odstupanje od šablona, procena 160–170 KB — i dalje rizik | korisnik izabrao 200 KB |
| Samo upozorenje, bez granice | najbrže | budžet ništa ne čuva | drift je najveći rizik repoa |
| Ostati na Turbopack-u za build | jedan bundler | +29 KB bez ikakve koristi za korisnika | merenje |

## Dopuna (isti dan)

Sa ispravnim merenjem granica od 200 KB nije dostižna samo lakim uštedama. Korisnik je
izabrao da granica ostane, a da se runtime stilova ukloni prelaskom na next-yak (ADR 0015).

## Revisit when

- Turbopack produkcioni build padne na veličinu webpack-a (ponoviti merenje na svakoj
  major verziji Next-a) → vratiti build na podrazumevani.
- Neka javna ruta pređe 200 KB → prvi kandidati: next-yak umesto styled-components (−12 KB
  runtime + stilovi u CSS), Redux van javnih stranica (−13 KB).

## Reference

- ADR 0009 (Next.js), ADR 0010 (styled-components), ADR 0011 (slojevita struktura)
- `scripts/check-size.mjs`, docs/07-performance.md §6
