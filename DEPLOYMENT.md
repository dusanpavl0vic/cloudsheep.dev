# Deployment

Kako su podeljene grane i okruženja, i šta se gde postavlja.

Podešavanje servera je jednokratno i stoji u [`infra/SERVER-SETUP.md`](infra/SERVER-SETUP.md);
konfiguracija Coolify resursa u [`infra/COOLIFY.md`](infra/COOLIFY.md). Ovaj dokument je
ono što treba da znaš **posle** toga.

## 1. Grane

| Grana  | Namena                               | Deploy                   |
| ------ | ------------------------------------ | ------------------------ |
| `dev`  | default grana, integracija feature-a | ne deployuje se          |
| `main` | testna grana (QA pre produkcije)     | ne deployuje se          |
| `prod` | živa produkcija                      | **da** — Coolify webhook |

Tok promena je uvek u jednom smeru:

```
feature/* → dev → main → prod
```

`dev` je default grana na GitHubu — svi PR-ovi feature grana idu u `dev`. Promocija ide
merge-om `dev → main`, pa `main → prod`. Nikad ne commit-uj direktno u `main` ili `prod`.

> **Trenutno postoji samo produkciono okruženje.** Jedan VPS, tri resursa. `main` je
> grana bez servera — testira se lokalno kroz `docker compose` (§4). Testna instanca bi
> tražila još tri Coolify resursa i još tri poddomena; kad zatreba, to je posao od pola
> sata, ne preprojektovanje.

## 2. Šta gde ide

| Domen                               | Coolify resurs  | Image                           | Port          |
| ----------------------------------- | --------------- | ------------------------------- | ------------- |
| `cloudsheep.dev` (+ `www` redirect) | `web`           | `infra/docker/web.Dockerfile`   | 80 (nginx)    |
| `admin.cloudsheep.dev`              | `admin`         | `infra/docker/admin.Dockerfile` | 80 (nginx)    |
| `api.cloudsheep.dev`                | `api`           | `infra/docker/api.Dockerfile`   | 3000 (node)   |
| — (bez javnog porta)                | `cloudsheep-db` | PostgreSQL 17                   | 5432, interno |

TLS radi Traefik uz Let's Encrypt, automatski. `web` i `admin` **nikad ne pričaju
direktno međusobno** — sve ide kroz `api`.

**DNS drži Cloudflare, domen je registrovan na Namecheapu** — tamo su promenjeni samo
nameserveri (`infra/SERVER-SETUP.md` §3). Proxy je namerno **isključen** na sva četiri zapisa:
Cloudflare je imenik, saobraćaj ide pravo na Hetzner. Uključivanje proxyja nije bezopasno —
traži `Full (strict)` i firewall ograničen na Cloudflare opsege, inače `trust proxy` u
`apps/api/src/app.ts` počne da veruje zaglavlju koje svako može da pošalje.

## 3. Env promenljive

### Build-time vs runtime

Ovo je jedina stvar iz ovog dokumenta koju stvarno moraš zapamtiti.

`VITE_*` varijable Vite **ugrađuje u JS bundle** u trenutku builda. Kontejner u kome
nginx servira taj bundle nema pojma o env varijablama — JS se više ne prevodi. Zato:

|                                | Coolify polje             | Kad se menja         | Efekat izmene            |
| ------------------------------ | ------------------------- | -------------------- | ------------------------ |
| `VITE_API_URL`, `VITE_APP_ENV` | **Build Variables**       | traži **rebuild**    | nova vrednost u bundle-u |
| sve ostalo (`api`)             | **Environment Variables** | dovoljan **restart** | odmah                    |

`VITE_*` postavljena kao obična Environment Variable ne radi ništa. Build prođe, deploy
prođe, a app u pretraživaču pukne — kod `admin`-a odmah, jer `src/lib/env.ts` vrednosti
validira zodom pri učitavanju modula.

I obrnuto: pošto završe u bundle-u, `VITE_*` vrednosti su **javno čitljive**. Nikad tajna.

### Spisak

Pun ugovor sa komentarima je u [`.env.production.example`](.env.production.example). Ukratko:

| Promenljiva        | Tip     | Resurs         | Napomena                                     |
| ------------------ | ------- | -------------- | -------------------------------------------- |
| `VITE_API_URL`     | build   | `web`, `admin` | `https://api.cloudsheep.dev`, sa shemom      |
| `VITE_APP_ENV`     | build   | `web`, `admin` | `production`                                 |
| `DATABASE_URL`     | runtime | `api`          | interna adresa Coolify Postgres resursa      |
| `JWT_SECRET`       | runtime | `api`          | ≥ 32 znaka, `openssl rand -base64 32`        |
| `CORS_ORIGINS`     | runtime | `api`          | allowlist, comma-separated, uključi i `www`  |
| `COOKIE_DOMAIN`    | runtime | `api`          | `.cloudsheep.dev` — vodeća tačka je obavezna |
| `NODE_ENV`, `PORT` | runtime | `api`          | `production`, `3000`                         |

Prave vrednosti žive **samo u Coolify UI-ju**. U repou su samo ugovori: `.env.production.example` za deploy, `apps/*/.env.example` za lokalni rad.

### Lokalno

```bash
cp apps/api/.env.example apps/api/.env
cp apps/admin/.env.example apps/admin/.env
cp apps/web/.env.example apps/web/.env
```

`.env` i `.env.*` su u `.gitignore` (osim ta dva ugovora).

## 4. Pre push-a u `prod`

```bash
pnpm validate                                      # typecheck, lint, test, build, size
docker compose -f infra/docker-compose.yml up --build
```

