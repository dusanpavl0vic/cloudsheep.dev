---
description: Proverava granice slojeva i cross-feature importe iz docs/01, uključujući one koje lint propušta
argument-hint: [opciono: putanja]
allowed-tools: Read, Grep, Glob, Bash(pnpm lint:*)
---

Proveri poštovanje granica zavisnosti (`$ARGUMENTS` ako je dat, inače ceo `src/`).

## Prvo pročitaj

`docs/01-architecture.md` §2–4 i `docs/02-folder-structure.md`.

## Hijerarhija — import sme samo naniže

```
app/ (rute)                 →  components, hooks, server (samo serverske komponente), constants
components/<domen>          →  components/<design system>, hooks, helpers, constants, types
components/<design system>  →  helpers, constants, styles   ❌ ne domen, ne store, ne useStore
modals                      →  components, hooks
hooks                       →  store, helpers, schemas, constants   ❌ ne components, ne modals
store                       →  helpers, constants, types           ❌ ne hooks, ne components
helpers / schemas           →  constants, types                    ❌ ne store, hooks, components, server
constants                   →  tipovi i druge konstante
server                      →  helpers, schemas, constants, types  ❌ ne React, ne store
client kod                  ❌ nikad `@/server/**`; admin RTKQ nikad na javnim stranicama
```

## Postupak

1. Pokreni `pnpm lint` — `import/no-restricted-paths` hvata većinu
2. **Zatim traži ono što lint propušta:**
   - komponenta design sistema koja dobija domenski tip kroz `import type`
   - javna stranica čiji klijentski kod uvozi `store/api/admin/*` (proveri `pnpm size`)
   - `'use client'` fajl koji uvozi nešto što vuče `@/server/**` ili `@prisma/client`
   - dinamički `import()` koji zaobilazi statičku proveru
   - `.styles.ts` koji izvozi vrednosti (lint) ili čita tokene u runtime-u

## Izlaz

| Fajl | Uvozi | Prekršaj | Ozbiljnost | Fix |
|---|---|---|---|---|
| `components/buttons/X.tsx` | `@/store/slices/ui` | design system → store | 🔴 | podatak kroz props iz domenskog hooka |

Na kraju: da li `pnpm lint` hvata svaki nalaz. Ako ne — **to je rupa u lint konfiguraciji**
i vredi je prijaviti, jer pravilo koje se ne proverava mašinski biće prekršeno.

Ne menjaj kod.
