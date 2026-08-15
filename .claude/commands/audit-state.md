---
description: Nalazi komponente sa 3+ useState i predlaže zamenu po eskalacionoj listi iz docs/07
argument-hint: [opciono: putanja]
allowed-tools: Read, Grep, Glob
---

Nađi komponente sa **3 ili više** `useState` poziva (`$ARGUMENTS` ako je dat, inače ceo repo).

## Prvo pročitaj

`docs/07-performance.md` §4 — eskalaciona lista.

## Za svaku takvu komponentu prođi listu redom

1. **derivirano** → obriši, izračunaj tokom rendera
2. **povezana polja** → `useReducer`
3. **forma** → react-hook-form
4. **prelazi granicu komponente** → Redux preko feature hooka
5. **pripada URL-u** → `useSearchParams`

Ako ništa od toga ne pomaže — komponenta radi previše stvari, predloži podelu.

## Izlaz

| Fajl | Broj `useState` | Šta drže | Predlog |
|---|---|---|---|
| `X.tsx` | 5 | `email`, `password`, `errors`, `isSubmitting`, `touched` | cela forma → RHF, pada na 0 |

## Važna napomena koju moraš zadržati

Limit od 2 je **heuristika, ne zakon** — i nije industrijski standard. Kao pritisak ka boljem
dizajnu je koristan; kao dogma vodi u veštačke `useReducer`-e nad tri booleana.

Ako je zamena gora od originala, **reci to** umesto da forsiraš pravilo. Bolje je ostaviti
3 `useState`-a uz obrazloženje nego napraviti `useReducer` koji niko ne razume.

Ne menjaj kod — ovo je izveštaj.
