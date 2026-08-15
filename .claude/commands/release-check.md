---
description: Pun predrelease izveštaj — typecheck, lint, test, build, size, Lighthouse — sa jasnim go/no-go
allowed-tools: Read, Grep, Glob, Bash(pnpm validate:*), Bash(pnpm typecheck:*), Bash(pnpm lint:*), Bash(pnpm test:*), Bash(pnpm build:*), Bash(pnpm size:*), Bash(pnpm lh:*), Bash(pnpm e2e:*), Bash(git status:*), Bash(git log:*), Bash(ls:*)
---

Proveri da li je repo spreman za release.

## Postupak

Pokreni redom i **ne prekidaj na prvom padu** — treba pun izveštaj, ne prva greška:

```bash
pnpm typecheck
pnpm lint
pnpm test --coverage
pnpm build
pnpm size
pnpm lh
pnpm e2e
```

## Izveštaj

| Provera | Status | Detalj |
|---|---|---|
| typecheck | ✅ / ❌ | broj grešaka |
| lint | ✅ / ❌ | broj errora i warninga |
| test | ✅ / ❌ | prošli/ukupno, coverage po pragu |
| build | ✅ / ❌ | vreme, veličina outputa |
| size-limit | ✅ / ❌ | **stvarne brojke prema limitima** |
| lighthouse | ✅ / ❌ | performance / a11y / best-practices / SEO |
| e2e | ✅ / ❌ | prošli/ukupno |

## Pragovi (`docs/16-tooling-ci.md` §3)

Coverage: `packages/utils` 100% · `features/*/hooks` ≥ 90% · ukupno ≥ 80%
Bundle: initial JS ≤ 150 KB gzip · CSS ≤ 20 KB · po ruti ≤ 60 KB
Lighthouse: ≥ 0.95 performance · 1.0 a11y/best-practices/SEO

## Dodatno proveri

- Nekomitovane izmene (`git status`)
- Postoje li changeset-ovi za dirane pakete
- Da li je `apps/web` Lighthouse pao ispod baseline-a (desktop 100 / mobile 92)

## Zaključak — obavezan

Završi sa **go** ili **no-go** i jednom rečenicom zašto.

Ako je no-go, izlistaj **tačno** šta mora da se popravi, poređano po tome šta blokira.
Ne ublažavaj: prijavi padove onako kako jesu, sa izlazom komande.
