# Deployment

Kako su podeljene grane, okruženja i Vercel okruženja.

## 1. Grane

| Grana  | Okruženje   | Namena                                      | Deploy na Vercelu     |
| ------ | ----------- | ------------------------------------------- | --------------------- |
| `dev`  | development | Default grana, integracija feature-a        | Preview (bez env var) |
| `main` | test        | Testna instanca (QA, deljenje sa klijentom) | Preview               |
| `prod` | production  | Živa produkcija                             | Production            |

Tok promena je uvek u jednom smeru:

```
feature/* → dev → main (test) → prod (produkcija)
```

`dev` je default grana na GitHubu — svi PR-ovi feature grana idu u `dev`.
Promocija dalje ide merge-om `dev → main`, pa `main → prod`. Nikad ne
commit-uj direktno u `main` ili `prod`.

## 2. Env promenljive

Tipovi su u `apps/web/src/vite-env.d.ts`, a ugovor (spisak svih promenljivih) u
`apps/web/.env.example`.

> **Trenutno ih nijedan modul ne čita.** `lib/config.ts` je čitao `VITE_API_URL` za RTKQ,
> ali je obrisan zajedno sa `baseApi`-jem — `apps/web` nema nijedan endpoint. Deklaracije
> su namerno zadržane: `VITE_APP_ENV` je i dalje ugovor sa Vercelom (tabela ispod), a
> `VITE_API_URL` čeka backend. Kad se prvi endpoint pojavi, čitanje ide kroz `createEnv`
> iz `@app/utils` (`docs/14`), ne kroz goli `import.meta.env`.

Samo promenljive sa `VITE_` prefiksom stižu do klijenta. **Te vrednosti se
ugrađuju u JS bundle i javno su čitljive — nikad tajne u njima.**

| Promenljiva    | development (lokalno)       | test (`main`) | production (`prod`) |
| -------------- | --------------------------- | ------------- | ------------------- |
| `VITE_APP_ENV` | `development`               | `test`        | `production`        |
| `VITE_API_URL` | `http://localhost:3000/api` | test API URL  | produkcioni API URL |

URL-ovi za test/produkciju su placeholderi — upiši prave kad backend dobije
adrese.

### Lokalno

```bash
cp .env.example .env
```

`.env` i `.env.*` su u `.gitignore` (osim `.env.example`) — ne komituju se.

### Na Vercelu

Vrednosti se ne komituju, nego se postavljaju u
**Settings → Environment Variables**. Vercelove env promenljive imaju prioritet
nad `.env` fajlovima u repou, pa je dashboard izvor istine za deployovana
okruženja.

Trenutno postavljeno:

| Promenljiva    | Vrednost     | Scope                  |
| -------------- | ------------ | ---------------------- |
| `VITE_APP_ENV` | `production` | Production             |
| `VITE_APP_ENV` | `test`       | Preview → grana `main` |

Za `dev` granu namerno nema vrednosti. Dok je ne pročita nijedan modul to ništa
ne menja; kad se čitanje uvede, `createEnv` treba da padne na `'development'`.

Kad backend dobije adrese, dodaj `VITE_API_URL` na isti način (Production za
`prod`, Preview + grana `main` za test).

## 3. Vercel — jedan projekat, dva okruženja

Projekat: **`cloudsheep`** (`dusanpavl0vics-projects`), vezan na
`dusanpavl0vic/cloudsheep.dev`.

| Okruženje  | Branch Tracking  | Čemu služi                           |
| ---------- | ---------------- | ------------------------------------ |
| Production | `prod`           | produkcija                           |
| Preview    | sve ostale grane | test (`main`), pregled feature grana |

### Build config

Sve stoji u **`vercel.json` na korenu repoa**, i to je jedini `vercel.json`:

```json
{
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm turbo run build --filter=web",
  "outputDirectory": "apps/web/dist",
  "framework": null
}
```

`vercel.json` ima prioritet nad dashboard podešavanjima, pa se build ne može
razminuti sa kodom.

> **Root Directory na Vercelu mora ostati koren repoa** (prazno polje), ne `apps/web`.
> Vercel čita `vercel.json` **samo iz svog Root Directory-ja** — konfiguracija u podmapi
> se prosto ne vidi. Ovo je već jednom palo: `apps/web/vercel.json` je bio ispravan za
> stanje pre monorepo-a, Vercel ga nije ni pročitao, sam detektovao pnpm i turbo, build
> **uspeo**, pa se srušio na traženju `dist` na korenu — otud poruka
> „No Output Directory named `dist` found after the Build completed".

Četiri stvari koje su posledica monorepo-a i ne smeju se „pojednostaviti" nazad:

| Zašto tako                       | Šta bi se desilo drugačije                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| `pnpm install`, ne `npm install` | zavisnosti su `workspace:*` — to je pnpm protokol, npm ga ne razume i pada na instalaciji  |
| `--filter=web`                   | gradi `web` i svih 9 paketa od kojih zavisi, a preskače `admin`                            |
| `outputDirectory: apps/web/dist` | build po definiciji piše u paket, ne na koren                                              |
| `framework: null`                | koren repoa nije Vite projekat; auto-detekcija bi tražila `vite.config` na pogrešnom mestu |

