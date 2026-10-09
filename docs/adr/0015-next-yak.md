# ADR 0015 — next-yak umesto styled-components

> Status: accepted (zamenjuje ADR 0010)
> Datum: 2026-10-09
> Učesnici: Dušan Pavlović

## Context

Ispravno merenje u pravom pregledaču (ADR 0014) dalo je za početnu 231 KB JS-a i Lighthouse
mobilni 53 (LCP 5,4 s, TBT 560 ms). Glavni teret nije bio sam runtime styled-components-a
(11,7 KB), nego posledica App Router-a: svaki styled element je klijentska komponenta, pa
**stilovi svih sekcija — i serverskih — idu kao JS**, a pri hidrataciji runtime ponovo
računa svaku klasu (Style & Layout 1,3 s, Script Evaluation 1,7 s na mobilnom).

## Decision

**Koristimo next-yak 9** (isti `styled`/`css`/`keyframes` API, Rust SWC plugin) u režimu
nativnog CSS-a (`experiments.transpilationMode: 'Css'`). CSS se izvlači u build-u; u runtime-u
ostaje samo izbor klase i CSS promenljive za dinamičke vrednosti. `.styles.ts` više NIJE
`'use client'` — styled komponenta se renderuje i na serveru.

Pravila koja odluka nameće (docs/08 §2):

- vrednost u šablonu dolazi iz `.yak.ts` fajla (`styles/tokens.yak.ts`, `X.yak.ts`) — next-yak
  ne izvršava običan modul; izraz (`${a + 26}`) i poziv funkcije nisu dozvoljeni;
- funkcija u šablonu (`${({ $x }) => …}`) bira statičan `css` blok i nikad ne čita token u
  runtime-u (lint `@app/no-runtime-tokens`) — inače ceo `constants/theme` ulazi u klijentski JS;
- dinamička vrednost vraća jedinicu (`` `${String(px)}px` ``) — postaje CSS promenljiva;
- nema `as` prop-a → `styled(Slot)` sa `component="h1"`; izbor iz objekta css blokova
  (`variants[$v]`) ne radi → eksplicitni uslovi;
- animacije su globalne (`styles/animations.ts`, imena u `anim`), globalni stil je `globalStyle`
  i interpolira **cela** pravila (deklaracije unutar pravila next-yak iznese van bloka);
- CSS celog sajta je jedan fajl (webpack `splitChunks.cacheGroups.styles`) — next-yak inače
  pravi po fajl za svaki modul, a ~12 CSS zahteva je blokiralo render na mobilnom.

## Consequences

### Pozitivne
- Početna 231 → 196,8 KB, `/projects` 216 → 186 KB (ispod granice od 200 KB).
- Lighthouse mobilni (simulacija): početna 53 → 84, `/projects` 86 → 91; uz stvarni throttling
  91 i 98. TBT 560 → ~100 ms.
- Stilovi serverskih sekcija ne putuju kao JS.

### Negativne
- Mlađi alat (v9) sa sopstvenim ograničenjima (gore); greške se vide tek u build-u.
- Izlaz koristi nativni CSS nesting (`&:hover`, `@media` unutar pravila) — Chrome 120+,
  Safari 17.2+, Firefox 117+. Stariji pregledači gube ugnežđena pravila.
- Ceo CSS je jedan fajl i za admin — javne stranice preuzimaju i admin stilove (keširano).

### Neutralne / posledice po proces
- `docs/08` prepisan; ADR 0010 zamenjen; `scripts/yak` provere nisu potrebne — lint ih nosi.

## Alternatives considered

| Opcija | Za | Protiv | Zašto odbačena |
|---|---|---|---|
| CSS Modules | ugrađeno, najpredvidljivije | odstupa od šablona (styled), više posla | korisnik izabrao next-yak |
| ostati na styled-components + granica 240 KB | bez refaktora | mobilni ostaje < 90 zbog hidratacije stilova | merenje |

## Revisit when

- next-yak podrži `as` prop ili izbor iz objekta — pojednostaviti Button/Slot.
- Udeo pregledača bez CSS nesting-a u analitici pređe 2 % — uključiti spuštanje nesting-a.

## Reference

- ADR 0010 (zamenjen), ADR 0014 (budžet), https://yak.js.org/docs/migration-from-styled-components
