# ADR 0005 — Barrel fajlovi samo na granicama

> Status: superseded by [ADR-0011](0011-layered-structure.md)
> Datum: 2026-08-15

## Context

Barrel fajl (`index.ts` koji re-eksportuje) daje čiste import putanje:
`import { Button } from '@app/ui'` umesto `.../src/ui/button`.

Cena nije nula i dobro je dokumentovana u ekosistemu:

- **Tree-shaking** se pogoršava — bundler mora da dokaže da neiskorišćeni re-eksporti nemaju
  side-efekte; `sideEffects: false` pomaže, ali ne uvek
- **Vite dev server usporava** — barrel od 40 eksporta znači da dev server transformiše svih 40
  modula kad ti treba jedan
- **Ciklične zavisnosti** postaju lakše i teže za dijagnostiku

## Decision

Barrel je dozvoljen **samo na granici feature-a i paketa**:

| Mesto | Barrel? |
|---|---|
| `features/<x>/index.ts` | ✅ javni API feature-a |
| `packages/<x>/src/index.ts` | ✅ javni API paketa |
| `components/<Ime>/index.ts` | ✅ jedna komponenta, jedan eksport |
| `components/index.ts` sa 40 re-eksporta | ❌ **anti-pattern** |
| `hooks/index.ts` koji skuplja sve hookove | ❌ |
| `features/<x>/components/index.ts` | ❌ |

Uticaj se **meri**, ne pretpostavlja: `/bundle-check` prijavljuje doprinos barrel fajlova.

## Consequences

### Pozitivne
- Čist javni API tamo gde je granica stvarna
- Dev server ostaje brz — nema zbirnih barrel fajlova
- `import/no-internal-modules` može da enforce-uje da se paket uvozi samo kroz barrel

### Negativne
- **Duže import putanje unutar feature-a** — `./components/LoginForm/LoginForm` umesto
  `./components`
- Nedoslednost je moguća: dva mesta izgledaju slično, jedno sme barrel, drugo ne.
  Rešava se pravilom „da li je ovo granica?", ne osećajem
- Barrel na granici feature-a i dalje nosi svoju cenu — prihvatamo je jer je granica stvarna

### Neutralne
- `packages/ui/src/ui/` je flat i bez barrel-a po komponenti ([`0007`](0007-ui-flat-vs-folder.md))

## Alternatives considered

| Opcija | Za | Protiv | Zašto odbačena |
|---|---|---|---|
| **Barrel svuda** | najlepše import putanje | najgori tree-shaking i dev performanse | direktno protiv budžeta od 150 KB |
| **Bez barrel-a igde** | najbolji tree-shaking | javni API feature-a prestaje da postoji; granice se ne mogu enforce-ovati | granice su važnije |
| **Barrel + `sideEffects: false`** | kompromis | pomaže tree-shaking-u, **ne pomaže** dev serveru | delimično rešenje, ionako ga koristimo |

## Revisit when

- `/bundle-check` pokaže da barrel fajlovi na granicama nose merljiv trošak
- Vite dev server pređe ~2 s za HMR na feature-u
- Bundler objavi pouzdan tree-shaking kroz barrel-e

## Reference

- [`docs/01-architecture.md`](../01-architecture.md) §4
- [`docs/02-folder-structure.md`](../02-folder-structure.md)
