---
description: Audituje izmenjene fajlove protiv docs/19-code-review-checklist.md i prijavljuje nalaze kao tabelu; ne menja kod bez potvrde
argument-hint: [opciono: putanja ili broj PR-a]
allowed-tools: Read, Grep, Glob, Bash(git diff:*), Bash(git status:*), Bash(git log:*), Bash(pnpm lint:*), Bash(pnpm typecheck:*), Bash(pnpm size:*)
---

Auditiraj izmene protiv pravila projekta.

## Opseg

`$ARGUMENTS` ako je dat; inače `git diff` u odnosu na `dev`. Ako nema izmena, reci to i stani.

## Prvo pročitaj

**`docs/19-code-review-checklist.md`** — to je kompletna lista i jedini izvor nalaza.
Za svaki nalaz otvori i dokument na koji checklist upućuje, da citat pravila bude tačan.

## Postupak

1. `git diff dev...HEAD` — uzmi listu izmenjenih fajlova
2. Pročitaj **svaki** izmenjen fajl u celosti, ne samo diff — pravilo se često krši
   u kontekstu koji diff ne pokazuje (npr. treći `useState` je dodat, a prva dva su postojala)
3. Prođi checklist po sekcijama
4. Pokreni `pnpm lint` i `pnpm typecheck` i uključi njihove nalaze
5. Ako su dirani UI fajlovi, pokreni i `pnpm size`

## Izlaz

Tabela, sortirana po ozbiljnosti (🔴 blocker → 🟡 major → 🔵 minor):

| Fajl | Pravilo | Ozbiljnost | Fix |
|---|---|---|---|
| `path/to/file.tsx:42` | `useEffect` bez `// effect:` komentara (`docs/07` §3) | 🔴 | prebaci u event handler |

Posle tabele: jedan pasus sa zaključkom — šta je najozbiljnije i da li je PR spreman.

## Tvrda pravila ove komande

- **Ne menjaj kod.** Prijavi nalaze i sačekaj potvrdu. Ako korisnik traži popravke,
  tek onda ih primeni.
- **Ne prijavljuj ono što nije prekršaj.** Lažni nalaz košta više od propuštenog jer
  uči korisnika da ignoriše izlaz.
- **Ne prijavljuj stilske preference** kojih nema u `docs/`. Ako pravilo nije zapisano,
  nije pravilo — najviše 🔵 uz napomenu da nije dokumentovano.
- Ako je nalaz nesiguran, označi ga i reci šta bi ga potvrdilo.

## Samoprovera

Na namerno lošem kodu (komponenta sa 5 `useState`, `fetch` u `useEffect`-u, hardkodovan string)
moraš uhvatiti **sva tri** problema. Ako promašiš ijedan — komanda je pokvarena, ne kod.
