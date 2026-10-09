# Dokumentacija

> Status: active | Last review: 2026-10-08

Ovi fajlovi su **izvor istine** za arhitekturu i pravila. Kod koji im protivreči je bug,
i to se rešava tako što se prvo ispravi doc, pa kod — nikad obrnuto.

Pravila su formulisana da budu proverljiva — „zabranjeno je X, umesto toga Y, evo koda",
nikad „treba voditi računa o performansama".

## Redosled čitanja

**Novi developer (ili agent) — prvih sat vremena:**

1. [`00-overview.md`](00-overview.md) — šta je ovo i od čega se sastoji
2. [`01-architecture.md`](01-architecture.md) — slojevi, server/klijent granica, pravila zavisnosti
3. [`02-folder-structure.md`](02-folder-structure.md) — gde šta živi
4. [`07-performance.md`](07-performance.md) — **najvažniji**; `useEffect`/`useMemo`/`useState`, budžeti
5. [`13-hooks.md`](13-hooks.md) — logika je u hookovima, pa se o njih sve lomi

**Pre prvog PR-a:** [`03-naming-conventions.md`](03-naming-conventions.md) ·
[`19-code-review-checklist.md`](19-code-review-checklist.md)

## Po zadatku

| Radiš… | Čitaj |
|---|---|
| novu stranicu, endpoint, slice, komponentu | [`18-adding-new-feature.md`](18-adding-new-feature.md) |
| state, slice, selektore | [`04-state-management.md`](04-state-management.md) |
| rute, jezik u URL-u, SEO, metapodatke | [`05-routing.md`](05-routing.md) |
| dijalog, dropdown, sheet, drawer | [`06-modals.md`](06-modals.md) |
| stil, tokene, teme | [`08-styling-ui.md`](08-styling-ui.md) |
| izgled sekcija, staklo, animacije | [`22-visual-language.md`](22-visual-language.md) |
| prevode, novi jezik | [`09-i18n.md`](09-i18n.md) |
| formu | [`10-forms-validation.md`](10-forms-validation.md) |
| podatke — server komponente i RTK Query | [`11-data-fetching.md`](11-data-fetching.md) |
| testove | [`12-testing.md`](12-testing.md) |
| helper funkciju | [`14-helpers-utils.md`](14-helpers-utils.md) |
| pristupačnost | [`15-accessibility.md`](15-accessibility.md) |
| lint, CI, verzije, Docker | [`16-tooling-ci.md`](16-tooling-ci.md) |
| API rute, auth, mejl, upload, baza | [`17-backend.md`](17-backend.md) |
| bilo šta oko sigurnosti | [`20-security.md`](20-security.md) |
| ne razumeš pojam | [`21-glossary.md`](21-glossary.md) |

## Arhitektonske odluke (ADR)

Odluka koja se ne može izvesti iz koda mora biti zapisana. Nova se pravi sa `/adr <naslov>`.

| ADR | Odluka | Status |
|---|---|---|
| [0000](adr/0000-initial-spec.md) | Inicijalni SPEC (arhiva) | superseded by docs/ |
| [0001](adr/0001-react-compiler.md) | React Compiler ON, ručna memoizacija OFF | accepted |
| [0002](adr/0002-router-choice.md) | React Router umesto TanStack Router-a | superseded by 0009 |
| [0003](adr/0003-styling-choice.md) | Tailwind v4 umesto Panda/vanilla-extract | superseded by 0010 |
| [0004](adr/0004-feature-folders-vs-fsd.md) | Feature folders umesto kanonskog FSD-a | superseded by 0011 |
| [0005](adr/0005-barrel-files.md) | Barrel fajlovi samo na granicama | superseded by 0011 |
| [0006](adr/0006-modal-engine.md) | Sopstveni Redux modal engine vs `nice-modal-react` | accepted |
| [0007](adr/0007-ui-flat-vs-folder.md) | `packages/ui`: flat `ui/`, folder drugde | superseded by 0011 |
| [0008](adr/0008-theme-data-attribute.md) | Tema preko `data-theme`, ne `class` | accepted |
| [0009](adr/0009-nextjs-fullstack.md) | Jedna Next.js aplikacija umesto dva SPA-a i Express-a | accepted |
| [0010](adr/0010-styled-components.md) | styled-components umesto Tailwind-a | superseded (0015) |
| [0011](adr/0011-layered-structure.md) | Struktura po slojevima (`REACT_FRONTEND_STRUCTURE.md`) | accepted |
| [0012](adr/0012-locale-prefix.md) | Jezik u URL-u (`/`, `/sr`) preko next-intl | accepted |
| [0013](adr/0013-email-verification.md) | Provera mejla: sintaksa + MX + disposable, bez SMTP probe | accepted |
| [0014](adr/0014-js-budget-200kb.md) | JS budžet javnih ruta 200 KB gzip, produkcioni build kroz webpack | accepted |
| [0015](adr/0015-next-yak.md) | next-yak umesto styled-components (CSS u build-u, bez runtime-a) | accepted |

[`adr/template.md`](adr/template.md) — šablon: Context / Decision / Consequences / Alternatives.

## Održavanje

- Svaki doc ima `Last review` datum. Stariji od 6 meseci → `/docs-sync` pa revizija.
- Pravilo bez mašinske provere biće prekršeno. Kad dodaješ pravilo, dodaj i lint rule
  (vidi [`16-tooling-ci.md`](16-tooling-ci.md) §2) — inače je to želja, ne pravilo.