`pnpm validate` ne vidi tri klase grešaka koje `docker compose` vidi: pokvaren Dockerfile,
CSP koji blokira sopstveni API, i SPA fallback koji vraća 404 na dubokom linku. Provere
su u [`README.md`](README.md#provera-produkcionog-builda-lokalno).

## 5. Bezbednosni headeri

CSP, `nosniff`, `Referrer-Policy` i `Permissions-Policy` za `web` i `admin` postavlja
nginx: [`infra/nginx/security-headers.conf`](infra/nginx/security-headers.conf).
Za `api` ih postavlja `helmet`.

Dve odluke koje se lako „isprave" pogrešno:

- **`style-src` ima `'unsafe-inline'`, i to mora.** Pet komponenti koristi `style={{ }}`
  (pozicije hero kartica, širine traka napretka, gradijenti) — to su inline `style`
  atributi koje CSP inače blokira. **`script-src` je ostao strog**, jer tamo
  `'unsafe-inline'` čini celu politiku besmislenom, i to je ono što Lighthouse meri.
- **HSTS se ne postavlja ručno.** `.dev` je na HSTS preload listi pretraživača, pa HTTP
  na ovom domenu ionako ne postoji.

`connect-src` mora da sadrži adresu API-ja. Ona se u nginx config upisuje `sed`-om iz
build arg-a `VITE_API_URL` — ako se te dve vrednosti raziđu, app zove adresu koju CSP
blokira, i to se vidi **samo** u konzoli, ne u mrežnom tabu.

## 6. Keširanje

| Putanja       | Politika                    | Zašto                                             |
| ------------- | --------------------------- | ------------------------------------------------- |
| `/assets/*`   | `1y, immutable`             | Vite stavlja heš u ime — nova verzija je novo ime |
| `/fonts/*`    | `1y, immutable`             | **nemaju heš** (`dm-sans-latin.woff2`)            |
| `/index.html` | `no-cache, must-revalidate` | jedini fajl koji zna koja je trenutna verzija     |
| `/404.html`   | `no-cache, must-revalidate` | isti razlog — to je isti shell                    |

Posledica za fontove: **promena fonta traži promenu imena fajla.** Inače posetioci sa
keširanom verzijom neću videti novi font godinu dana.

## 7. SEO fajlovi

`robots.txt` **mora** postojati kao statični fajl — bez njega SPA fallback servira
`index.html` na `/robots.txt`, pa crawler dobije HTML i svaku liniju prijavi kao
neispravnu direktivu. `try_files` u nginx-u prvo traži pravi fajl, pa je samo prisustvo
fajla popravka.

`sitemap.xml` **nije u repou** — gradi ga `scripts/build-sitemap.mjs` kao `prebuild` u
`apps/web`, čitajući rute i slug-ove projekata iz koda. Ručno pisan bi zastario čim se
doda projekat, i to tiho.

**Statični HTML po ruti** gradi `scripts/build-seo-pages.mjs` kao `postbuild` u `apps/web`.
Kopira `dist/index.html` po ruti i menja samo `<head>`: naslov, opis, `canonical`, `og:*` i
JSON-LD. Sadržaj i dalje crta JS.

Postoji zbog pregleda linkova: Googlebot renderuje JavaScript, ali **LinkedIn, WhatsApp,
Slack i X ne** — oni čitaju sirov HTML. Bez ovog koraka svaka podeljena studija slučaja
pokazuje karticu početne strane. Spisak ruta i i18n ključeva deli sa `apps/web/src/lib/seo.ts`,
isti koji čita `useDocumentHead` — da se runtime i build ne raziđu.

`canonical` i `og:url` postavlja `useDocumentHead` **po ruti**. Statična vrednost u
`index.html` bi važila za svaku rutu i rekla pretraživaču da su `/projects`, `/contact` i
`/uses` duplikati početne — dakle izbacila ih iz indeksa.

**Nepostojeća adresa vraća kod 404**, ne `index.html` sa 200. Telo odgovora je i dalje SPA
(`dist/404.html`, isti shell bez `canonical`-a), pa React crta našu 404 stranicu. Ranije je
svaka stara ili pogrešna adresa dobijala 200 i `canonical` početne, pa ih je Search Console
brojao kao „soft 404" i duplikate. Adresa sa kosom crtom na kraju (`/projects/`) preusmerava
se 301 na istu bez nje.

Cena: projekat objavljen u admin-u na direktnom učitavanju vraća 404 kod dok se `web` ne
rebuilduje, jer njegov HTML još ne postoji. Posetilac vidi stranicu normalno, a pretraživač
ga do tada ne zna, jer sitemap nastaje u istom koraku.

`admin` image sam sebi dodaje `X-Robots-Tag: noindex, nofollow`.

## 8. Migracije

Pokreće ih Coolify **pre-deployment komandom** na resursu `api`:

```
./node_modules/.bin/prisma migrate deploy
```

Ne u `CMD`-u: tamo bi se izvršavale na svaki restart kontejnera i na svaku repliku
paralelno.

Nova migracija se pravi lokalno, uz pokrenut Postgres:

```bash
pnpm --filter api migrate:dev --name opis_promene
```

Fajl koji nastane u `apps/api/prisma/migrations/` se **commit-uje**. Bez njega
`migrate deploy` na serveru prođe bez greške i ne napravi ništa.

**Migracije treba da budu unazad kompatibilne.** Rollback koda je jedan klik, rollback
migracije nije — dodaj kolonu u jednom deployu, prestani da je koristiš u sledećem,
obriši je u trećem.

## 9. Rollback

Coolify → resurs → **Deployments** → prethodni uspešan build → **Redeploy**.
Sekunde, image već postoji.
