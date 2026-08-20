# Coolify — konfiguracija tri resursa

Preduslov: server i DNS su gotovi po [`SERVER-SETUP.md`](SERVER-SETUP.md), i sva četiri
`dig` upita vraćaju IP servera.

Struktura: jedan **Project** (`cloudsheep`), u njemu **jedna baza + tri aplikacije**.

Redosled je bitan: baza → `api` → `web` → `admin`. `api` bez baze ne prolazi
readiness, a frontovi bez `api`-ja nemaju šta da zovu.

---

## 0. Dve stvari koje se najčešće promaše

**1. Build context je koren repoa, ne folder app-e.** Svi Dockerfile-ovi počinju sa
`COPY pnpm-lock.yaml pnpm-workspace.yaml`, a ti fajlovi postoje samo na korenu.
U Coolify-u to znači **Base Directory = `/`**, a putanja do Dockerfile-a je puna
(`infra/docker/api.Dockerfile`).

**2. `VITE_*` idu u „Build Variables", ne u „Environment Variables".** Vite ih ugrađuje
u JS bundle u trenutku builda; runtime env varijabla u nginx kontejneru ne postoji jer
se JS više ne prevodi. Ovo je najčešća greška pri prelasku sa Vercela, i najgora — build
prođe, deploy prođe, a app u pretraživaču pukne sa `undefined` umesto API adrese.

---

## 1. Baza

**New Resource → PostgreSQL 17**

| Polje       | Vrednost        |
| ----------- | --------------- |
| Name        | `cloudsheep-db` |
| Public port | **ne dodeljuj** |
| Domain      | **ne dodeljuj** |

Baza ostaje samo na internoj Docker mreži. Postgres izložen internetu je jedna slaba
lozinka od potpunog gubitka podataka, a `api` mu pristupa preko imena kontejnera.

Kad se digne, kopiraj **internal connection string** — izgleda kao
`postgresql://postgres:<lozinka>@<ime-kontejnera>:5432/postgres`. To ide u `DATABASE_URL`.

**Backups →** uključi dnevni. Ako imaš S3 negde, podesi i tamo — backup na istom disku
ne pomaže kad disk otkaže.

---

## 2. `api`

**New Resource → Application → GitHub** (poveži GitHub App) → repo → branch **`prod`**.

> Grana je `prod`, ne `main` — vidi `/DEPLOYMENT.md` §1. `main` je testna grana.

### Build

| Polje               | Vrednost                      |
| ------------------- | ----------------------------- |
| Build Pack          | Dockerfile                    |
| Base Directory      | `/`                           |
| Dockerfile Location | `infra/docker/api.Dockerfile` |
| Ports Exposes       | `3000`                        |

### Domain

| Polje             | Vrednost                     |
| ----------------- | ---------------------------- |
| Domains           | `https://api.cloudsheep.dev` |
| Health Check Path | `/health`                    |

Health check gleda `/health` (liveness), **ne** `/health/ready`. Ovaj drugi zove bazu, pa
bi pad Postgresa restartovao API u petlji zbog tuđeg kvara. `/health/ready` postoji za
ručnu dijagnostiku.

### Environment Variables (runtime)

```
NODE_ENV=production
PORT=3000
DATABASE_URL=<internal string iz koraka 1>
CORS_ORIGINS=https://cloudsheep.dev,https://www.cloudsheep.dev,https://admin.cloudsheep.dev
COOKIE_DOMAIN=.cloudsheep.dev
JWT_SECRET=<openssl rand -base64 32>
UPLOAD_DIR=/app/uploads
PUBLIC_UPLOAD_BASE=https://api.cloudsheep.dev
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=cloudsheep.dev016@gmail.com
SMTP_PASS=<Google App Password, 16 znakova>
CONTACT_TO=cloudsheep.dev016@gmail.com
SEED_ADMIN_EMAIL=<tvoj mejl>
SEED_ADMIN_PASSWORD=<lozinka, bar 12 znakova>
SEED_ADMIN_NAME=<ime>
```

