# ADR 0004 — Feature folders umesto kanonskog FSD-a

> Status: **accepted**
> Datum: 2026-08-15

## Context

Trebalo je izabrati način sečenja aplikacije. Feature-Sliced Design (FSD) je najrazrađenija
metodologija u React ekosistemu: slojevi `app / pages / widgets / features / entities / shared`,
segmenti `ui / model / api / lib`, sopstveni linter (`steiger`, `@feature-sliced/eslint-config`).

Kontekst tima: **1–4 čoveka**, dve aplikacije, 5 postojećih feature-a.

## Decision

**Feature folders** — aplikacija se seče po domenu, sa eksplicitnim imenima segmenata
(`api/ components/ hooks/ store/ schemas/ locales/ types.ts`) umesto FSD segmenata.

Granice se enforce-uju `eslint-plugin-import` → `no-restricted-paths`, ne FSD linterom.

## Consequences

### Pozitivne
- **Nema terminologije koju treba učiti** — svaki folder je ime koje React developer već zna
- Manje ceremonijala po feature-u
- Standardni ESLint plugin umesto dodatnog lint ekosistema
- Ovo je ono što se realno vidi u većini profesionalnih React kodnih baza

### Negativne
- **Nema `entities` sloja**, pa deljeni domenski modeli nemaju očigledno mesto — završavaju u
  `lib/` ili `types/`, što je slabije definisano
- **Slabija formalna provera** — `no-restricted-paths` hvata cross-feature importe, ali ne
  proverava redosled slojeva onako striktno kao `steiger`
- Skalira lošije: preko ~20 feature-a granice počinju da se mute
- Nema gotove zajednice/alata kao FSD

### Neutralne
- Migracija na FSD kasnije je izvodljiva **upravo zato što su granice već enforce-ovane** —
  radi se mehanički, feature po feature

## Alternatives considered

| Opcija | Za | Protiv | Zašto odbačena |
|---|---|---|---|
| **Kanonski FSD** | rigorozno, alat za proveru, skalira na velike timove | `entities` sloj je najčešći izvor rasprava („da li je ovo entity ili feature?"); `widgets` je terminologija koju treba učiti | za tim od 1–4 čoveka ceremonijal košta više nego što donosi |
| **Sečenje po tipu** (`components/`, `hooks/`, `api/` na vrhu) | poznato iz tutorijala | ne skalira; izmena jedne funkcionalnosti dira 6 foldera | odbačeno odmah |
| **Hibrid sa `widgets/`** (v1 ovog SPEC-a) | kompromis | uvodi FSD terminologiju bez FSD provere — najgore od oba | odbačeno u v2 SPEC-a |

## Revisit when

Konkretan okidač, ne osećaj:

- **preko ~20 feature-a** u jednoj app-i, **ili**
- **5+ developera** koji rade paralelno, **ili**
- `/audit-boundaries` počne redovno da nalazi cross-feature importe koje ljudi zaobilaze

Tada: migracija na kanonski FSD sa `entities` slojem i `steiger` linterom.

## Reference

- [`docs/01-architecture.md`](../01-architecture.md)
- [`docs/02-folder-structure.md`](../02-folder-structure.md)
- [ADR 0000](0000-initial-spec.md) §4, §27.5
