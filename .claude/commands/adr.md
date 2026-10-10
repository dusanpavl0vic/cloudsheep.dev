---
description: Pravi novi ADR iz šablona i upisuje ga u indeks u docs/README.md
argument-hint: [naslov odluke]
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(ls:*)
---

Napravi ADR za: **$ARGUMENTS**

## Postupak

1. Pročitaj `docs/adr/template.md` — struktura je obavezna
2. Pogledaj `docs/adr/` i uzmi **sledeći slobodan broj** (četiri cifre)
3. Ime fajla: `docs/adr/NNNN-<kebab-case-naslov>.md`
4. Popuni sve sekcije šablona
5. **Dodaj red u tabelu ADR-ova u `docs/README.md`**

## Šta čini ADR upotrebljivim

- **Context** opisuje situaciju i ograničenja, **bez rešenja**. Ako postoji merenje
  ili incident koji je izazvao odluku — navedi brojke
- **Decision** je u aktivu i prezentu: „Koristimo X", ne „Trebalo bi razmotriti X"
- **Consequences mora imati i negativne.** Odluka bez zapisane cene znači da analiza nije
  završena — to je najčešći način da ADR postane beskoristan
- **Alternatives** navodi i opciju „ne raditi ništa" kad je bila realna
- **Revisit when** je konkretan okidač („kad `<paket>` objavi podršku za X", „preko 20 feature-a"),
  nikad „kad bude vremena"

## Status

Novi ADR je `accepted` ako je odluka doneta, `proposed` ako čeka.
**Ne piši `accepted` za odluku koja stvarno nije doneta** — bolje `proposed` sa zapisanim
kriterijumom po kom će se odlučiti.

## Kada ADR uopšte treba

Kad se odluka **ne može izvesti iz koda**. „Koristimo next-yak" se vidi iz `package.json`;
„zašto next-yak a ne styled-components, i pod kojim uslovima bismo se predomislili" se ne vidi nigde.