### Bezbednosni headeri

`vercel.json` postavlja CSP, HSTS, `nosniff`, `Referrer-Policy` i `Permissions-Policy`.
Dve odluke koje se lako „isprave" pogrešno:

- **`style-src` ima `'unsafe-inline'`, i to mora.** Pet komponenti koristi `style={{ }}`
  (pozicije hero kartica, širine traka napretka, gradijenti) — to su inline `style` atributi
  koje CSP inače blokira. **`script-src` je ostao strog**, jer tamo `'unsafe-inline'` čini
  celu politiku besmislenom, i to je ono što Lighthouse zapravo meri.
- **`https://vercel.live` je namerno dozvoljen** u `script-src`, `connect-src` i `frame-src`.
  Bez toga preview traka prestane da radi na svakom preview deployment-u. Cena: i produkcija
  dozvoljava taj host, iako ga tamo nema.

Fontovi dobijaju `Cache-Control: immutable` na godinu dana jer **nemaju heš u imenu**
(`dm-sans-latin.woff2`), pa ih Vercel ne kešira agresivno sam. Posledica: promena fonta traži
promenu imena fajla.

### `noindex` na preview-u je očekivan

Lighthouse na preview URL-u prijavljuje „Page is blocked from indexing" zbog
`x-robots-tag: noindex`. **To Vercel dodaje sam, svim preview deployment-ima**, da testne
verzije ne završe u pretrazi. Na `prod` grani ga nema.

Ne treba ga „popravljati" — svaki pokušaj bi značio da se testne verzije indeksiraju.

### SEO fajlovi

`robots.txt` **mora** postojati kao statični fajl: bez njega catch-all rewrite servira
`index.html` na `/robots.txt`, pa crawler dobije HTML i svaku liniju prijavi kao neispravnu
direktivu. Vercel servira postojeći fajl pre rewrite-a, pa je samo prisustvo fajla popravka.

`sitemap.xml` **nije u repou** — gradi ga `scripts/build-sitemap.mjs` kao `prebuild` u
`apps/web`, čitajući rute i slug-ove projekata iz koda. Ručno pisan bi zastario čim se doda
projekat, i to tiho.

`canonical` i `og:url` postavlja `useDocumentHead` **po ruti**. Statična vrednost u
`index.html` bi važila za svaku rutu i rekla pretraživaču da su `/projects`, `/contact` i
`/uses` duplikati početne — dakle izbacila ih iz indeksa.

### Zašto test nije imenovano okruženje

Vercel ima **Create Environment** (custom environments), čime bi `test` bio
prvorazredno imenovano okruženje sa svojim domenom. To je **Pro funkcija** — na
Hobby planu dialog nudi samo „Upgrade to Pro". Zato test radi kroz Preview
okruženje vezano na `main`, sa env varijablom scope-ovanom na tu granu.

`main` se ne „dodaje" u Preview — Preview hvata svaku granu koja ne pripada
drugom okruženju, pa je `main` automatski unutra. Branch Tracking polje za
Preview je fiksirano na „All unassigned branches" i ne menja se.

Praktična razlika prema imenovanom okruženju: test nema sopstveni lep domen,
nego stabilan Vercelov branch URL za `main` (vidi ga na strani deployment-a
posle prvog builda).

### Domen za test

Domen se može zakačiti na `main` i bez Pro plana:
**Settings → Environments → Preview → Domains → Add Domain**, gde se pored
domena bira i **Preview Branch = `main`**.

Uslov je da domen postoji u nalogu — trenutno je Domains lista projekta prazna,
pa `cloudsheep.dev` prvo treba dodati (**Add Existing** uz preusmeravanje DNS-a
na Vercel, ili **Buy** kroz Vercel). Tek onda ima šta da se veže za granu.

### Pristup test instanci

**Settings → Deployment Protection → Vercel Authentication** je uključen
(Standard Protection). To znači da preview deployment-i — dakle i test —
traže Vercel login. Za tebe radi bez problema; ako test treba da otvori neko
van naloga (klijent, tester), isključi Vercel Authentication. Namerno nije
dirano jer bi ih to učinilo javno dostupnim.

### Ako pređeš na Pro

Napravi custom environment `test` sa Branch Tracking = `main`, prebaci
`VITE_APP_ENV=test` sa Preview/`main` na to okruženje i zakači mu domen.
Ostalo (grane, `vercel.json`, kod) ostaje isto.

## 4. Redosled prvog puštanja

1. Merge PR-a sa `vercel.json` u `dev`.
2. Merge `dev → main` (na `main` je do sad stajao samo `README.md`) → prvi
   test deployment.
3. Merge `main → prod` → prvi produkcioni deployment.
4. Redeploy **bez** build cache-a ako build koristi staru konfiguraciju.

Napomena: posle preimenovanja projekta stari alias `cloudsheep-dev.vercel.app`
ostaje zakačen uz nove domene — Vercel ne briše stare aliase sam.
