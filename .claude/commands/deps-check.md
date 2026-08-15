---
description: Nalazi zastarele i ranjive pakete, duplikate u lock fajlu i odstupanja od catalog pinova
allowed-tools: Read, Grep, Glob, Bash(pnpm outdated:*), Bash(pnpm audit:*), Bash(pnpm why:*), Bash(pnpm list:*)
---

Proveri stanje zavisnosti.

## Prvo pročitaj

`docs/16-tooling-ci.md` §1 — pinovane verzije i **zašto dve namerno nisu najnovije**.

## Postupak

```bash
pnpm outdated -r
pnpm audit --audit-level=high
```

## Šta prijaviti

### 1. Zastareli paketi
Odvoji **patch/minor** (bezbedno) od **major** (traži proveru breaking changes).

### 2. Ranjivosti
Svaka sa CVE oznakom, putanjom (`pnpm why <pkg>`) i predlogom.

### 3. Duplikati
Isti paket u dve verzije u lock fajlu — nosi dvostruku težinu u bundle-u.

### 4. Odstupanja od `catalog:`
Paket koji ima verziju upisanu direktno u `package.json` umesto `catalog:`.

## Dva namerna odstupanja koja NISU nalazi

Ne prijavljuj ova dva kao „zastarelo" — to su svesne odluke sa peer-dependency razlogom:

| Paket | Pin | Zašto ne najnovije |
|---|---|---|
| `typescript` | 6.0.3 | `typescript-eslint` peer je `<6.1.0`; TS 7 bi ubio type-aware linting |
| `eslint` | 9.39.5 | `eslint-plugin-import` i `jsx-a11y` staju na 9 |

Ako proveriš i vidiš da je ograničenje **nestalo** (npr. `typescript-eslint` je objavio podršku
za TS 7) — **to je vredan nalaz**, prijavi ga kao priliku za update i predloži izmenu
`docs/16` §1.5.

## Izlaz

Tabela po kategoriji. Za svaki major update: link na changelog i procena rizika.
Ne menjaj `pnpm-lock.yaml` — hook to blokira, i s razlogom.
