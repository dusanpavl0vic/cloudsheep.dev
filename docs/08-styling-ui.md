# 08 — Stilovi i UI

> Status: active | Last review: 2026-10-08

styled-components 6 (ADR 0010). Vizuelni jezik (staklo, aurora, animacije):
[`22-visual-language.md`](22-visual-language.md).

## 1. Fajlovi

| Fajl                     | Sadrži                                                                                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `constants/theme/*.ts`   | vrednosti tokena: `PALETTE` (svetla/tamna), `SPACING`, `RADII`, `SHADOWS`, `BLUR`, `TYPOGRAPHY`, `BREAKPOINTS`/`MEDIA`, veličine, fontovi |
| `styles/theme.ts`        | tema sastavljena iz tokena (`theme.colors.ink`, `theme.media.desktop`…)                                                                   |
| `styles/GlobalStyles.ts` | reset, `@font-face`, vrednosti CSS promenljivih za obe teme                                                                               |
| `styles/mixins.ts`       | `focusRing`, `visuallyHidden`, `resetButton`, `lineClamp`, `typography(v)`, `glass(s)`, `gradientText`                                    |
| `styles/keyframes.ts`    | animacije iz dizajna (`bob`, `drift`, `popIn`, `marquee`…)                                                                                |
| `<Komponenta>.styles.ts` | styled elementi te komponente                                                                                                             |

## 2. Pravila

- **Svaki `.styles.ts` počinje sa `'use client'`** — styled-components radi samo u klijentskom
  modulu. Komponenta koja ih renderuje može da ostane serverska.
- **Boje samo iz teme** (`theme.colors.x`) ili iz konstanti tokena (`BRAND_COLORS`, `GLOW`).
  Hex i `rgb()` u `.styles.ts` su lint greška (`@app/no-raw-colors`).
- **Razmaci, radijusi, senke, prelomne tačke iz teme**: `${({ theme }) => theme.spacing[4]}px`,
  `${({ theme }) => theme.media.desktop} { … }`. Vrednosti koje ima samo jedna komponenta idu u
  njen `.constants.ts`.
- **Transient props** za sve što ide samo u stil: `$variant`, `$active` — ne završavaju u DOM-u.
- **Kratka imena** styled elemenata: `Root`, `Header`, `Item`, `Actions`.
- **Komponenta prima `className`**, da bi mogla da se stilizuje spolja (`styled(Komponenta)`).
- **Dinamička vrednost koja se često menja** (pozicija, procenat) ide kroz CSS promenljivu u
  `style` (`style={{ '--progress': '42%' }}`), ne kroz interpolaciju propa — svaka nova vrednost
  propa pravi novu CSS klasu.
- **Mobile-first**: osnovni stil je za telefon, `theme.media.tablet/desktop/wide` dodaju.

## 3. Teme

Tema je **objekat čije su vrednosti CSS promenljive**: `theme.colors.primary = 'var(--c-primary)'`.
Stvarne vrednosti su u `GlobalStyles`:

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

| ❌                                          | ✅                                          |
| ------------------------------------------- | ------------------------------------------- |
| `color: #0D47A1`                            | `color: ${({ theme }) => theme.colors.ink}` |
| `@media (min-width: 1024px)`                | `${({ theme }) => theme.media.desktop}`     |
| `<Box $x={mouseX}>` (nova klasa po pikselu) | `style={{ '--x': `${mouseX}px` }}`          |
| `'use client'` na View-u zbog stila         | stil u `.styles.ts`, View ostaje serverski  |
