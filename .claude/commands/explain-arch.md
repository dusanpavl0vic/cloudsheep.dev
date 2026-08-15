---
description: Kaže gde nova funkcionalnost treba da živi, sa obrazloženjem iz docs/01 i docs/02
argument-hint: [opis funkcionalnosti]
allowed-tools: Read, Grep, Glob
---

Odgovori gde treba da živi: **$ARGUMENTS**

## Prvo pročitaj

`docs/01-architecture.md`, `docs/02-folder-structure.md`, `docs/13-hooks.md`.

Pogledaj i **postojeći kod** — ako već postoji sličan obrazac, prati njega umesto da
izmišljaš novi.

## Odgovori redom na ova pitanja

1. **Da li je ovo feature?** Ima li sopstveni domen i URL? Može li se obrisati `rm -rf`
   bez lomljenja ostatka? Ako ne — to je komponenta ili hook u postojećem feature-u.
2. **Koliko potrošača ima?** Jedan feature → ostaje u njemu. Dva feature-a iste app-e →
   `apps/<x>/src/components|hooks|lib`. Dve app-e → `packages/`.
   **Kod ide u `packages/` tek kad ga koristi druga app** — prerano izdizanje je najčešća
   greška u monorepoima.
3. **Koja je vrsta stanja?** Server → RTKQ. Globalni client → slice. Lokalni → `useState`.
   URL → `useSearchParams`.
4. **Zna li za domen?** Određuje nivo hooka i sme li u `packages/ui`.
5. **Koja postojeća pravila se primenjuju?** Navedi konkretne sekcije iz `docs/`.

## Izlaz

1. **Preporuka** — tačna putanja fajlova koje treba napraviti
2. **Obrazloženje** — po jedna rečenica po odluci, sa referencom na doc sekciju
3. **Koju komandu pokrenuti** — `/new-feature`, `/new-component`, `/new-hook`…
4. **Zamke** — šta se u ovom konkretnom slučaju najčešće pogreši

## Pravilo

Ako je odgovor stvarno dvosmislen, reci obe opcije sa uslovom koji ih razdvaja —
ne izmišljaj sigurnost koje nema. Ako odluka nije pokrivena dokumentacijom,
predloži `/adr` umesto improvizacije.

**Ne piši kod.** Ovo je savet o strukturi.
