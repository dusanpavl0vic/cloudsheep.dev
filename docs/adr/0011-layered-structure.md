# ADR 0011 — Struktura po slojevima (`REACT_FRONTEND_STRUCTURE.md`)

> Status: accepted
> Datum: 2026-10-08
> Učesnici: Dušan Pavlović

## Context

Do sada je kod bio sečen po feature-u (`features/<ime>/{components,hooks,api,store}`, ADR
0004) i delio se kroz `packages/*` (ADR 0005, 0007). Korisnik je za prepisivanje zadao šablon
`REACT_FRONTEND_STRUCTURE.md`, koji seče po sloju: `components/<kategorija>/`,
`hooks/<domen>/`, `store/api/<domen>/`, `constants/`, sa domenom kao podfolderom.

Sa jednom aplikacijom (ADR 0009) `packages/` više nema smisla.

## Decision

Koristimo **strukturu iz šablona**: sve konstante u `src/constants`, komponenta po folderu sa
`.tsx`/`.styles.ts`/`.types.ts`/`index.ts` i `default export`-om, design system po
kategorijama, domenske komponente u `components/<domen>/`, logika u `hooks/<domen>/`,
API u `store/api/<domen>/`, arrow funkcije svuda. Odstupanja zbog Next.js-a su popisana u
`docs/01-architecture.md` §3.

## Consequences

### Pozitivne
- Jedan predvidiv odgovor na „gde ovo ide" (`docs/01-architecture.md` §5).
- Design system je odvojen od domena po folderu, pa se pravilo zavisnosti proverava lintom.

### Negativne
- Jedan domen je raspoređen kroz više foldera (`components/notes`, `hooks/notes`,
  `store/api/notes`, `server/services/notes`) — izmena domena dodiruje više mesta.
- `default export` za komponente odstupa od ranijeg pravila „samo named" — ESLint pravilo je
  okrenuto po putanji.

### Neutralne / posledice po proces
- `docs/02`, `03`, `13`, `14`, `18` prepisani; slash komande za skafolding ažurirane.

## Alternatives considered

| Opcija | Za | Protiv | Zašto odbačena |
|---|---|---|---|
| Zadržati feature folders | domen na jednom mestu | protivreči zadatom šablonu | šablon je zahtev |
| FSD | stroga pravila slojeva | težak za jednu malu aplikaciju | isto kao u ADR 0004 |

## Revisit when

Preko ~15 domena, ili ako izmena jednog domena redovno dodiruje više od 5 foldera.

## Reference

- `docs/01-architecture.md`, `docs/02-folder-structure.md`
- ADR 0004, 0005, 0007 (zamenjeni ovim)
