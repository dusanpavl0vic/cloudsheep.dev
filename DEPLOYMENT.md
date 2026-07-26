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

Aplikacija čita env samo na jednom mestu: `src/constants/config.ts`.
Tipovi su u `src/vite-env.d.ts`, a ugovor (spisak svih promenljivih) u
`.env.example`.

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

Za `dev` grana namerno nema svoju vrednost — `APP_CONFIG` pada na
`'development'` (`src/constants/config.ts`).

Kad backend dobije adrese, dodaj `VITE_API_URL` na isti način (Production za
`prod`, Preview + grana `main` za test).

## 3. Vercel — jedan projekat, dva okruženja

Projekat: **`cloudsheep`** (`dusanpavl0vics-projects`), vezan na
`dusanpavl0vic/cloudsheep.dev`.

| Okruženje  | Branch Tracking  | Čemu služi                           |
| ---------- | ---------------- | ------------------------------------ |
| Production | `prod`           | produkcija                           |
| Preview    | sve ostale grane | test (`main`), pregled feature grana |

Build config dolazi iz `vercel.json` u repou (`framework: vite`,
`buildCommand: npm run build`, `outputDirectory: dist`, SPA rewrite).
`vercel.json` ima prioritet nad dashboard podešavanjima, pa se build ne može
razminuti sa kodom.

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