`SEED_ADMIN_*` postoje da bi nalog bio u bazi **odmah posle prvog deploya**, bez ručnog
koraka. Ovde im je jedino mesto — u repou ne postoje ni u `.env.example` (tamo je samo
prazan placeholder). Coolify ih čuva šifrovane; obeleži ih kao secret ako ti nudi.

Kad nalog jednom postoji, ove tri varijable slobodno mogu i da se obrišu — seed će se
od tada tiho preskakati.

`CORS_ORIGINS` je allowlist bez zvezdice, i **`www` varijanta mora biti unutra** ako
`www` ne redirektuje pre nego što JS krene da zove API.

`COOKIE_DOMAIN` ima vodeću tačku — bez nje refresh cookie važi samo za `api.` poddomen
i `admin.` ga nikad ne pošalje nazad, pa se sesija ne obnavlja.

`JWT_SECRET` mora imati bar 32 znaka; `apps/api/src/env.ts` to proverava pri startu i
odbija da digne app ako je kraći.

### Pre-deployment command

```
./node_modules/.bin/prisma migrate deploy && node dist/seed.js
```

> Ovo **nije** `pnpm --filter api migrate:deploy`. U runtime image-u nema ni pnpm-a ni
> workspace strukture — `pnpm deploy` je app spljoštio u `/app`. Prisma CLI je zato
> namerno `dependency`, a ne `devDependency`.

Migracije idu ovde, a ne u `CMD`: u `CMD`-u bi se izvršavale na svaki restart kontejnera
i na svaku repliku paralelno.

`node dist/seed.js` pravi prvi admin nalog. Bezbedno je držati ga u svakom deployu:
`upsert` **ne menja postojeći nalog** (ni lozinku), a bez `SEED_ADMIN_*` varijabli se
tiho preskače umesto da obori deploy.

### SMTP za kontakt formu

`SMTP_PASS` je **Google App Password**, ne lozinka naloga: Google nalog → Security →
2-Step Verification → App passwords. Traži uključen 2FA.

Bez ovih varijabli forma i dalje radi — poruka se upiše u bazu i vidi na `/messages`, samo
mejl ne stiže. To je namerno: pad SMTP-a ne sme da izgubi poruku.

> Gmail šalje samo sa **autentifikovane** adrese. `from` je zato uvek `SMTP_USER`, a
> posetiočeva adresa ide u `replyTo` — pritisneš „Odgovori" i pišeš njemu.

### Persistent Storage — obavezno

`api` → **Storages** → Add → mount path `/app/uploads`.

Bez toga otpremljene slike nestaju pri **svakom** deployu: kontejner se zamenjuje, a sa
njim i njegov fajl sistem. Greška se ne vidi odmah — slike rade dok se ne pusti sledeći
deploy, pa deluje kao da je nešto drugo puklo.

> **Ovo je stanje IZVAN Postgresa i izvan njegovog backupa.** Ili ga dodaj u rutinu
> pravljenja rezervnih kopija, ili svesno prihvati da se slike mogu izgubiti.

### Watch Paths

```
apps/api/**
packages/**
pnpm-lock.yaml
```

---

## 3. `web`

**New Resource → Application → GitHub** → repo → branch **`prod`**.

| Polje               | Vrednost                      |
| ------------------- | ----------------------------- |
| Build Pack          | Dockerfile                    |
| Base Directory      | `/`                           |
| Dockerfile Location | `infra/docker/web.Dockerfile` |
| Ports Exposes       | `80`                          |
| Domains             | `https://cloudsheep.dev`      |
| Health Check Path   | `/healthz`                    |

Uključi **redirect `www` → non-www** (Coolify to nudi uz domen). Ako radije hoćeš da
`www` bude ravnopravan, dodaj ga i u `Domains` — ali onda mora ostati i u `CORS_ORIGINS`.

### Build Variables (NE Environment Variables)

```
VITE_API_URL=https://api.cloudsheep.dev
VITE_APP_ENV=production
```

Bez sheme (`https://`) CSP `connect-src` dobija besmislenu vrednost — ista vrednost se
`sed`-om upisuje u nginx config (`infra/nginx/security-headers.conf`).

### Watch Paths

```
apps/web/**
packages/**
pnpm-lock.yaml
```

---

## 4. `admin`

Isto kao `web`, tri razlike:

