# Coolify — jedan resurs iz gotovog image-a

Preduslov: server i DNS su gotovi po [`SERVER-SETUP.md`](SERVER-SETUP.md), i svi `dig` upiti
vraćaju IP servera. Odluka i obrazloženje su u ADR 0017.

Struktura: jedan **Project** (`cloudsheep`) sa **bazom i jednom aplikacijom**. Aplikacija je
sajt, admin i API zajedno (ADR 0009). Image gradi GitHub Actions i objavljuje ga na GHCR,
a server ga samo povlači. **Na VPS-u se ništa ne gradi** (4 GB RAM-a, ADR 0014).

```
push u prod ─► CI: lint · test · build · e2e ─► ghcr.io/dusanpavl0vic/cloudsheep.dev:prod
                                               └► Coolify webhook ─► pull + restart
start kontejnera: prisma migrate deploy → seed (samo prazna baza) → node server.js
```

---

## 0. Pre prvog deploya — jednom

1. **GHCR paket mora biti dostupan serveru.** Posle prvog push-a u `prod` (ili `dev`) paket
   se pojavi na GitHub-u → profil → **Packages** → `cloudsheep.dev`. Novi paket je
   podrazumevano privatan. Izaberi jedno:
   - **Package settings → Change visibility → Public.** Preporučeno. Repo je javan, a u
     image-u nema tajni (samo `NEXT_PUBLIC_*`, a te su ionako u JS-u stranice).
   - ili Coolify → **Settings → Private Registries / Docker login** sa GitHub tokenom
     (`read:packages`).
2. **Port 8000 zatvori** (`SERVER-SETUP.md` §2). Coolify panel se otvara kroz SSH tunel, a
   ne javno preko HTTP-a.

---

## 1. Baza

**Postojeću bazu `cloudsheep-db` NE briši i ne pravi novu.** U njoj su projekti, poruke i
admin nalog. Nove migracije samo dodaju kolone i tabele (proverena je istorija grana
`prod`, `dev` i `feat/vps-migration`), pa ih `migrate deploy` primeni pri prvom startu.

Pre prvog deploya napravi backup: **cloudsheep-db → Backups → Backup Now**.

Ako baza ne postoji (potpuno nov server): **New Resource → PostgreSQL 17**, ime
`cloudsheep-db`, **bez javnog porta i bez domena**. Uključi dnevni backup. Kopiraj
**internal connection string** (`postgresql://postgres:<lozinka>@<kontejner>:5432/postgres`),
jer on ide u `DATABASE_URL`.

---

## 2. Aplikacija

