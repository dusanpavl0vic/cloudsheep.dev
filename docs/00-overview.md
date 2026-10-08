# 00 — Pregled

> Status: active | Last review: 2026-10-08

## Šta je ovo

`cloudsheep.dev` — sajt produkt studija iz Niša. Jedna Next.js aplikacija sa tri lica:

| Lice | Putanja | Ko ga koristi | Renderovanje |
|---|---|---|---|
| Javni sajt | `/`, `/projects`, `/notes`, `/contact` (+ `/sr/…`) | posetioci, Google | server (RSC), podaci iz baze |
| Admin panel | `/admin/*` | vlasnik studija | klijent, iza prijave, `noindex` |
| API | `/api/*` | admin, forme na javnom sajtu | route handleri nad `src/server/services` |

Iza svega je PostgreSQL (Prisma 6) i disk za otpremljene slike (`UPLOAD_DIR`).

## Stek

| Sloj | Izbor | Zašto (ADR) |
|---|---|---|
| Framework | Next.js 16, App Router, `output: 'standalone'` | [0009](adr/0009-nextjs-fullstack.md) |
| UI | React 19 + React Compiler | [0001](adr/0001-react-compiler.md) |
| Stil | styled-components 6, tokeni kao CSS promenljive | [0010](adr/0010-styled-components.md) |
| Struktura | po slojevima: `components/`, `hooks/`, `store/`, `constants/`… | [0011](adr/0011-layered-structure.md) |
| Klijentski state | Redux Toolkit + RTK Query | [0006](adr/0006-modal-engine.md) |
| i18n | next-intl (use-intl API), `/` engleski, `/sr` srpski | [0012](adr/0012-locale-prefix.md) |
| Forme | react-hook-form + zod | — |
| Baza | PostgreSQL + Prisma 6 | [`17-backend.md`](17-backend.md) |
| Mejl | nodemailer (SMTP) + provera adrese (MX) | [0013](adr/0013-email-verification.md) |
| Testovi | Vitest, Testing Library, Playwright | [`12-testing.md`](12-testing.md) |

## Šta se odakle vidi

```
cloudsheep.dev ─────── Traefik (TLS) ──► jedan kontejner: node server.js (Next standalone)
admin.cloudsheep.dev ─ 301 → cloudsheep.dev/admin                  │
api.cloudsheep.dev ─── isti kontejner (stari /uploads linkovi)     ├─► PostgreSQL
                                                                   └─► /app/uploads (volume)
```

Image se gradi u GitHub Actions i objavljuje na GHCR; server ga samo povlači
([`16-tooling-ci.md`](16-tooling-ci.md) §5). Server ima 4 GB RAM-a — build na njemu nije dozvoljen.

## Šta nije

- **Nije SPA.** Javna stranica ne čeka JavaScript da bi imala sadržaj, naslov ni `canonical`.
- **Nema zasebnog backend servisa.** API je deo iste aplikacije, na istom poreklu — bez CORS-a.
- **Nema monorepoa.** Jedna app; pravilo „kod u paket tek kad ga koristi druga app" znači da
  paketa nema.
