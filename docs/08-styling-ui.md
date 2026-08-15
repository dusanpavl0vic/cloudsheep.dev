# 08 — Stilovi i UI

> Status: active | Last review: 2026-08-15

Tailwind CSS v4 (CSS-first, `@theme`) + shadcn/ui + Radix + CVA.
Obrazloženje izbora: [`adr/0003-styling-choice.md`](adr/0003-styling-choice.md).

**Runtime CSS-in-JS (Emotion, styled-components) je zabranjen** — protivreči Lighthouse cilju.

## Pravila

1. **Tokeni samo u `packages/config/tailwind-config/theme.css`.**
   Nijedna hex vrednost, nijedan `text-[#333]`, nijedan `bg-blue-500` u komponenti.
2. **Samo semantičke klase:** `bg-primary`, `text-muted-foreground`, `border-border`.
3. **Varijante isključivo preko CVA**, nikad lestvica uslova u `clsx`.
4. **`cn()`** (`clsx` + `tailwind-merge`) iz `@app/ui/lib` za spajanje klasa.
5. **shadcn output ide u `packages/ui/src/ui/` flat** i **wrap-uje se** pre upotrebe u app-u.
6. **Dark mode kroz `data-theme` atribut** ([`adr/0008`](adr/0008-theme-data-attribute.md)),
   tema u Redux + `localStorage`, inline script u `index.html` protiv FOUC-a.
7. **RTL: logička svojstva** — `ps-4` umesto `pl-4`, `ms-auto` umesto `ml-auto`, svuda.
8. **Boje u OKLCH.** Paleta je definisana u hex-u u izvornom dizajnu; u `theme.css` se
   upisuje OKLCH ekvivalent (shadcn v4 default, bolja interpolacija).

## Tokeni

```css
/* packages/config/tailwind-config/theme.css */
@custom-variant dark (&:where([data-theme='dark'], [data-theme='dark'] *));

:root {
  --radius: 0.75rem;
  --background: oklch(97.6% 0.005 106);
  --foreground: oklch(36.5% 0.121 264);
  --primary: oklch(50.4% 0.221 264);
  --muted-foreground: oklch(46.8% 0.078 264);
  --border: oklch(90.7% 0.008 106);
  /* … */
}

[data-theme='dark'] { --background: oklch(23.1% 0.062 264); /* … */ }

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  /* … */
}
```

Pored standardnih shadcn tokena postoje i:

| Grupa | Tokeni | Namena |
|---|---|---|
| `success` | `--success`, `--success-foreground` | uptime, dostupnost |
| `display` | `--display` | gigant hero naslov (near-black, ne ink) |
| `faint` | `--faint` | meta tekst, mono labele |
| **inverzna površina** | `--inverse`, `--inverse-foreground`, `--inverse-muted`, `--inverse-faint`, `--inverse-border`, `--inverse-primary` | tamne trake (CTA panel, footer) koje ostaju tamne i u svetloj temi |

**Komponenta koja može da stoji na obe podloge dobija cva varijantu `tone: 'default' | 'inverse'`**
umesto da se piše dva puta.

`accent` je brend akcenat — **ne** koristi se za hover neutralnih elemenata; za to je `muted`.

## Varijante — CVA

```ts
// packages/ui/src/molecules/Badge/Badge.variants.ts
export const badgeVariants = cva(
  'inline-flex items-center rounded-full font-mono text-xs tracking-wide',
  {
    variants: {
      tone: {
        default: 'bg-muted text-muted-foreground',
        accent: 'bg-primary/10 text-primary',
        inverse: 'bg-inverse-border text-inverse-muted',
      },
      size: { sm: 'px-2 py-0.5', md: 'px-3 py-1' },
    },
    defaultVariants: { tone: 'default', size: 'md' },
  },
);
export type BadgeVariants = VariantProps<typeof badgeVariants>;
```

```tsx
// Badge.tsx — struktura, bez Tailwind class stringova
export function Badge({ tone, size, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, size }), className)} {...props} />;
}
```

**Sav vizuelni stil živi u `.variants.ts`, i kad komponenta nema varijante** — tada je fajl
samo `cva('...klase...')`. U `.tsx` ostaju isključivo layout utility klase (`flex`, `gap`, `max-w`).

## Tema

Tema se menja postavljanjem `data-theme` na `<html>`. To radi **listener middleware** u
`packages/core`, ne `useEffect`:

```ts
themeListener.startListening({
  matcher: isAnyOf(themeToggled, themeSet),
  effect: (_action, api) => applyTheme(selectTheme(api.getState())),
});
```

Pri prvom ulasku koristi se `prefers-color-scheme`. Protiv FOUC-a — inline script u `index.html`
koji postavi atribut pre prvog paint-a.

**Komponente nikad ne znaju koja je tema aktivna.** Koriste semantičke klase i tema "samo radi".

## Prvo platforma, pa biblioteka

Kada platforma rešava problem, ne dodaje se zavisnost. FAQ akordeon koristi native
`<details>`/`<summary>` — otvaranje radi browser, bez `useState`-a, bez `useEffect`-a i bez
Radix paketa, uz besplatnu pristupačnost i rad bez JavaScript-a.

Radix se uzima kada treba focus trap, roving tabindex ili ARIA koje platforma nema (Dialog,
Popover, Select).

## SVG iz dizajna

Pre upotrebe: skloni `<rect>` pozadinu · boje zameni sa `currentColor` (tema radi sama) ·
zaokruži koordinate na 2 decimale (Figma piše 10 — ušteda ~17% bez vidljive razlike).
Za nekvadratne SVG-ove koristi `h-* w-auto`, ne `size-*`.

## Anti-patterns

| ❌ | ✅ |
|---|---|
| `className="bg-blue-500"` | `className="bg-primary"` |
| `className="text-[#133E87]"` | `className="text-foreground"` |
| `clsx(a && 'p-2', b && 'p-4', c && 'p-6')` | cva `size` varijanta |
| `className="pl-4 ml-auto"` | `className="ps-4 ms-auto"` (RTL) |
| Tailwind klase u `.tsx` komponente | `.variants.ts` |
| `styled.div\`color: red\`` | zabranjeno — runtime CSS-in-JS |
| `useTheme()` pa `if (dark)` u komponenti | semantički token |
| dve komponente `Card` i `CardDark` | jedna sa `tone` varijantom |
| `size-6` na SVG 120×32 | `h-8 w-auto` |

## Checklist

- [ ] Nijedna hex/RGB vrednost i nijedna sirova Tailwind boja u komponenti
- [ ] Stil je u `.variants.ts`, `.tsx` ima samo layout klase
- [ ] Varijante su CVA, ne uslovni `clsx`
- [ ] Logička svojstva (`ps`/`pe`/`ms`/`me`) umesto `pl`/`pr`/`ml`/`mr`
- [ ] Komponenta radi u obe teme bez da zna koja je aktivna
- [ ] Ako stoji na tamnoj traci — ima `tone: 'inverse'` varijantu
- [ ] Kontrast ≥ 4.5:1 u obe teme ([`15-accessibility.md`](15-accessibility.md))
- [ ] Novi shadcn primitiv je u `ui/` flat i wrap-ovan pre upotrebe
