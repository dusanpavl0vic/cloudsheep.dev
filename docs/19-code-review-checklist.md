# 19 — Checklist za code review

> Status: active | Last review: 2026-08-15
> Ovo je lista koju koristi `/review`. Nalazi se prijavljuju kao tabela
> `fajl | pravilo | ozbiljnost | fix`.

## Ozbiljnost

| Nivo | Značenje | Posledica |
|---|---|---|
| 🔴 **blocker** | krši pravilo koje ima lint rule ili obara budžet | PR se ne merge-uje |
| 🟡 **major** | krši dokumentovano pravilo bez automatske provere | popraviti pre merge-a |
| 🔵 **minor** | stil, čitljivost, propuštena prilika | može u follow-up |

## Arhitektura ([`01`](01-architecture.md), [`02`](02-folder-structure.md))

- [ ] 🔴 Feature ne importuje drugi feature (osim kroz barrel)
- [ ] 🔴 `index.ts` feature-a ne eksportuje slice, selektore ni endpointe
- [ ] 🔴 `packages/ui` ne uvozi `core`/store/i18n ključeve
- [ ] 🟡 Kod nije izdignut u `packages/` bez drugog potrošača
- [ ] 🟡 Novi fajl je na najnižem nivou koji ga može držati
- [ ] 🟡 Nema `utils.ts`/`helpers.ts`/`misc.ts`
- [ ] 🔵 Feature se može obrisati `rm -rf` bez lomljenja ostatka

## Performanse ([`07`](07-performance.md)) — **najčešći izvor blocker-a**

- [ ] 🔴 Svaki `useEffect` ima `// effect:` komentar i sa whitelist-e je
- [ ] 🔴 Nema fetch-a u `useEffect`-u
- [ ] 🔴 Nema deriviranog state-a kroz `useEffect` + `setState`
- [ ] 🔴 Nijedna komponenta nema 3+ `useState`
- [ ] 🔴 Lista > 100 stavki je virtualizovana
- [ ] 🔴 `pnpm size` prolazi
- [ ] 🟡 Svaki `useMemo`/`useCallback` ima `// memo:` i jedan od 3 razloga
- [ ] 🟡 Nova ruta je lazy
- [ ] 🟡 `key` nije `index`
- [ ] 🟡 Novi dependency > 20 KB gzip ima ADR
- [ ] 🔵 Slike imaju `width`/`height` ili `aspect-ratio`

## State ([`04`](04-state-management.md)) i hookovi ([`13`](13-hooks.md))

- [ ] 🔴 Komponenta ne zove `useAppSelector`/`useAppDispatch`/RTKQ hook direktno
- [ ] 🔴 RTKQ podaci nisu prekopirani u slice
- [ ] 🟡 Izvodeći selektori koriste `createSelector`
- [ ] 🟡 Filteri/paginacija su u URL-u, ne u Redux-u
- [ ] 🟡 Kolekcije koriste `createEntityAdapter`
- [ ] 🟡 Hook vraća objekat, ne niz; ne vraća JSX
- [ ] 🔵 Akcije imenovane kao događaji, ne komande

## Podaci ([`11`](11-data-fetching.md)) i forme ([`10`](10-forms-validation.md))

- [ ] 🔴 Nema drugog `createApi` — samo `injectEndpoints`
- [ ] 🔴 Nula `useState` u formama
- [ ] 🟡 `providesTags`/`invalidatesTags` postavljeni
- [ ] 🟡 Mutacija koja menja vidljivo stanje ima optimistic update
- [ ] 🟡 Tip forme izveden sa `z.infer`
- [ ] 🟡 Server greška polja ide u `setError`, ne u toast
- [ ] 🔵 Odgovor validiran zod šemom gde ima smisla

## i18n ([`09`](09-i18n.md))

- [ ] 🔴 Nijedan literal string u UI-ju
- [ ] 🔴 Ključ postoji u `sr.json` **i** `en.json`
- [ ] 🟡 Ključ ima `feature.` prefiks
- [ ] 🟡 Plural koristi ICU sa `one`/`few`/`other` za srpski
- [ ] 🟡 Brojevi/datumi/valute idu kroz formattere
- [ ] 🔵 Namespace se učitava lazy uz feature

## Stil ([`08`](08-styling-ui.md))

- [ ] 🔴 Nijedna hex/RGB vrednost ni sirova Tailwind boja
- [ ] 🟡 Stil je u `.variants.ts`, `.tsx` ima samo layout klase
- [ ] 🟡 Varijante su CVA, ne uslovni `clsx`
- [ ] 🟡 Logička svojstva (`ps`/`pe`/`ms`/`me`)
- [ ] 🔵 Komponenta na tamnoj traci ima `tone: 'inverse'`

## Modali ([`06`](06-modals.md))

- [ ] 🔴 Nema `useState(false)` za dijalog sa domenskom akcijom
- [ ] 🟡 Modal je u registry-ju i u `ModalPropsMap`
- [ ] 🟡 Modal vraća rezultat, ne dispatch-uje domensku akciju
- [ ] 🔵 Destruktivna akcija ima `meta.dismissible: false`

## Pristupačnost ([`15`](15-accessibility.md))

- [ ] 🔴 `jsx-a11y` prolazi
- [ ] 🔴 Nula axe povreda
- [ ] 🟡 Interaktivni element ima pristupačno ime
- [ ] 🟡 Kontrast ≥ 4.5:1 u obe teme
- [ ] 🟡 Animacija poštuje `prefers-reduced-motion`
- [ ] 🔵 Prošao ručni tastaturni prolaz

## Testovi ([`12`](12-testing.md))

- [ ] 🔴 Coverage pragovi prolaze (utils 100%, hooks 90%, ukupno 80%)
- [ ] 🔴 Bug fix ima test koji je pao pre popravke
- [ ] 🟡 Novi feature hook ima test
- [ ] 🟡 Organism ima axe test
- [ ] 🟡 Nema `container.querySelector` ni `fireEvent`
- [ ] 🔵 Test data kroz factory

## Sigurnost ([`20`](20-security.md))

- [ ] 🔴 Nema JWT-a u `localStorage`
- [ ] 🔴 Nema `dangerouslySetInnerHTML` bez `DOMPurify`
- [ ] 🔴 Nema tajni u `VITE_` promenljivama
- [ ] 🟡 Eksterni linkovi imaju `rel="noopener noreferrer"`

## Imenovanje ([`03`](03-naming-conventions.md))

- [ ] 🟡 Nema `default export`-a osim lazy route modula
- [ ] 🟡 Nijedan fajl > 200 linija, nijedna komponenta > 150
- [ ] 🟡 Nema magičnih vrednosti
- [ ] 🔵 Booleani imaju `is`/`has`/`can`/`should` prefiks

## Dokumentacija

- [ ] 🟡 Novo pravilo je prvo dokumentovano, pa implementirano
- [ ] 🟡 Novi deljeni hook/util upisan u katalog ([`13`](13-hooks.md), [`14`](14-helpers-utils.md))
- [ ] 🟡 Arhitektonska odluka ima ADR
- [ ] 🔵 `Last review` datum osvežen ako je doc menjan

## Test samog `/review`

Komanda mora da uhvati sva tri problema na namerno lošem kodu:
komponenta sa **5 `useState`**, **`fetch` u `useEffect`-u**, **hardkodovan string**.
Ako promaši ijedan — `/review` je pokvaren, ne kod.
