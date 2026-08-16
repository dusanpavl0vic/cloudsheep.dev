# ADR 0006 — Modal engine: sopstveni Redux vs `@ebay/nice-modal-react`

> Status: **accepted** — sopstveni Redux engine
> Datum: 2026-08-16 (predlog 2026-08-15, odlučeno u F4)

## Context

Zahtev: **svi dijalozi se otvaraju preko Redux-a, ne preko lokalnog `isOpen` state-a**,
i rezultat modala se dobija kroz `await`, bez `useEffect`-a koji sluša promenu.

Postoji gotovo rešenje koje rešava tačno ovaj problem — `@ebay/nice-modal-react` (v1.2.13):
promise-based modali, registry, bez lokalnog state-a, široko korišćeno u praksi.

Sopstveni engine je opisan u [`docs/06-modals.md`](../06-modals.md) i iznosi ~150 linija
u `packages/core/src/modals/`.

**Ova odluka je namerno odložena** dok se ne napiše `packages/core` — tada se vidi koliko
sopstveni engine stvarno košta i da li `nice-modal-react` pokriva stack i type-safe
`ModalPropsMap`.

## Odluka koja se razmatra

Dve opcije, obe zadovoljavaju „nema `useState(false)` za domenski dijalog":

### A. Sopstveni Redux engine

- **Za:** potpuna kontrola nad devtools/time-travel; stack modala je prvorazredan koncept;
  `ModalPropsMap` daje type-safety koji sami definišemo; Redux je ionako eksplicitan zahtev,
  pa nema drugog mehanizma za state
- **Protiv:** ~150 linija koda koji moramo da održavamo i testiramo; `resolvers.ts` Map van
  Redux-a je suptilan (curi memorija ako se `settleResolver` propusti); mi pišemo bugove koje
  je biblioteka već ispravila

### B. `@ebay/nice-modal-react`

- **Za:** gotovo, testirano, promise-based API je isti; manje koda kod nas
- **Protiv:** state je van Redux-a → **gubi se time-travel debugging**, što je bio deo
  obrazloženja za Redux-driven modale; type-safety je slabija od `ModalPropsMap`;
  dodatna zavisnost; stack podrška treba proveriti

## Kriterijum za odluku (F4)

Odlučuje se po ovim tačkama, redom:

1. **Da li `nice-modal-react` podržava stack** (confirm preko otvorene forme)? Ako ne — opcija A.
2. **Da li se može tipizirati** tako da registracija modala bez tipa propsa bude greška u
   kompilaciji? Ako ne — opcija A.
3. **Da li je gubitak time-travel debugging-a prihvatljiv?** Ako jeste — opcija B, jer je
   manje našeg koda.
4. Ako su 1 i 2 zadovoljeni a 3 nije — opcija A, jer je Redux zahtev eksplicitan.

## Decision

**Opcija A — sopstveni Redux engine** u `packages/core/src/modals/`.

### Dokazi na kojima je odluka doneta (provereno 2026-08-16)

| Kriterijum | Nalaz za `@ebay/nice-modal-react@1.2.13` | Ishod |
|---|---|---|
| 1. Podržava stack? | README ne pominje stack nijednom | ✗ |
| 2. Type-safe registracija? | Nema pominjanja TypeScript-a ni `declare module` obrasca | ✗ |
| 3. Gubitak time-travel-a prihvatljiv? | nije se ni razmatralo — 1 i 2 već padaju | — |

Presudan dodatni nalaz: **poslednja objava je 2023-10-03**, skoro tri godine pre ove odluke.
`peerDependencies` je `react: ">16.8.0"`, napisan u doba React-a 18 — formalno propušta React 19,
ali paket nije ažuriran ni za jednu njegovu promenu. Uvođenje neodržavane zavisnosti u srž
sistema koji svaka app koristi je gori rizik od 150 linija sopstvenog koda.

Po pravilu iz kriterijuma: 1 pada → opcija A.

## Consequences

### Pozitivne
- Stack modala je prvorazredan koncept, ne zaobilaznica
- `ModalPropsMap` čini registraciju modala bez tipa propsa **greškom u kompilaciji**
- Redux devtools i time-travel rade za modale kao i za sve ostalo
- Nema neodržavane zavisnosti u srži

### Negativne
- **~150 linija koda koji mi održavamo i testiramo**
- `resolvers.ts` (Map van Redux-a) je suptilan deo — ako se `settleResolver` propusti,
  curi memorija. Zato `closeAll` prolazi kroz ceo stack, a ne samo prazni niz
- Pišemo bugove koje je biblioteka možda već ispravila

### Neutralne
- Radix `Dialog` i dalje nosi mehaniku (focus trap, ESC, scroll lock) — ne pišemo je sami

## Revisit when

- Pojavi se održavana biblioteka koja podržava i stack i type-safe registry
- Pokaže se da stack nikad nije iskorišćen kroz godinu dana upotrebe — tada je jednostavniji
  model dovoljan i engine se može prepoloviti

## Reference

- [`docs/06-modals.md`](../06-modals.md)
- [ADR 0000](0000-initial-spec.md) §8
