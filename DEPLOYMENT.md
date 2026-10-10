# Deployment

Ovde su grane, okruženja i šta se gde postavlja. Server se podešava jednom, po
[`infra/SERVER-SETUP.md`](infra/SERVER-SETUP.md), a Coolify resursi po
[`infra/COOLIFY.md`](infra/COOLIFY.md). Odluka i obrazloženje su u ADR 0017.

## 1. Grane

| Grana | Namena | CI | Image | Deploy |
| --- | --- | --- | --- | --- |
| `dev` | podrazumevana; svi PR-ovi idu ovde | provera + image | `ghcr.io/dusanpavl0vic/cloudsheep.dev:dev` | ne |
| `prod` | živa produkcija | provera + image | `…:prod` + `…:sha-<commit>` | **da** (Coolify webhook) |

Tok je uvek u jednom smeru: `feature/* → dev → prod`. Promocija ide merge-om `dev → prod`.
Direktan commit u `prod` nije dozvoljen.

## 2. Šta gde ide

Jedan kontejner (sajt + admin + API, ADR 0009) i Postgres, oba u Coolify-ju.

| Domen | Kuda | Napomena |
| --- | --- | --- |
| `cloudsheep.dev` | aplikacija `:3000` | `www` → non-www redirect (Coolify) |
| `admin.cloudsheep.dev` | ista aplikacija | `proxy.ts` → `cloudsheep.dev/admin` |
| `api.cloudsheep.dev` | ista aplikacija | stare adrese slika `…/uploads/…` iz baze |
| — | `cloudsheep-db` (Postgres 17) | samo interna mreža, bez javnog porta |

TLS radi Traefik uz Let's Encrypt. DNS je na Cloudflare-u, sa **isključenim proxy-jem**
(`infra/SERVER-SETUP.md` §3).

## 3. Env promenljive

| Promenljiva | Kada | Gde | Napomena |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_ENV` | **build** | CI (`build-args`) | ugrađene u JS; promena traži nov image |
| `DATABASE_URL` | runtime | Coolify | interni string baze |
| `JWT_SECRET` | runtime | Coolify | ≥ 32 znaka, `openssl rand -base64 32` |
| `SMTP_HOST/PORT/USER/PASS`, `CONTACT_TO` | runtime | Coolify | Gmail + App Password; **bez njih upit ne prolazi** (ADR 0016) |
| `SEED_ADMIN_EMAIL/PASSWORD/NAME` | runtime | Coolify | samo za praznu bazu (prvi deploy) |
| `NODE_ENV`, `PORT`, `UPLOAD_DIR`, `NODE_OPTIONS` | — | image | ne postavljaju se |

Pun ugovor sa komentarima je u [`.env.production.example`](.env.production.example). Prave
vrednosti postoje **samo u Coolify-ju**. Za lokalni rad služi `.env.example` → `.env`.

## 4. Pre push-a u `prod`

```bash
pnpm validate                                   # typecheck, lint, test, build, JS budžet
docker build -t cloudsheep:local .
export JWT_SECRET=$(openssl rand -hex 24) SEED_ADMIN_PASSWORD=$(openssl rand -hex 12)
docker compose -f infra/docker-compose.yml up   # isti image, mem_limit 768m, Mailpit
E2E_BASE_URL=http://localhost:3000 MAILPIT_URL=http://localhost:8025 \
  SEED_ADMIN_EMAIL=admin@cloudsheep.local pnpm e2e     # SEED_ADMIN_PASSWORD je već exportovan
```

Lokalni compose hvata ono što `pnpm validate` ne vidi: pokvaren Dockerfile, migraciju ili
seed koji padaju u kontejneru, i memoriju pod ograničenjem (`docker stats cloudsheep-app`).

## 5. Migracije

Pokreću se **pri startu kontejnera** (`scripts/docker-start.sh`): prvo `migrate deploy`,
pa seed samo nad praznom bazom, pa server. Nova migracija se pravi lokalno:

```bash
pnpm db:migrate --name opis_promene     # prisma migrate dev, uz pokrenut Postgres
```

Folder iz `prisma/migrations/` se **commit-uje**. Migracije moraju biti unazad kompatibilne:
rollback koda je jedan klik, a rollback migracije nije. Kolona se dodaje u jednom deployu,
prestaje da se koristi u sledećem i briše se u trećem.

## 6. Bezbednosni headeri i SEO

- CSP sa **nonce-om** po zahtevu (`proxy.ts`). Zato je svaka stranica dinamička, a podaci se
  keširaju po tagu.
- `X-Robots-Tag: noindex, nofollow` za `/admin` i `/api`, a `noindex, follow` za `/sr`
  (`next.config.ts`). U pretrazi je samo engleski (ADR 0012).
- `sitemap.xml` se renderuje po zahtevu iz baze, pa nov projekat ili beleška ulaze bez
  deploy-a. `robots.txt` je statičan.
- Posle prvog deploy-a: Google Search Console po [`infra/SEARCH-CONSOLE.md`](infra/SEARCH-CONSOLE.md).

## 7. Rollback

Coolify → aplikacija → **Deployments** → prethodni → **Redeploy**. Može i ručno: u polje
Image upiši `…:sha-<prethodni commit>`.
