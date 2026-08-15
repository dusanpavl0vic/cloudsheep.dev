# packages/ui

Dizajn sistem. Koriste ga **obe** app-e.

Root pravila važe — vidi `/CLAUDE.md` i `docs/08-styling-ui.md`. Ovde su samo specifičnosti paketa.

## Jedno pravilo iznad svih

**Komponenta u `packages/ui` ne sme da zna za domen, store ni i18n ključeve.**

Prima sve preko propsa. Ako joj treba `useAuth` — nije komponenta dizajn sistema,
nego feature komponenta. Ako joj treba `t('auth.login.title')` — tekst ide kao prop.

```tsx
// ❌ ne pripada ovde
export function UserBadge() {
  const { user } = useAuth();
  const { t } = useTranslation();
  return <span>{t('auth.loggedInAs', { name: user.name })}</span>;
}

// ✅ dizajn sistem
export function Badge({ children, tone }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }))}>{children}</span>;
}
```

Test: **da li se ova komponenta može koristiti u projektu koji nema Redux i nema i18n?**
Ako ne — ne pripada ovde.

Zavisnosti paketa: samo `@app/utils` i `@app/hooks`. **Nikad `@app/core`.**

## Dve konvencije — granica je poreklo koda

| Folder | Struktura | Ko piše |
|---|---|---|
| `src/ui/` | **flat**, `kebab-case` — `button.tsx`, `alert-dialog.tsx` | shadcn CLI |
| `src/atoms/` `molecules/` `organisms/` `layouts/` | **folder** + `.variants.ts` + `index.ts` | mi |

Zašto: `pnpm dlx shadcn@latest add dialog` piše `ui/dialog.tsx`. Da je konvencija folder,
svaki `add` i svaki `diff` tražio bi ručno preuređivanje — zauvek.
Obrazloženje: [`docs/adr/0007-ui-flat-vs-folder.md`](../../docs/adr/0007-ui-flat-vs-folder.md).

**Ne diraj `src/ui/` ručno bez potrebe** — to je generisani kod koji se ažurira komandom.
Prilagođavanja idu u wrapper komponentu, ne u primitiv.

## Slojevi

| Sloj | Šta ide | Primer |
|---|---|---|
| `ui/` | shadcn primitivi | `button.tsx`, `dialog.tsx`, `input.tsx` |
| `atoms/` | sopstveni primitivi bez kompozicije | `Icon/`, `Text/`, `Spinner/` |
| `molecules/` | kombinacija 2–3 atoma | `FormField/`, `SearchInput/`, `Pagination/` |
| `organisms/` | složene, samostalne celine | `DataTable/`, `FilterPanel/`, `ModalShell/` |
| `layouts/` | raspored stranice | `PageLayout/`, `AuthLayout/`, `SplitLayout/` |

Ako ne znaš gde: **koliko drugih komponenti sadrži?** 0 → atom, 2–3 → molecule, više → organism.

## Stil

- Sav vizuelni stil u `.variants.ts` kroz **cva** — i kad komponenta nema varijante
  (tada je fajl samo `cva('...klase...')`)
- U `.tsx` ostaju **samo layout klase** (`flex`, `gap`, `max-w`) i `cn(xxxVariants(...), className)`
- **Samo semantički tokeni** — `bg-primary`, nikad `bg-blue-500` ni `text-[#333]`
- **Logička svojstva** — `ps-4` ne `pl-4`, `ms-auto` ne `ml-auto` (RTL)
- Komponenta koja može da stoji na tamnoj traci dobija `tone: 'default' | 'inverse'` varijantu,
  umesto da se piše dva puta
- Svaka komponenta prima `className` i prosleđuje ga kroz `cn()` — inače je nemoguće
  prilagoditi je iz app-e

## Pristupačnost nije opciona

Ovo je paket u kome se a11y rešava **jednom za sve** — greška ovde se množi kroz obe app-e.

- Radix primitivi nose focus trap, roving tabindex i ARIA — ne pisati ručno
- Svaki organism ima `jest-axe` test; violation obara CI
- `FormField` je mesto gde forme dobijaju `id` linkovanje, `aria-invalid` i `aria-describedby` —
  zato se polja nikad ne pišu ručno u app-i
- Kontrast ≥ 4.5:1 **u obe teme**

## Dodavanje komponente

```bash
/new-component <atom|molecule|organism> <Name>     # generiše folder, cva, tipove, test, axe test
pnpm dlx shadcn@latest add <name>                  # samo za shadcn primitive → src/ui/
```

Novi shadcn primitiv se **wrap-uje** pre upotrebe u app-i — app nikad ne uvozi `ui/button` direktno.

## Checklist

- [ ] Komponenta ne uvozi `@app/core`, store ni i18n
- [ ] Radi u projektu bez Redux-a i bez i18n-a
- [ ] Prima i prosleđuje `className`
- [ ] Stil je u `.variants.ts`, `.tsx` ima samo layout klase
- [ ] Samo semantički tokeni, logička svojstva
- [ ] Ima test; organism ima i `jest-axe` test
- [ ] Kontrast proveren u obe teme
- [ ] U pravom sloju (atom / molecule / organism / layout)
