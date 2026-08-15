---
description: Nalazi mesta gde se kod i docs/ razilaze — zastarela pravila, nedokumentovane obrasce, mrtve reference
argument-hint: [opciono: doc fajl]
allowed-tools: Read, Grep, Glob, Bash(git log:*), Bash(git diff:*)
---

Nađi divergenciju koda i dokumentacije (`$ARGUMENTS` ako je dat, inače sve).

## Zašto ovo postoji

**Najveći rizik ovog repoa nije stek nego drift.** Dokumentacija koja se razišla sa kodom je
gora od nikakve — uči ljude pogrešnim pravilima i troši im vreme.

## Četiri vrste divergencije

### 1. Doc opisuje pravilo koje kod ne poštuje
Pravilo je zapisano, kod ga krši na više mesta. **Pitanje nije uvek „popravi kod"** — ako
pravilo krši 40 fajlova, možda je pravilo pogrešno. Prijavi obim, pa predloži smer.

### 2. Kod ima obrazac koji doc ne pominje
Nova konvencija se uvukla bez zapisa. Predloži gde je dokumentovati.

### 3. Doc referiše nešto što ne postoji
Fajl, funkcija, komanda, paket ili token koji je preimenovan ili obrisan.
**Ovo je uvek greška u docu** — proveri svaki `docs/` link i svako pominjanje putanje.

### 4. Zastareo `Last review`
Doc stariji od 6 meseci ili doc čija je oblast menjana posle poslednjeg review-a
(`git log` nad odgovarajućim `src/` folderom).

## Poseban slučaj

`PROJECT_GUIDE.md` je označen kao zastareo i briše se u F5, kad se kod migrira i 10 komentara
u `src/` prestane da ga referiše. Do tada **nije** nalaz — proveri samo da li je broj tih
komentara i dalje 10 ili je pao.

## Izlaz

| Doc | Sekcija | Vrsta | Kod kaže | Doc kaže | Predlog |
|---|---|---|---|---|---|

Na kraju: koji doc je najzastareliji i koje pravilo se najviše krši (to je kandidat za
lint rule ili za brisanje).

Ne menjaj ni kod ni docs bez potvrde.
