# 15 — Pristupačnost

> Status: active | Last review: 2026-08-15

Cilj: **Lighthouse a11y 100**, nula axe povreda u CI-ju. Nije "lepo imati" — CI pada bez toga.

## Pravila

1. **Radix primitivi rešavaju focus trap, roving tabindex i ARIA.** Ne pisati ručno.
2. **`eslint-plugin-jsx-a11y` recommended je error**, ne warning.
3. **`jest-axe` u svakom organism testu**, `@axe-core/playwright` na svakoj e2e strani.
   Violation obara CI.
4. **Kontrast ≥ 4.5:1** za tekst, ≥ 3:1 za velike naslove i UI granice — **u obe teme**.
5. **`prefers-reduced-motion` se poštuje** u svakoj animaciji.
6. **Semantika pre ARIA.** `<button>` je bolji od `<div role="button" tabIndex={0}>`.

## Obavezno na svakoj stranici

| Element | Zahtev |
|---|---|
| Skip link | prvi fokusabilan element, vodi na `#main` |
| Landmarks | `<header>`, `<nav>`, `<main id="main">`, `<footer>` |
| Naslovi | tačno jedan `<h1>`, bez preskakanja nivoa |
| `<html lang>` | prati aktivan jezik ([`09-i18n.md`](09-i18n.md)) |
| Fokus | `focus-visible` vidljiv, nikad `outline: none` bez zamene |
| Slike | `alt` koji opisuje **svrhu**; dekorativne → `alt=""` |
| Toast | `aria-live="polite"`, greške `aria-live="assertive"` |
| Forme | `<label for>` linkovan, `aria-invalid`, `aria-describedby` |

## Primeri

```tsx
// ✅ skip link — prvi u DOM-u
<a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4">
  {t('common.skipToContent')}
</a>
```

```css
/* ✅ fokus koji se vidi u obe teme */
:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

```css
/* ✅ poštuj reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```ts
// ✅ i u JS-u, ne samo u CSS-u — useTypewriter preskače animaciju
const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
if (reduced) return fullText;
```

```tsx
// ✅ ikonica-dugme ima pristupačno ime
<Button size="icon" aria-label={t('theme.switchToDark')}>
  <Moon aria-hidden="true" />
</Button>

// ❌ screen reader čita "dugme" i ništa više
<Button size="icon"><Moon /></Button>
```

```tsx
// ✅ semantika
<button onClick={onSelect}>{label}</button>

// ❌ ručno rekonstruisan button — fali Space/Enter, fokus, role
<div role="button" tabIndex={0} onClick={onSelect}>{label}</div>
```

```tsx
// ✅ alt opisuje svrhu, ne izgled
<img src={logo} alt={t('common.companyLogo')} width={120} height={32} />

// ✅ dekorativna slika
<img src={pattern} alt="" aria-hidden="true" />
```

## Kontrast tokena

Svaki par prednji/pozadinski token se proverava **u obe teme**:

| Par | Minimum |
|---|---|
| `foreground` / `background` | 4.5:1 |
| `muted-foreground` / `background` | 4.5:1 |
| `faint` / `background` | 4.5:1 (ako nosi tekst) |
| `primary-foreground` / `primary` | 4.5:1 |
| `inverse-foreground` / `inverse` | 4.5:1 |
| `border` / `background` | 3:1 ako prenosi značenje |

`/a11y-audit` računa kontrast direktno iz OKLCH tokena — greška se hvata pre nego što
dođe do ekrana.

## Testiranje

```ts
// unit / komponenta
expect(await axe(container)).toHaveNoViolations();

// e2e
const results = await new AxeBuilder({ page }).analyze();
expect(results.violations).toEqual([]);
```

Automatika hvata ~40% problema. Ručno, pre svakog PR-a koji dira UI:

- [ ] Prođi celu stranicu **samo tastaturom** — Tab, Shift+Tab, Enter, Space, ESC
- [ ] Fokus je uvek vidljiv i ide logičnim redom
- [ ] Modal: fokus ulazi unutra, ESC zatvara, fokus se vraća na okidač
- [ ] Zumiraj na 200% — ništa se ne preklapa i ne seče

## Anti-patterns

| ❌ | ✅ |
|---|---|
| `<div onClick>` | `<button onClick>` |
| `outline: none` | `:focus-visible` stil |
| ikonica-dugme bez `aria-label` | `aria-label` sa i18n ključem |
| `alt="slika"` / `alt="logo.png"` | opis svrhe ili `alt=""` |
| `tabIndex={1}` i veći | prirodan DOM redosled |
| `role="button"` na `<a>` | pravi element za posao |
| placeholder umesto labele | `<Label>` uvek |
| animacija bez `prefers-reduced-motion` | media query + JS provera |
| boja kao jedini nosilac informacije | boja + ikona/tekst |
| `aria-hidden` na fokusabilnom elementu | ukloni iz tab reda ili ne skrivaj |

## Checklist

- [ ] `pnpm lint` prolazi — `jsx-a11y` je error
- [ ] Organism ima `jest-axe` test
- [ ] E2E strana ima `AxeBuilder` proveru
- [ ] Skip link i landmark elementi postoje
- [ ] Tačno jedan `<h1>`, nivoi se ne preskaču
- [ ] Sva interaktivna polja imaju pristupačno ime
- [ ] Kontrast ≥ 4.5:1 u **obe** teme
- [ ] Prošao ručni tastaturni prolaz
- [ ] Animacije poštuju `prefers-reduced-motion`
