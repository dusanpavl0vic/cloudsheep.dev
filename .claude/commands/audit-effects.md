---
description: Klasifikuje svaki useEffect u repou po whitelist-i iz docs/07 i predlaže zamenu za one koji ne prolaze
argument-hint: [opciono: putanja]
allowed-tools: Read, Grep, Glob, Bash(git diff:*)
---

Nađi i klasifikuj **svaki** `useEffect` u opsegu (`$ARGUMENTS` ako je dat, inače ceo repo).

## Prvo pročitaj

`docs/07-performance.md` §3 — whitelist i tabela zamena.

## Whitelist (jedini dozvoljeni razlozi)

- pretplata na browser/DOM/3rd-party event (prvo probaj `useSyncExternalStore`)
- imperativni DOM rad — focus, scroll restore, canvas, mape
- setup/teardown ne-React biblioteke
- analytics page-view
- WebSocket lifecycle

## Izlaz

| Fajl:linija | Šta radi | Sa whitelist-e? | `// effect:` komentar? | Zamena |
|---|---|---|---|---|
| `X.tsx:34` | `mousemove` listener | ✅ | ✅ | — |
| `Y.tsx:12` | `setFiltered(items.filter(...))` | ❌ derivirani state | ❌ | izračunaj tokom rendera |

Grupiši po ishodu: **opravdani** · **fale komentar** · **treba zameniti**.

Za svaki iz treće grupe napiši konkretnu zamenu — kod, ne opis.

## Pravilo

Ne diraj kod. Ovo je izveštaj.

Ako `useEffect` deluje opravdano ali komentar nedostaje, to je 🟡 — pravilo postoji
da bi zahtev bio mašinski proverljiv, ne da bi kaznilo ispravan kod.
