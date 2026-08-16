# Dokumentacija

> Status: active | Last review: 2026-08-15

Ovi fajlovi su **izvor istine** za arhitekturu i pravila. Kod koji im protivreči je bug,
i to se rešava tako što se prvo ispravi doc, pa kod — nikad obrnuto.

Svaki dokument ima isti oblik: **Pravila / Primeri / Anti-patterns / Checklist**.
Pravila su formulisana da budu proverljiva — "zabranjeno je X, umesto toga Y, evo koda",
nikad "treba voditi računa o performansama".

## Redosled čitanja

**Novi developer (ili agent) — prvih sat vremena:**

1. [`00-overview.md`](00-overview.md) — šta je ovo, koje app-e sadrži
2. [`01-architecture.md`](01-architecture.md) — feature folders, pravila zavisnosti
3. [`02-folder-structure.md`](02-folder-structure.md) — gde šta živi
4. [`07-performance.md`](07-performance.md) — **najvažniji**; `useEffect`/`useMemo`/`useState` pravila
5. [`13-hooks.md`](13-hooks.md) — hook-first pravilo, jer o njega se sve lomi

**Pre prvog PR-a:** [`03-naming-conventions.md`](03-naming-conventions.md) ·
[`19-code-review-checklist.md`](19-code-review-checklist.md)

## Po zadatku

| Radiš… | Čitaj |
|---|---|
| novu aplikaciju | [`17-adding-new-app.md`](17-adding-new-app.md) |
| novi feature | [`18-adding-new-feature.md`](18-adding-new-feature.md) |
| state, slice, selektore | [`04-state-management.md`](04-state-management.md) |
| rute, guard, lazy | [`05-routing.md`](05-routing.md) |
| dijalog bilo koje vrste | [`06-modals.md`](06-modals.md) |
| stil, tokene, teme | [`08-styling-ui.md`](08-styling-ui.md) |
| prevode, novi jezik | [`09-i18n.md`](09-i18n.md) |
| formu | [`10-forms-validation.md`](10-forms-validation.md) |
| API poziv | [`11-data-fetching.md`](11-data-fetching.md) |
| testove | [`12-testing.md`](12-testing.md) |
| helper funkciju | [`14-helpers-utils.md`](14-helpers-utils.md) |
| pristupačnost | [`15-accessibility.md`](15-accessibility.md) |
| lint, CI, verzije | [`16-tooling-ci.md`](16-tooling-ci.md) |
| bilo šta oko sigurnosti | [`20-security.md`](20-security.md) |
| ne razumeš pojam | [`21-glossary.md`](21-glossary.md) |

## Arhitektonske odluke (ADR)

Odluka koja se ne može izvesti iz koda mora biti zapisana. Nova se pravi sa `/adr <naslov>`.

| ADR | Odluka | Status |
|---|---|---|
| [0000](adr/0000-initial-spec.md) | Inicijalni SPEC (arhiva) | superseded by docs/ |
| [0001](adr/0001-react-compiler.md) | React Compiler ON, ručna memoizacija OFF | accepted |
| [0002](adr/0002-router-choice.md) | React Router umesto TanStack Router-a | accepted |
| [0003](adr/0003-styling-choice.md) | Tailwind v4 umesto Panda/vanilla-extract | accepted |
| [0004](adr/0004-feature-folders-vs-fsd.md) | Feature folders umesto kanonskog FSD-a | accepted |
| [0005](adr/0005-barrel-files.md) | Barrel fajlovi samo na granicama | accepted |
| [0006](adr/0006-modal-engine.md) | Sopstveni Redux modal engine vs `nice-modal-react` | accepted |
| [0007](adr/0007-ui-flat-vs-folder.md) | `packages/ui`: flat `ui/`, folder drugde | accepted |
| [0008](adr/0008-theme-data-attribute.md) | Tema preko `data-theme`, ne `class` | accepted |

[`adr/template.md`](adr/template.md) — šablon: Context / Decision / Consequences / Alternatives.

## Održavanje

- Svaki doc ima `Last review` datum. Stariji od 6 meseci → `/docs-sync` pa revizija.
- Pravilo bez mašinske provere biće prekršeno. Kad dodaješ pravilo, dodaj i lint rule
  (vidi [`16-tooling-ci.md`](16-tooling-ci.md) §2) — inače je to želja, ne pravilo.
- `/docs-sync` prijavljuje divergenciju koda i dokumentacije.
