---
description: Nalazi useMemo/useCallback van tri dozvoljena slučaja iz docs/07 i predlaže uklanjanje
argument-hint: [opciono: putanja]
allowed-tools: Read, Grep, Glob
---

Nađi **svaki** `useMemo` i `useCallback` u opsegu (`$ARGUMENTS`, inače ceo repo).

## Prvo pročitaj

`docs/07-performance.md` §2 i `docs/adr/0001-react-compiler.md`.

## Kontekst koji određuje ceo sud

**React Compiler je uključen.** Ručna memoizacija je uglavnom redundantna i ponekad se sudara
sa compiler analizom. `useMemo` nije besplatan — alocira dependency array i poredi ga svaki
render; za jeftin izraz košta više nego sam izračun.

## Tri dozvoljena slučaja

1. **Skupa kalkulacija** — O(n) ili gore nad kolekcijom, parsiranje/formatiranje u petlji
2. **Referencijalna stabilnost** za dependency array drugog hooka ili context value
3. **Selector factory** — `useMemo(() => makeSelectItemById(id), [id])`

Svaki mora imati komentar `// memo: <razlog>`.

## Izlaz

| Fajl:linija | Šta memoizuje | Slučaj | Komentar? | Predlog |
|---|---|---|---|---|
| `A.tsx:30` | `HERO_KEYS.map(t)` | ❌ jeftin izraz | ❌ | ukloni — compiler pokriva |
| `B.ts:12` | selector factory | ✅ (3) | ❌ | dodaj `// memo:` komentar |

Grupiši: **opravdani** · **fale komentar** · **ukloniti**.

## Pravilo

Ne diraj kod. Ako nisi siguran da li je kalkulacija skupa, reci šta bi to potvrdilo
(veličina kolekcije, učestalost rendera) umesto da nagađaš.
