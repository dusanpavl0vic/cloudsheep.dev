# ADR 0006 — Modal engine: sopstveni Redux vs `@ebay/nice-modal-react`

> Status: **proposed** — odluka se donosi u F4, pre implementacije `packages/core`
> Datum: 2026-08-15

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

## Consequences

Popuniće se kad odluka bude doneta.

## Revisit when

Odluka se donosi u F4. Posle toga: revidirati ako se pojavi treći kandidat ili ako se
pokaže da stack modala nikad nije korišćen (tada je jednostavniji model dovoljan).

## Reference

- [`docs/06-modals.md`](../06-modals.md)
- [ADR 0000](0000-initial-spec.md) §8
