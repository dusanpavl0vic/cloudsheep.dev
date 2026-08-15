---
description: Pravi changeset iz git diff-a, sa tačnim bump nivoom po paketu
disable-model-invocation: true
allowed-tools: Read, Write, Glob, Grep, Bash(git diff:*), Bash(git status:*), Bash(git log:*), Bash(ls:*)
---

Napravi changeset za trenutne izmene.

## Postupak

1. `git diff dev...HEAD --stat` — koji paketi su dirani
2. Pročitaj suštinske izmene (ne samo statistiku)
3. Odredi bump nivo **po paketu**
4. Napiši `.changeset/<opisno-ime>.md`

## Bump nivo

| Nivo | Kada |
|---|---|
| `patch` | bug fix, interni refaktor, dokumentacija — javni API nepromenjen |
| `minor` | nova funkcionalnost, novi export, novi opcioni prop |
| `major` | breaking: uklonjen ili preimenovan export, promenjen obavezan prop, promenjeno ponašanje na koje se neko oslanja |

**Kad si između dva nivoa, uzmi viši.** Cena preterivanja je nepotreban bump verzije;
cena potcenjivanja je tuđi pokvaren build.

Aplikacije (`apps/*`) su `private` i ne verzionišu se — changeset se piše za `packages/*`.

## Format opisa

Piši za nekoga ko **koristi** paket, ne za sebe:

```md
---
'@app/ui': minor
---

`FormField` prima `description` prop za tekst ispod polja. Vezuje se preko
`aria-describedby` zajedno sa porukom greške.
```

Loše: „ažuriran FormField". Ne kaže šta se promenilo ni šta korisnik dobija.

## Acceptance

- Svaki diran paket ima unos
- `major` bump ima opisan migracioni korak
- Opis kaže **šta se promenilo za potrošača**, ne šta si radio
