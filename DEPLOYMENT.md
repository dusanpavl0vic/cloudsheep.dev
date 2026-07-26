# Deployment

Kako su podeljene grane, okruženja i Vercel instance.

## 1. Grane

| Grana  | Okruženje   | Namena                                      | Deploy            |
| ------ | ----------- | ------------------------------------------- | ----------------- |
| `dev`  | development | Default grana, integracija feature-a        | ne deployuje se   |
| `main` | test        | Testna instanca (QA, deljenje sa klijentom) | Vercel projekt #2 |
| `prod` | production  | Živa produkcija                             | Vercel projekt #1 |

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

Vrednosti se ne komituju, nego se postavljaju u svakom projektu:
**Settings → Environment Variables**, scope **Production**.

Vercelove env promenljive imaju prioritet nad `.env` fajlovima u repou, pa je
dashboard izvor istine za deployovana okruženja.

## 3. Vercel — dve instance

Jedan repo, dva Vercel projekta. Razlog: Vercel ima **jednu production granu
po projektu**, pa je drugi projekt jedini način da `main` bude prava instanca
(svoj domen, svoje env varijable, bez preview zaštite) a ne preview deployment.

Build config za oba dolazi iz `vercel.json` u repou (`framework: vite`,
`buildCommand: npm run build`, `outputDirectory: dist`, SPA rewrite), tako da
ga ne treba podešavati po projektu — i ne može da se razmine sa kodom.

### Projekt #1 — produkcija

| Setting                            | Vrednost                  |
| ---------------------------------- | ------------------------- |
| Settings → Git → Production Branch | `prod`                    |
| Domains                            | `cloudsheep.dev`          |
| Env vars (Production)              | `VITE_APP_ENV=production` |

### Projekt #2 — test

| Setting                            | Vrednost              |
| ---------------------------------- | --------------------- |
| Settings → Git → Production Branch | `main`                |
| Domains                            | `test.cloudsheep.dev` |
| Env vars (Production)              | `VITE_APP_ENV=test`   |

### Da se ne duplaju build-ovi

Po defaultu svaki projekt gradi **svaku** granu (production granu kao
production, ostale kao preview). Bez ovoga bi push na `dev` pokretao build u
oba projekta. U **Settings → Git → Ignored Build Step** svakog projekta
stavi Command:

Projekt #1 (produkcija):

```bash
[ "$VERCEL_GIT_COMMIT_REF" = "prod" ] && exit 1 || exit 0
```

Projekt #2 (test):

```bash
[ "$VERCEL_GIT_COMMIT_REF" = "main" ] && exit 1 || exit 0
```

Semantika je obrnuta od očekivane: **exit 1 = gradi, exit 0 = preskoči.**

### Alternativa (jedan projekt)

Ako ne želiš dva projekta: jedan projekt sa Production Branch = `prod`, a
`main` dobija preview deployment kojem se dodeli fiksan domen (Domains → dodaj
domen → veži za granu `main`). Manje podešavanja, ali preview deployment-i su
na Vercelu podrazumevano zaštićeni login-om i env varijable se dele između
svih preview grana (osim ako se ne prave per-branch override-i).

## 4. Redosled prvog puštanja

1. Merge PR-a sa `vercel.json` u `dev`.
2. Merge `dev → main` (na `main` trenutno stoji samo `README.md`).
3. Merge `main → prod`.
4. Podesi oba Vercel projekta po tabelama iznad.
5. Redeploy **bez** build cache-a u oba.
