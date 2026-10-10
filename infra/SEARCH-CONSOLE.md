# Google Search Console — posle deploy-a

Radi se **posle** prvog puštanja nove aplikacije (`infra/COOLIFY.md` §5), kad
`https://cloudsheep.dev` vraća novi sajt. Sve korake radiš ti, jer traže tvoj Google nalog.

Šta sajt sada izlaže pretraživačima (ADR 0012, dopuna):

| Adresa | Ponašanje |
| --- | --- |
| `/`, `/projects`, `/projects/<slug>`, `/notes`, `/notes/<slug>`, `/contact` | indeksira se; canonical na samu sebe |
| `/sr/…` | `noindex, follow` — vidi se u pretrazi samo engleski |
| `/admin…`, `/api/…` | `X-Robots-Tag: noindex, nofollow` + `Disallow` u `robots.txt` |
| `admin.cloudsheep.dev` | 301 → `cloudsheep.dev/admin` |
| `api.cloudsheep.dev` | samo stare `/uploads/…` slike; sve ostalo 301 → `cloudsheep.dev` |
| `www.cloudsheep.dev` | redirect na golu adresu (Coolify) |
| `/contact/` (kosa crta) | 308 → `/contact` |
| `/uses` | 301 → `/#stack` |
| nepostojeća adresa | pravi **404** (ranije 200 + stranica greške) |
| `/sitemap.xml` | samo engleske adrese, iz baze, osvežava se bez deploy-a |

## 1. Svojstvo (property) — jednom

Najbolje je **Domain** svojstvo: pokriva `https`, `www` i sve poddomene jednim potvrđivanjem.

1. https://search.google.com/search-console → **Add property** → **Domain** → `cloudsheep.dev`.
2. Google prikaže **TXT** zapis (`google-site-verification=…`). Kopiraj ga.
3. Cloudflare → `cloudsheep.dev` → **DNS → Records → Add record**: Type `TXT`, Name `@`,
   Content = vrednost iz koraka 2, TTL Auto. (Proxy kolona ne postoji za TXT.)
4. Nazad u Search Console → **Verify**. Ako ne prođe odmah, sačekaj 5–30 minuta.
   Provera sa računara: `dig +short TXT cloudsheep.dev`.

Ako svojstvo već postoji (staro, za SPA), ne pravi novo: podaci i istorija ostaju.

## 2. Sitemap

**Indexing → Sitemaps** → upiši `sitemap.xml` → **Submit**.

- Ako postoji stari sitemap (iz Vite verzije), ostavi ga. Ista adresa sada vraća novi sadržaj.
- Status treba da bude **Success**, a broj „Discovered pages" jednak broju javnih stranica
  (početna, projekti, beleške, kontakt + svaki objavljen projekat i beleška).

Provera pre slanja:

```bash
curl -s https://cloudsheep.dev/robots.txt
curl -s https://cloudsheep.dev/sitemap.xml | grep -c "<loc>"
curl -s https://cloudsheep.dev/sitemap.xml | grep "/sr"     # mora biti prazno
```

## 3. Zatraži indeksiranje ključnih stranica

**URL inspection** (polje na vrhu) → nalepi adresu → **Request indexing**. Google dozvoljava
oko 10 zahteva dnevno, pa idi ovim redom:

1. `https://cloudsheep.dev/`
2. `https://cloudsheep.dev/projects`
3. `https://cloudsheep.dev/contact`
4. `https://cloudsheep.dev/notes`
5. svaki `https://cloudsheep.dev/projects/<slug>` (studije slučaja)

Pre zahteva klikni **Test live URL** → **View tested page → Screenshot / HTML**. Mora se videti
pun sadržaj (render na serveru), a ne prazna stranica. Upravo to je ranije padalo kod SPA.

## 4. Stari problemi iz izveštaja

Search Console je ranije prijavljivao „adrese" kao `react-vendor-….js:9:70789` (iz teksta
greške koji je SPA prikazivala Googlebot-u) i duplikate sa kosom crtom.

- Te adrese sada vraćaju **404**, pa ih Google sam izbacuje u narednim nedeljama. **Ništa ne
  radi** (ne traži uklanjanje), osim ako neka od njih i dalje stoji u rezultatima pretrage.
  Tada: **Indexing → Removals → New request** za tu adresu.
- U izveštaju **Indexing → Pages**, posle 3–7 dana:
  - „Excluded by ‘noindex’ tag" za `/sr/…` je **očekivano**.
  - „Page with redirect" za `www`, `/contact/` i `/uses` je **očekivano**.
  - „Not found (404)" za stare `…js:9:…` adrese je **očekivano**.
  - „Crawled – currently not indexed" za ključne stranice znači da treba čekati, ili
    ponoviti korak 3 posle nedelju dana.
- Na prijavljenu grešku klikni **Validate fix**, da Google ponovo proveri.

## 5. Šta pratiti

| Kada | Gde | Šta |
| --- | --- | --- |
| 2–3 dana | Sitemaps | status Success, broj adresa |
| 1 nedelja | Pages | ključne stranice „Indexed" |
| 2–4 nedelje | Performance | upiti, prikazi i klikovi za „cloudsheep" |
| 28 dana | Core Web Vitals | mobilni LCP/INP/CLS „Good" (potrebno dovoljno posetilaca) |

Novi projekat ili beleška ulaze u sitemap čim se objave u admin-u. Za brže indeksiranje
uradi korak 3 za njihovu adresu.

## 6. Opciono: Bing

https://www.bing.com/webmasters → **Import from Google Search Console**. Preuzima svojstvo i
sitemap u dva klika, a Bing pokriva i DuckDuckGo i ChatGPT pretragu.
