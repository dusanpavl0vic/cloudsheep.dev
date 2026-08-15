---
description: Pravi hook na pravom nivou (feature/app/paket), sa testom i unosom u katalog docs/13
argument-hint: [scope] [useName]
arguments: scope useName
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pnpm lint:*), Bash(pnpm test:*)
---

Napravi hook `$useName` u scope-u `$scope`.

## Prvo pročitaj

- `docs/13-hooks.md` — hook-first pravilo i katalog
- `docs/07-performance.md` §2–4 — `useMemo`/`useEffect`/`useState` ograničenja

## Odredi nivo — pitanje je "zna li hook za domen?"

| Odgovor | Lokacija |
|---|---|
| zna za domen | `apps/<x>/src/features/<f>/hooks/` |
| ne zna za domen, ali zna za ovu app | `apps/<x>/src/hooks/` |
| ne zna ni za šta | `packages/hooks/` |
| UI, ne-domenski | `packages/ui` |

Ako `$scope` protivreči ovom testu, reci to i predloži pravi nivo.

## Pravila

- Vraća **objekat sa stabilnim ključevima** (`{ data, isLoading, error, ...actions }`),
  ne niz — osim ako imitira `useState` sa tačno dva člana
- **Nikad ne vraća JSX**
- Radi **jednu** stvar; ako radi više — podeli na dva hooka
- Ako ne koristi nijedan React hook, to nije hook nego obična funkcija u `lib/`
- Svaki `useEffect` mora imati `// effect:` komentar i biti sa whitelist-e
- Svaki `useMemo` mora imati `// memo:` komentar i jedan od 3 dozvoljena razloga

## Koraci

1. Napravi hook fajl
2. Napravi kolokovan test (`renderHook`) — feature hookovi traže ≥ 90% pokrivenosti
3. **Upiši red u katalog u `docs/13-hooks.md`** ako je hook deljiv

## Acceptance

- `pnpm lint && pnpm test` prolazi
- Hook je u katalogu `docs/13-hooks.md`
- Nijedna komponenta ne mora da zna za Redux zbog njega
