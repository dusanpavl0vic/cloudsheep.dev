---
description: Build + size-limit + Lighthouse CI + analiza chunkova, sa procenom dobitka u KB i ms po predlogu
argument-hint: [app]
arguments: app
allowed-tools: Read, Grep, Glob, Bash(pnpm build:*), Bash(pnpm size:*), Bash(pnpm lh:*), Bash(pnpm preview:*), Bash(ls:*), Bash(du:*)
---

Izmeri performanse javnih ruta (`/`, `/projects`, `/notes`, `/contact`).

## Prvo pročitaj

`docs/07-performance.md`, posebno §6–8, i ADR 0014 (budžet 200 KB, baseline brojke).

## Postupak

```bash
pnpm build --filter=$app
pnpm size --filter=$app
pnpm lh --filter=$app
```

**Meri se isključivo produkcijski build.** Ako neko traži merenje na dev serveru, odbij —
dev servira nemitifikovane ESM module sa react-refresh-om i Lighthouse tamo pokazuje
FCP od 13 s, što nema veze sa stvarnošću.

## Analiza

1. **Budžeti** — da li prolaze: initial JS ≤ 150 KB gzip, CSS ≤ 20 KB, po ruti ≤ 60 KB
2. **Sastav chunkova** — najveći dep, duplikati, šta je završilo u initial chunk-u a ne bi trebalo
3. **Lighthouse** — LCP, CLS, INP, TBT protiv ciljeva iz `docs/07` §7
4. **Poređenje sa baseline-om** iz ADR 0014 (`pnpm size` i `pnpm lh`)

## Izlaz — svaki predlog mora imati brojku

| Predlog | Procenjeni dobitak | Rizik | Gde |
|---|---|---|---|
| lazy `ContactForm` (RHF ulazi u initial) | −18 KB gzip | nizak | `pages/ContactPage.tsx` |

**Predlog bez procenjene uštede ne prijavljuj.** „Razmisli o code splitting-u" nije nalaz.
Ako ne možeš da proceniš dobitak, reci šta bi trebalo izmeriti da bi se procenio.

Na kraju: da li je build spreman za merge i koja je jedna izmena sa najvećim odnosom
dobitka i rizika.
