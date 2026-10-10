# ADR 0002 — React Router umesto TanStack Router-a

> Status: superseded by [ADR-0009](0009-nextjs-fullstack.md)
> Datum: 2026-08-15

## Context

Trebalo je izabrati router za sve app-e u monorepou. Dva ozbiljna kandidata: React Router
(v8 u trenutku odluke) i TanStack Router.

Postojeći `apps/web` već koristi React Router v7, sa jednom rutom.

Merenje iz baseline bundle-a: **`react-router` nosi 28% initial JS-a** — zbog jedne rute.
To je najveća pojedinačna stavka posle `react-dom`.

## Decision

**React Router**, `createBrowserRouter` sa objektnim rutama, sve rute lazy.

## Consequences

### Pozitivne
- Najveći ekosistem; svaki React developer ga zna
- Nema migracije postojećeg koda
- Data mode (`loader`, `errorElement`, `handle`) pokriva potrebe bez dodatnih biblioteka
- Ogromna količina odgovora na probleme koji će se sigurno pojaviti

### Negativne
- **Type-safety je slabija od TanStack Router-a.** Putanje i parametri nisu tipizirani —
  ublažava se `ROUTES` konstantama, ali to je konvencija, ne provera kompajlera
- **28% bundle-a za jednu rutu** je loš odnos; kad se traži ušteda, ovo je prvo mesto
- Search params API je slabiji — `useSearchParams` vraća stringove, parsiranje je ručno

### Neutralne
- Skok v7 → v8 je major; površina je mala (jedan `router.tsx`), ali nije nula

## Alternatives considered

| Opcija | Za | Protiv | Zašto odbačena |
|---|---|---|---|
| **TanStack Router** | najbolji type-safety u ekosistemu, tipizirani search params, manji bundle | manji ekosistem, manje odgovora na StackOverflow-u, migracija postojećeg koda | dobitak u type-safety-ju ne pokriva rizik za tim od 1–4 čoveka |
| Wouter | ~1.5 KB, minimalan | nema data mode, loader, error boundary po ruti | premalo za admin panel |
| Ostati na v7 | nula migracije | zaostajanje počinje odmah | v8 je aktivna linija |

## Revisit when

- Bundle budžet od 150 KB padne i `react-router` ostane najveći pojedinačni krivac
- Broj ruta pređe ~30, gde netipizirani parametri počinju stvarno da bole
- TanStack Router uđe u sličan nivo usvojenosti

## Reference

- [`docs/05-routing.md`](../05-routing.md)
- [`docs/07-performance.md`](../07-performance.md) §8 — sastav bundle-a
