# 08 — Stilovi i UI

> Status: active | Last review: 2026-10-10

next-yak 9 (ADR 0015): styled-components API, ali se CSS izvlači u build-u — bez runtime-a i
bez računanja stilova pri hidrataciji. Vizuelni jezik (staklo, aurora, animacije):
[`22-visual-language.md`](22-visual-language.md).

## 1. Fajlovi

| Fajl                     | Sadrži                                                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `constants/theme/*.ts`   | vrednosti tokena: `PALETTE` (svetla/tamna), `SPACING`, `RADII`, `SHADOWS`, `BLUR`, `TYPOGRAPHY`, `MEDIA`, fontovi     |
| `styles/tokens.yak.ts`   | most do build-a: `colors`, `spacing`, `media`, `BRAND_COLORS`…, imena animacija (`anim`), pravila teme i `@font-face` |
| `styles/global.ts`       | `globalStyle`: reset, `@font-face`, CSS promenljive za obe teme                                                       |
| `styles/animations.ts`   | `globalStyle`: sve `@keyframes` (`cs-fade-up`, `cs-marquee`…)                                                         |
| `styles/mixins.ts`       | statični `css` mixin-i: `focusRing`, `visuallyHidden`, `resetButton`, `glassSoft/Strong`, `typographyX`, `lineClamp3` |
| `<Komponenta>.styles.ts` | styled elementi te komponente                                                                                         |
| `<Komponenta>.yak.ts`    | (opciono) vrednosti koje stil te komponente čita u build-u (`BUTTON_SIZES`, `RING`)                                   |

`global.ts` i `animations.ts` uvozi `Document` (jednom za ceo sajt); u `package.json` su u
`sideEffects`, inače bi ih tree-shaking izbacio.

## 2. Pravila

- **`.styles.ts` nema `'use client'`.** Styled element radi i u serverskoj komponenti — stil
  serverske sekcije ne putuje kao JS.
- **Vrednost u šablonu dolazi iz `.yak.ts`.** next-yak ne izvršava običan modul: `${colors.ink}`
  iz `@/styles/tokens.yak` radi, `${BRAND.x}` iz `@/constants/brand` ne. Izraz (`${a + 26}`) i
  poziv (`${glass('strong')}`) nisu dozvoljeni — `calc(${a}px + 26px)`, `${glassStrong}`.
- **Funkcija u šablonu bira statičan `css` blok, ne čita token u runtime-u** (lint
  `@app/no-runtime-tokens`). `${({ $on }) => ($on ? colors.accent : colors.ink)}` bi uvukao ceo
  `constants/theme` u klijentski JS:

  ```ts
  color: ${colors.ink};
  ${({ $on }) =>
    $on &&
    css`
      color: ${colors.accent};
    `}
  ```

- **Dinamička vrednost iz propa vraća jedinicu**: ``${({ $size }) => `${String($size)}px`}`` —
  next-yak je pretvara u CSS promenljivu na elementu; `${…}px` bi dao `var(--x)px`.
- **Nema `as` prop-a.** Element koji se bira prop-om: `styled(Slot)` + `component="h1"`.
- **Izbor iz objekta css blokova (`variants[$variant]`) ne radi** — eksplicitni uslovi po
  vrednosti (vidi `Button.styles.ts`).
- **Animacije su globalne**: `animation: ${anim.fadeUp} 0.9s …`. Nova animacija = ime u `anim`
  - `@keyframes` u `styles/animations.ts`. LCP element se ne animira kroz `opacity` (koristi
    `anim.slideUp`).
- **`.styles.ts` izvozi samo styled komponente**; vrednosti koje čita i TSX idu u `.constants.ts`
  ili `.yak.ts` (lint `no-restricted-syntax`).
- **Boje samo iz tokena**; hex i `rgb()` u `.styles.ts` su lint greška (`@app/no-raw-colors`).
- **Transient props** (`$variant`, `$active`) za sve što ide samo u stil.
- **Komponenta prima `className`**, da bi mogla da se stilizuje spolja (`styled(Komponenta)`).
- **Mobile-first**: osnovni stil je za telefon, `${media.tablet}`/`desktop`/`wide` dodaju.
  Dva izuzetka, oba uska: `${media.tabletOnly}` (640–1023) za raspored koji se razlikuje i od
  telefona i od desktopa (vodoravni paketi cena, proces 2×2), i `${media.phone}` /
  `${media.belowDesktop}` kad roditelj menja TUĐU komponentu (dugme, `TechTile`) — mobile-first
  bi tražio da se na većem ekranu vrati vrednost koju roditelj ne zna. JS čita isti prelom iz
  `MEDIA_QUERY` (`window.matchMedia`).
- **Raspored po širini se piše eksplicitno**, ne `repeat(auto-fit, minmax(…))` za mrežu sa
  poznatim brojem stavki: auto-fit je na tabletu davao 3 + 1 (statistike), 2 + 1 (cene) i
  jednu kolonu na 768 px (usluge). Broj kolona se bira po prelomu.
- **`overflow-x: clip` je na okviru javnog sajta** (`PublicLayout`), ne `hidden` na `body`:
  iOS Safari uz `hidden` i dalje pušta vodoravno pomeranje, a `clip` ne pravi kontejner za
  skrol, pa `position: sticky` radi.
- **CSS celog sajta je jedan fajl** (`next.config.ts`, webpack `cacheGroups.styles`).

## 3. Teme

Token je CSS promenljiva: `colors.primary = 'var(--c-primary)'`. Vrednosti za obe teme su u
`themeRules` (`tokens.yak.ts`), koje `global.ts` ubacuje kao cela pravila:

```css
:root { --c-primary: #0D47A1; … }                 /* svetla */
:root[data-theme='dark'] { --c-primary: #2196F3; … }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) { …tamna… }      /* korisnik nije birao → sistem */
}
```

- Izabrana tema je u kolačiću `cs-theme`. Server ga čita u `[locale]/layout.tsx` i postavlja
  `data-theme` na `<html>` — **bez treptaja i bez inline skripte** (CSP je ne bi pustio).
- Promena teme: `setTheme` → listener menja `data-theme` i upisuje kolačić. React se ne
  rerenderuje.

## 4. Fontovi

Self-hostovani u `public/fonts/` (latin + latin-ext, varijabilni), `@font-face` sa `unicode-range`
iz `constants/theme/fonts.ts`. `next/font` se ne koristi: ne podržava dva fajla iste porodice sa
različitim `unicode-range`, pa bi č/ć/š/ž/đ pala na sistemski font. Preload samo latin podskupa
za DM Sans i Space Grotesk (`Document`).

## Anti-patterns

| ❌                                            | ✅                                                |
| --------------------------------------------- | ------------------------------------------------- |
| `color: #0D47A1`                              | `color: ${colors.ink}`                            |
| `@media (min-width: 1024px)`                  | `${media.desktop} { … }`                          |
| `${({ $on }) => ($on ? colors.a : colors.b)}` | podrazumevano + `${({ $on }) => $on && css\`…\`}` |
| `width: ${({ $w }) => $w}px`                  | ``width: ${({ $w }) => `${String($w)}px`}``       |
| `<Title as="h1">`                             | `styled(Slot)` + `<Title component="h1">`         |
| `${variants[$variant]}`                       | uslov po varijanti                                |
| `'use client'` u `.styles.ts`                 | nema ga — stil radi na serveru                    |
