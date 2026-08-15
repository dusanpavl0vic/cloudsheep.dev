---
description: Izvlači logiku iz komponente u feature hook, sa testom
argument-hint: [putanja do komponente]
arguments: target
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pnpm test:*), Bash(pnpm lint:*), Bash(pnpm typecheck:*)
---

Izvuci logiku iz `$target` u feature hook.

## Prvo pročitaj

`docs/13-hooks.md` i `docs/04-state-management.md`.

## Šta se izvlači

Sve što nije renderovanje:

- `useAppSelector` / `useAppDispatch` pozivi
- RTKQ hookovi
- izvedene vrednosti i transformacije podataka
- event handleri koji sadrže logiku (ne one koji samo pozivaju prop)
- `useState` koji prelazi granicu komponente

## Šta ostaje u komponenti

JSX, lokalni prezentacioni state (otvoren dropdown), handleri koji samo prosleđuju poziv.

## Postupak

1. Pročitaj komponentu u celosti i **izlistaj šta radi** pre nego što išta pomeriš
2. Odredi nivo hooka po testu iz `docs/13`: zna li za domen?
3. Napravi hook — vraća objekat sa stabilnim ključevima, nikad JSX
4. Zameni telo komponente pozivom hooka
5. Napiši test za hook (`renderHook`)
6. `pnpm test && pnpm lint && pnpm typecheck`

## Pravila

- **Ponašanje se ne menja.** Ako postojeći test pada, refaktor je pogrešan — ne menjaj test
  da bi prošao
- Ako hook ispadne da radi više stvari, podeli ga odmah — jedan hook, jedna odgovornost
- Ako je komponenta posle refaktora i dalje preko 150 linija, problem nije bio u logici
  nego u obimu — reci to

## Acceptance

- Komponenta ne uvozi `useAppSelector`, `useAppDispatch` ni RTKQ hook
- Hook ima test, ≥ 90% za feature hookove
- Svi postojeći testovi i dalje prolaze, **bez ijedne izmene u njima**
