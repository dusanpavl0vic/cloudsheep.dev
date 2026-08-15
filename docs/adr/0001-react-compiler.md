# ADR 0001 — React Compiler uključen, ručna memoizacija isključena

> Status: **accepted**
> Datum: 2026-08-15

## Context

React 19 donosi React Compiler koji automatski memoizuje komponente i vrednosti na osnovu
statičke analize. Postoje dva koherentna režima rada:

1. Compiler ON — ručni `useMemo`/`useCallback` postaje uglavnom redundantan
2. Compiler OFF — tim dosledno memoizuje ručno

**Oba su legitimna. Mešavina nije** — ručna memoizacija ume da se sudari sa compiler analizom,
a i bez sudara plaća se dva puta za isti posao.

Postojeći kod ima 3 `useMemo`-a, od kojih bar jedan (`HERO_TERMINAL_KEYS.map(t)`) spada u
kategoriju „jeftin izraz" koju compiler pokriva bolje.

## Decision

**Compiler je uključen** u deljenom Vite presetu za sve app-e i `packages/ui`,
sa `babel-plugin-react-compiler` pinovanim **exact** (`1.0.0`, bez `^`).

Ručni `useMemo`/`useCallback` je dozvoljen **samo u tri slučaja**, svaki sa obaveznim
komentarom `// memo: <razlog>`:

1. skupa kalkulacija — O(n) ili gore nad kolekcijom
2. referencijalna stabilnost za dependency array drugog hooka ili context value
3. selector factory

`eslint-plugin-react-hooks` v7 nosi compiler pravila; kršenje je **error**.

## Consequences

### Pozitivne
- Manje boilerplate-a; komponente čitljivije
- Nema klase bugova iz pogrešnog dependency array-a
- Novi developer ne mora da uči kada memoizovati

### Negativne
- **Exact pin znači ručne update-ove** — compiler je nov, patch verzije menjaju ponašanje
- Compiler može da promeni ponašanje postojećih animacija koje se oslanjaju na identitet
  reference (`useTypewriter`, `Reveal`, hero mousemove) — proverava se pri migraciji
- Build je sporiji zbog Babel prolaza
- Debug je teži: kod koji se izvršava nije kod koji si napisao
- `/audit-memo` je potreban da pravilo ne bi ostalo na papiru

### Neutralne
- Vite 8 je rolldown, pa Babel ulazi kroz `@rolldown/plugin-babel` — tri nova peer paketa

## Alternatives considered

| Opcija | Za | Protiv | Zašto odbačena |
|---|---|---|---|
| Compiler OFF + ručna memoizacija | pun uvid, bez Babel prolaza | disciplina koja otkazuje pod rokom; više koda | tim od 1–4 čoveka ne može dosledno |
| Compiler ON + ručna memoizacija svuda | „za svaki slučaj" | plaća se dvaput, moguć sudar | **ovo je konkretno pogrešan instinkt** |
| Čekati stabilizaciju | manji rizik | React 19.2 je već stabilan, compiler je 1.0 | odlaganje bez koristi |

## Revisit when

- Compiler objavi breaking promenu u 2.x
- `/audit-memo` počne redovno da nalazi legitimne slučajeve van tri dozvoljena — znak da je
  lista prekratka
- Merenje pokaže da je Babel prolaz uzrok neprihvatljivo sporog builda

## Reference

- [`docs/07-performance.md`](../07-performance.md) §1–2
- [`docs/16-tooling-ci.md`](../16-tooling-ci.md) §1.1
