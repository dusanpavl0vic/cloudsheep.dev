---
description: Pokreće axe i jsx-a11y, računa kontrast OKLCH tokena u obe teme i proverava tastaturnu navigaciju
argument-hint: [opciono: app ili putanja]
allowed-tools: Read, Grep, Glob, Bash(pnpm lint:*), Bash(pnpm test:*), Bash(pnpm e2e:*)
---

Proveri pristupačnost (`$ARGUMENTS` ako je dat, inače sve).

## Prvo pročitaj

`docs/15-accessibility.md`.

## Četiri provere

### 1. Automatske
```bash
pnpm lint          # eslint-plugin-jsx-a11y — error nivo
pnpm test          # jest-axe u komponentnim testovima
```
Prijavi svaku povredu sa fajlom i pravilom.

### 2. Kontrast tokena — računaj, ne pretpostavljaj

Pročitaj tokene iz `packages/config/tailwind-config/theme.css` i izračunaj kontrast
za svaki par, **u obe teme**:

| Par | Minimum |
|---|---|
| `foreground` / `background` | 4.5:1 |
| `muted-foreground` / `background` | 4.5:1 |
| `faint` / `background` | 4.5:1 ako nosi tekst |
| `primary-foreground` / `primary` | 4.5:1 |
| `inverse-foreground` / `inverse` | 4.5:1 |
| `border` / `background` | 3:1 ako prenosi značenje |

Boje su u OKLCH — konvertuj u sRGB pa računaj WCAG relativnu luminansu.
**Prijavi izračunatu vrednost**, ne samo prolaz/pad.

### 3. Šta axe ne hvata

Automatika hvata oko 40%. Pregledaj kod i traži:
- ikonica-dugme bez `aria-label`
- `alt` koji opisuje izgled umesto svrhe (`alt="logo.png"`)
- `<div onClick>` umesto `<button>`
- `outline: none` bez `:focus-visible` zamene
- animacija bez `prefers-reduced-motion`
- boja kao jedini nosilac informacije
- `tabIndex` veći od 0

### 4. Obavezni elementi po stranici
skip-link · landmark elementi · tačno jedan `<h1>` · `<html lang>` prati jezik

## Izlaz

Sekcija po proveri, tabela `fajl/token | problem | WCAG kriterijum | fix`.
Na kraju: lista za **ručnu** proveru koju automatika ne može (tastaturni prolaz, zum 200%).
