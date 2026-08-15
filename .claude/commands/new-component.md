---
description: Pravi komponentu u packages/ui sa cva varijantama, tipovima, testom i axe testom
argument-hint: [atom|molecule|organism] [Name]
arguments: layer Name
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pnpm lint:*), Bash(pnpm test:*)
---

Napravi `$Name` kao **$layer** u `packages/ui`.

## Prvo pročitaj

- `packages/ui/CLAUDE.md` — pravila paketa
- `docs/08-styling-ui.md` — CVA, tokeni, `tone` varijanta
- `docs/15-accessibility.md` — šta je obavezno
- `docs/adr/0007-ui-flat-vs-folder.md` — zašto folder a ne flat

## Provera pre pisanja

**Da li komponenta pripada `packages/ui`?** Test: može li se koristiti u projektu koji nema
Redux i nema i18n? Ako ne — pripada feature-u, ne dizajn sistemu. Reci to i stani.

**Da li je sloj tačan?** Koliko drugih komponenti sadrži: 0 → atom, 2–3 → molecule, više → organism.

## Struktura

```
packages/ui/src/<sloj>s/$Name/          ← atoms/ | molecules/ | organisms/
├── $Name.tsx              struktura — bez Tailwind class stringova
├── $Name.variants.ts      cva — sav vizuelni stil
├── $Name.test.tsx         ponašanje + (za organism) axe
└── index.ts               barrel
```

Ime cva eksporta je `$Name` u camelCase + `Variants` — npr. `SearchInput` → `searchInputVariants`.

## Pravila

- Sav vizuelni stil u `.variants.ts` — **i kad komponenta nema varijante** (tada je fajl samo
  `cva('...klase...')`)
- U `.tsx` ostaju samo layout klase (`flex`, `gap`) i `cn(<naziv>Variants(...), className)`
- Prima i prosleđuje `className` — inače se ne može prilagoditi iz app-e
- Samo semantički tokeni (`bg-primary`), nikad `bg-blue-500` ni `text-[#333]`
- Logička svojstva: `ps-4` ne `pl-4`, `ms-auto` ne `ml-auto`
- Ako može da stoji na tamnoj traci — dodaj `tone: 'default' | 'inverse'` varijantu
- Nema `default export`-a
- Izvezi `VariantProps` tip

## Acceptance

- `pnpm lint --filter=@app/ui` i `pnpm test --filter=@app/ui` prolaze
- Organism ima `jest-axe` test bez povreda
- Komponenta ne uvozi `@app/core`, store ni i18n
- Kontrast proveren u obe teme
