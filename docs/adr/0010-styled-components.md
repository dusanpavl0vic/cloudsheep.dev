# ADR 0010 — styled-components umesto Tailwind-a

> Status: superseded by [ADR 0015](0015-next-yak.md)
> Datum: 2026-10-08
> Učesnici: Dušan Pavlović

## Context

Novi organizacioni šablon (`REACT_FRONTEND_STRUCTURE.md`, ADR 0011) propisuje
styled-components: stil u `.styles.ts`, transient props (`$variant`), sve vrednosti iz teme.
Redizajn donosi novi vizuelni jezik (staklo, aurora, spekular) sa dve teme.

U App Router-u styled-components radi samo u klijentskim modulima, a CSS putuje i kao JS.
Zato je JS budžet (tada 160 KB gzip po javnoj ruti, sada 200 KB — ADR 0014) rizik koji se mora meriti.

## Decision

Koristimo **styled-components 6** sa SSR registry-jem i SWC transformacijom. Svaki
`.styles.ts` počinje sa `'use client'`; komponente koje ne trebaju hookove ostaju serverske
i samo renderuju styled elemente. **Tema je objekat čije su vrednosti CSS promenljive**
(`colors.primary = 'var(--color-primary)'`); stvarne vrednosti za svetlu i tamnu temu su u
`GlobalStyles` pod `[data-theme]` (ADR 0008).

## Consequences

### Pozitivne
- Šablon se primenjuje doslovno: `.styles.ts`, `theme.colors.x`, `theme.media.desktop`.
- Promena teme ne rerenderuje React — menja se samo `data-theme` na `<html>`.
- Tekst i dalje može da se prevodi na serveru i prosledi styled elementu kao `children`.

### Negativne
- ~13 KB gzip runtime-a i CSS kao JS u svakom chunk-u — direktno troši JS budžet.
- Svaka styled komponenta se hidratiše; serverske komponente ne mogu same da nose stil.
- Klasa se računa u runtime-u; za dinamičke vrednosti koristimo CSS promenljive, ne
  interpolaciju po propu, da ne bi nastajale nove klase.

### Neutralne / posledice po proces
- `docs/08-styling-ui.md` prepisan; Tailwind, cva, `prettier-plugin-tailwindcss` i
  `scripts/check-css.mjs` uklonjeni.

## Alternatives considered

| Opcija | Za | Protiv | Zašto odbačena |
|---|---|---|---|
| Zadržati Tailwind + cva | nula runtime-a, RSC prirodno | protivreči šablonu koji je korisnik zadao | šablon je zahtev |
| next-yak (isti API, bez runtime-a) | budžet | SWC plugin vezan za tačnu verziju Next-a, mala zajednica | rezerva ako budžet pukne |
| vanilla-extract / Pigment CSS | bez runtime-a | drugačiji API od šablona | ne poštuje šablon |

## Revisit when

Ako merenje (`pnpm size`) pokaže > 200 KB gzip na bilo kojoj javnoj ruti (ADR 0014) — prvi kandidat je
prelazak `.styles.ts` fajlova na `next-yak`, koji ima isti API.

## Reference

- `docs/08-styling-ui.md`, `docs/07-performance.md` §6
- ADR 0003 (zamenjen ovim), ADR 0008
