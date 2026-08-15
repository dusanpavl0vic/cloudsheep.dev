# ADR 0007 — `packages/ui`: flat `ui/`, folder svuda drugde

> Status: **accepted**
> Datum: 2026-08-15

## Context

Dva pravila iz izvornih dokumenata su se sudarila:

- **`PROJECT_GUIDE.md` §2.2** (postojeći projekat): svaka komponenta je folder —
  `Button/Button.tsx` + `Button.variants.ts` + `index.ts`. Struktura i stil razdvojeni.
- **[ADR 0000](0000-initial-spec.md) §4.2** (SPEC): `packages/ui/src/ui/` je **flat**,
  „tako CLI očekuje" — `button.tsx`, `dialog.tsx`.

Sudar je stvaran: `pnpm dlx shadcn@latest add dialog` piše `ui/dialog.tsx`. Ako je konvencija
folder, svaki `shadcn add` traži ručno preuređivanje — **zauvek**, pri svakoj komponenti i
pri svakom update-u.

Postojeći kod ima 8 primitiva u folder formi (`components/ui/Button/`, `Input/`, `Card/`…).

## Decision

**Podela po poreklu koda:**

| Lokacija | Struktura | Razlog |
|---|---|---|
| `packages/ui/src/ui/` | **flat**, `kebab-case` — `button.tsx` | shadcn CLI output; ažurira se komandom, ne rukom |
| `packages/ui/src/atoms\|molecules\|organisms\|layouts/` | **folder** + `.variants.ts` + `index.ts` | naš kod; struktura i stil razdvojeni |
| `apps/*/src/components/` | **folder** | isto |
| `features/*/components/` | **folder** | isto |

Postojećih 8 primitiva se **spljošti** pri migraciji u `packages/ui`.

shadcn output se **wrap-uje** pre upotrebe u app-u — app nikad ne uvozi `ui/button` direktno,
nego našu komponentu koja ga obavija.

## Consequences

### Pozitivne
- `shadcn add` i `shadcn diff` rade bez ručnog rada — može se automatizovati
- Update primitiva na novu shadcn verziju je merge, ne prepisivanje
- Naš kod zadržava razdvajanje strukture i stila, koje je bilo eksplicitno pravilo

### Negativne
- **Dve konvencije u istom paketu** — mora se objasniti svakom novom developeru
  („zašto je `button.tsx` flat a `Icon/` folder?"). Ublažava se time što je granica
  jasna: *ako je shadcn generisao — flat*
- Primitivi u `ui/` nemaju `.variants.ts` — cva im je u istom fajlu, kako shadcn piše
- Migracija postojećih 8 komponenti u flat oblik je jednokratni posao

### Neutralne
- `components.json` (shadcn config) živi u `packages/ui/`

## Alternatives considered

| Opcija | Za | Protiv | Zašto odbačena |
|---|---|---|---|
| **Folder svuda, i u `ui/`** | jedna konvencija, potpuna doslednost | svaki `shadcn add` traži ručno preuređivanje, zauvek; `shadcn diff` prestaje da radi | trajni trošak veći od dobitka |
| **Flat svuda** | najmanje fajlova, jedna konvencija | gubi se razdvajanje strukture i stila — eksplicitno pravilo projekta | odbačeno |
| **Ne koristiti shadcn CLI**, sve pisati ručno | puna kontrola | gubi se ceo razlog za shadcn | odbačeno |

## Revisit when

- shadcn CLI dobije podršku za folder output (tada folder svuda)
- Broj naših komponenti u `ui/` (ne-shadcn) pređe broj shadcn primitiva

## Reference

- [`docs/02-folder-structure.md`](../02-folder-structure.md)
- [`docs/08-styling-ui.md`](../08-styling-ui.md)
- [ADR 0000](0000-initial-spec.md) §4.2