**New Resource → Docker Image** (ne „Application → GitHub": tu bi Coolify gradio na serveru).

| Polje | Vrednost |
| --- | --- |
| Image | `ghcr.io/dusanpavl0vic/cloudsheep.dev:prod` |
| Ports Exposes | `3000` |
| Health Check Path | `/api/health` |
| Domains | `https://cloudsheep.dev,https://admin.cloudsheep.dev,https://api.cloudsheep.dev` |
| www | uključi **redirect `www` → non-www** |

Sva tri domena idu na isti kontejner:

- `admin.cloudsheep.dev` → `proxy.ts` preusmerava na `cloudsheep.dev/admin`.
- `api.cloudsheep.dev` ostaje zbog **starih adresa slika u bazi**
  (`https://api.cloudsheep.dev/uploads/…`). Ista ruta `/uploads/[...path]` ih servira.
- Health check gleda `/api/health` (liveness), a ne `/api/health/ready`. Ovaj drugi zove
  bazu, pa bi pad Postgres-a restartovao aplikaciju u petlji zbog tuđeg kvara.

### Resource Limits

| Polje | Vrednost |
| --- | --- |
| Memory | `768m` |
| Memory Swap | `768m` |

Image postavlja `NODE_OPTIONS=--max-old-space-size=384`. Heap ostaje ispod ograničenja, pa
GC radi pre nego što kernel ubije proces. Izmereno je u §6.

### Environment Variables (runtime)

```
DATABASE_URL=<internal string iz koraka 1>
JWT_SECRET=<openssl rand -base64 32>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=cloudsheep.dev016@gmail.com
SMTP_PASS=<Google App Password, 16 znakova, bez razmaka>
CONTACT_TO=cloudsheep.dev016@gmail.com
SEED_ADMIN_EMAIL=<tvoj mejl>
SEED_ADMIN_PASSWORD=<bar 12 znakova>
SEED_ADMIN_NAME=<ime>
```

- **`NODE_ENV`, `PORT`, `UPLOAD_DIR`, `NODE_OPTIONS` ne postavljaj.** Image ih već ima.
- `NEXT_PUBLIC_SITE_URL` je **build-time** (CI: `https://cloudsheep.dev`). U Coolify-ju ne
  menja ništa, jer je već ugrađen u JS.
- `PUBLIC_UPLOAD_BASE` ostaje prazan: nove slike dobijaju relativnu adresu (`/uploads/…`).
- `SEED_ADMIN_*` koristi seed **samo kad je baza prazna** (`--if-empty`). Na postojećoj bazi
  admin već postoji, pa se varijable ne koriste i mogu da se izostave.
- `JWT_SECRET` mora imati bar 32 znaka, inače prvi zahtev pada sa spiskom problema u logu.
  **Novi tajni ključ odjavljuje sve postojeće sesije.** To je očekivano posle prelaska.

### SMTP (Gmail) — App Password

`SMTP_PASS` je **App Password**, ne lozinka naloga:

1. Google nalog `cloudsheep.dev016@gmail.com` → **Security** → uključi **2-Step Verification**.
2. **Security → App passwords** → ime `cloudsheep.dev` → **Create** → kopiraj 16 znakova.
3. Upiši u `SMTP_PASS` (bez razmaka) i pokreni Restart.

Bez SMTP-a **u produkciji upit ne prolazi** (503 `contact.errors.mailFailed`). Razlog je
double opt-in (ADR 0016): bez mejla posetilac ne može da potvrdi adresu, pa se upit ni ne
upisuje. Provera je u §5.

> Gmail šalje samo sa autentifikovane adrese. `from` je zato uvek `SMTP_USER`, a adresa
> posetioca ide u `replyTo`. Kad klikneš „Odgovori", pišeš direktno njemu.

### Persistent Storage — obavezno

**Storages → Add → Volume**, mount path **`/app/uploads`**.

Bez toga otpremljene slike nestaju pri svakom deployu. **Postojeće slike** su u volumenu
starog `api` resursa. Pre gašenja starog resursa ih prebaci (na serveru, kroz Coolify
**Terminal** ili SSH):

```bash
docker volume ls | grep -i upload          # ime starog volumena (api) i novog (app)
docker run --rm -v <stari>:/from -v <novi>:/to alpine sh -c 'cp -a /from/. /to/ && ls /to | head'
```

Ovo je stanje **van Postgres-a i van njegovog backup-a**. Dodaj ga u rutinu pravljenja kopija.

---

## 3. Migracije i seed

Pokreću se **pri svakom startu kontejnera** (`scripts/docker-start.sh`), pre servera:

1. `prisma migrate deploy`: primenjuje samo nove migracije, pa je ponovno pokretanje bezopasno.
2. `node dist/seed.cjs --if-empty`: radi samo nad praznom bazom (prvi deploy). Inače bi
   vratio projekte i tehnologije obrisane u admin-u.

Pre-deployment command **ne treba**. Jedna instanca, pa nema trke dve replike oko iste
migracije. Ako migracija padne, kontejner se ne digne. Coolify zadrži stari kontejner, a
uzrok je u logu deploya.

Ručni seed (npr. prazna baza posle havarije), u Terminal-u kontejnera:

```bash
node dist/seed.cjs
```

---

## 4. Auto-deploy

GitHub → repo → **Settings → Secrets and variables → Actions**:

| Secret | Odakle |
| --- | --- |
| `COOLIFY_WEBHOOK` | Coolify → aplikacija → **Webhooks** → Deploy Webhook URL |
| `COOLIFY_TOKEN` | Coolify → **Keys & Tokens → API tokens** → novi token sa pravom „deploy" |

CI posle novog `:prod` image-a pozove webhook, a Coolify povuče image i restartuje
aplikaciju. Bez ovih secret-a CI samo objavi image, a deploy pokrećeš ručno (**Redeploy**).

---

## 5. Prvo puštanje — redosled i provere

1. Backup baze (§1) → aplikacija (§2) → **Deploy**. U logu traži:
   `… migrations have been successfully applied` i `seed: baza već ima podatke — preskačem`
   (ili `seed: admin … spreman` na praznoj bazi).
2. Provere:

   ```bash
   curl -s https://cloudsheep.dev/api/health          # {"status":"ok"}
   curl -s https://cloudsheep.dev/api/health/ready    # {"status":"ok","database":"up"}
   curl -sI https://cloudsheep.dev/sr | grep -i x-robots     # noindex, follow
   curl -sI https://cloudsheep.dev/admin | grep -i x-robots  # noindex, nofollow
   curl -s https://cloudsheep.dev/sitemap.xml | head          # samo engleske adrese
   curl -sI https://admin.cloudsheep.dev | grep -i location  # 301 → https://cloudsheep.dev/admin
   ```

3. Otvori `https://cloudsheep.dev/admin` i prijavi se postojećim nalogom.
4. **Mejl:** pošalji upit sa svoje adrese na `/contact`. Treba da stigne mejl sa linkom, a
   tek posle klika na **Confirm and send** upit se pojavljuje u **Poruke** i stiže na
   `CONTACT_TO`.
5. Izmeni nešto u admin-u (npr. objavi utisak). Promena se odmah vidi na sajtu, bez rebuild-a.
6. **Google Search Console** po [`SEARCH-CONSOLE.md`](SEARCH-CONSOLE.md).
7. Kad je sve zeleno, **ugasi stare resurse** `api`, `web` i `admin`, ali tek posle
   prebacivanja slika (§2). Baza ostaje.

---

## 6. Memorija

Izmereno lokalno sa istim ograničenjem (`infra/docker-compose.yml`, `mem_limit: 768m`),
obilaskom javnih i admin stranica. Brojke su u PR opisu i u `DEPLOYMENT.md` §4. Na serveru:

```bash
docker stats --no-stream $(docker ps -q --filter "name=cloudsheep")
```

---

## 7. Rollback

Coolify → aplikacija → **Deployments** → prethodni → **Redeploy**. Može i bez Coolify
istorije: u polje Image upiši prethodni tag `ghcr.io/…:sha-<commit>`.

**Migracije se ne vraćaju same.** Zato moraju biti unazad kompatibilne: dodaj kolonu, a
nemoj je brisati u istom deployu u kom prestaješ da je koristiš.
