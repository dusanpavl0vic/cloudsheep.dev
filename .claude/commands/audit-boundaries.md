---
description: Proverava granice slojeva i cross-feature importe iz docs/01, uključujući one koje lint propušta
argument-hint: [opciono: app]
allowed-tools: Read, Grep, Glob, Bash(pnpm lint:*)
---

Proveri poštovanje granica zavisnosti (`$ARGUMENTS` ako je dat, inače sve app-e i pakete).

## Prvo pročitaj

`docs/01-architecture.md` §2–4 i `docs/02-folder-structure.md`.

## Hijerarhija — import sme samo naniže

```
providers / routes / store   →  sve
pages                        →  features, components, hooks, lib, packages
features                     →  components, hooks, lib, packages
                                ❌ feature NE SME importovati drugi feature
components / hooks / lib     →  packages
packages/ui                  →  packages/utils, packages/hooks   ❌ ne core/store
packages/core                →  packages/utils
packages/utils               →  ništa
```

## Postupak

1. Pokreni `pnpm lint` — `import/no-restricted-paths` hvata većinu
2. **Zatim traži ono što lint propušta:**
   - import iz feature barrel-a koji vuče slice/selektor kroz re-export
   - `packages/ui` komponenta koja uvozi i18n ključ ili čita store
   - dinamički `import()` koji zaobilazi statičku proveru
   - tip importovan iz dubine drugog feature-a (`import type` prolazi neke provere)
   - paket u `packages/` koji ima **samo jednog** potrošača (prerano izdignut)

## Izlaz

| Fajl | Uvozi | Prekršaj | Ozbiljnost | Fix |
|---|---|---|---|---|
| `features/a/hooks/x.ts` | `@/features/b/store/b.slice` | feature → feature, kroz dubinu | 🔴 | preko store-a ili izdigni |

Na kraju: da li `pnpm lint` hvata svaki nalaz. Ako ne — **to je rupa u lint konfiguraciji**
i vredi je prijaviti, jer pravilo koje se ne proverava mašinski biće prekršeno.

Ne menjaj kod.
