# ADR 0003 — Tailwind CSS v4

> Status: superseded by [ADR-0010](0010-styled-components.md)
> Datum: 2026-08-15

## Context

Stilski sloj mora da zadovolji tri tvrda uslova:

1. **Zero runtime** — Lighthouse cilj je ≥ 95 performance, 100 a11y
2. **Token sistem** sa svetlom/tamnom temom i inverznim površinama
3. **Kompatibilnost sa shadcn/ui** — dizajn sistem se ne piše od nule

Postojeći kod je već na Tailwind v4 sa punim setom tokena u `global.css`.

## Decision

**Tailwind CSS v4**, CSS-first (`@theme`), tokeni u
`packages/config/tailwind-config/theme.css`, varijante isključivo kroz CVA.

**Runtime CSS-in-JS je zabranjen.**

## Consequences

### Pozitivne
- Zero runtime — ništa ne stiže u JS bundle
- v4 engine je drastično brži od v3
- shadcn/ui radi bez adaptera
- Tokeni su obične CSS varijable — tema se menja jednim atributom, bez re-rendera
- `tailwind-merge` rešava konflikte klasa pri kompoziciji

### Negativne
- **Dugački class stringovi** — ublažava se pravilom da stil živi u `.variants.ts`,
  a `.tsx` ostaje čist
- **`tailwind-merge` nosi 7% bundle-a** (mereno) — cena koju plaćamo za `cn()`
- Bez discipline se lako sklizne u `bg-blue-500` i `text-[#333]`; zato je lint pravilo obavezno
- Migracija tokena na OKLCH je dodatni korak (izvorna paleta je u hex-u)

### Neutralne
- Prettier sortira klase (`prettier-plugin-tailwindcss`) — diff-ovi ostaju stabilni

## Alternatives considered

| Opcija | Za | Protiv | Zašto odbačena |
|---|---|---|---|
| **Panda CSS** | zero-runtime, type-safe recepti, bolji DX od Tailwind-a u velikim timovima | mali ekosistem, **gubiš shadcn** | cena gubitka shadcn-a je previsoka |
| **vanilla-extract** | zero-runtime, pun TypeScript | verbozno, **gubiš shadcn**, sporiji build | isto |
| **CSS Modules** | najjednostavnije, nula alata | nema token sistem ni varijante; sve se piše ručno | premalo za dizajn sistem |
| **Emotion / styled-components** | poznato, dinamički stilovi | **runtime CSS-in-JS** — direktno protiv Lighthouse cilja | zabranjeno |

## Revisit when

- shadcn objavi podršku za drugi engine
- `tailwind-merge` postane merljivo usko grlo (7% je danas prihvatljivo)
- Tim naraste preko ~5 ljudi, gde type-safe recepti (Panda) počinju da se isplate

## Reference

- [`docs/08-styling-ui.md`](../08-styling-ui.md)
- [`0007-ui-flat-vs-folder.md`](0007-ui-flat-vs-folder.md)
- [`0008-theme-data-attribute.md`](0008-theme-data-attribute.md)