| Polje               | Vrednost                                         |
| ------------------- | ------------------------------------------------ |
| Dockerfile Location | `infra/docker/admin.Dockerfile`                  |
| Domains             | `https://admin.cloudsheep.dev`                   |
| Watch Paths         | `apps/admin/**`, `packages/**`, `pnpm-lock.yaml` |

Build Variables su iste (`VITE_API_URL`, `VITE_APP_ENV`).

`admin` image sam sebi dodaje `X-Robots-Tag: noindex, nofollow` — interni panel nema šta
da traži u pretrazi. `web` tu liniju namerno nema.

---

## 5. Auto-deploy

Za svaki od tri resursa uključi **webhook na push u `prod`**. Uz Watch Paths iz gornjih
tabela, push u `apps/web` više ne rebuilduje `api`.

Watch Paths namerno uključuju `packages/**` za sva tri: izmena deljenog paketa menja i
frontove i (potencijalno) backend, pa se svi grade.

---

## 6. Prvo puštanje — redosled i provere

1. **Deploy `api`.** Kad završi:

   ```bash
   curl -s https://api.cloudsheep.dev/health         # {"status":"ok"}
   curl -s https://api.cloudsheep.dev/health/ready   # {"status":"ok","database":"up"}
   ```

   Ako `ready` vrati `503 database: down`, `DATABASE_URL` nije tačan ili migracija nije
   prošla — pogledaj log pre-deployment koraka, ne aplikacije.

2. **Admin nalog je već tu** — napravila ga je pre-deployment komanda, iz `SEED_ADMIN_*`
   varijabli. Proveri u logu deploya: `seed: admin <mejl> spreman`.

   Ako umesto toga piše `preskačem`, varijable nisu postavljene — dodaj ih i pusti
   Redeploy. Ako treba ručno:

   ```bash
   node dist/seed.js
   ```

   > `node dist/seed.js`, ne `prisma db seed` — ovaj drugi zove `tsx`, koji je
   > devDependency i nije u runtime image-u. Seed je zato u `src/`, da se kompajlira.
   >
   > Seed **ne može da promeni postojeću lozinku** (`upsert` ne dira postojeći red). Za
   > promenu ide `UPDATE` sa novim bcrypt hešom.

3. **Deploy `web`**, pa `admin`.

4. **Otvori `https://admin.cloudsheep.dev`** i prijavi se.

5. **Hard refresh na dubokom linku** (`admin.cloudsheep.dev/projects/1`, `Cmd+Shift+R`).
   404 ovde znači da SPA fallback ne radi — proveri da je `spa.conf` stvarno u
   `/etc/nginx/conf.d/default.conf` u kontejneru.

6. **DevTools → Network**, prijava:
   - nema CORS greške → `CORS_ORIGINS` je tačan
   - `Set-Cookie` ima `Domain=.cloudsheep.dev`, `Secure`, `HttpOnly`, `SameSite=Lax`
   - nema CSP greške u konzoli → `VITE_API_URL` i `__API_ORIGIN__` se poklapaju

7. **Napravi zapis u `admin`-u** → mora se pojaviti na `cloudsheep.dev`.

---

## 7. Rollback

Coolify → resurs → **Deployments** → prethodni uspešan build → **Redeploy**.

Traje koliko i pokretanje kontejnera (image već postoji), dakle sekunde.

**Migracije se ne vraćaju same.** Ako je pao deploy koji je već primenio migraciju,
rollback koda vraća staru verziju uz novu šemu baze. Zato migracije treba da budu
unazad kompatibilne — dodaj kolonu, nemoj je brisati u istom deployu u kom prestaješ
da je koristiš.

---

## 8. Poznata ograničenja

- **Nema testne instance.** Jedan server, jedna produkcija. Testna bi tražila još tri
  Coolify resursa i još tri poddomena (`test.`, `admin-test.`, `api-test.`).
- **Sourcemape se serviraju javno** (`dist/assets/*.map`). Za `web` je to bezazleno, za
  `admin` znači da je izvorni kod panela čitljiv svakome ko otvori DevTools. Ako smeta,
  isključi `build.sourcemap` u `apps/admin/vite.config.ts`.
