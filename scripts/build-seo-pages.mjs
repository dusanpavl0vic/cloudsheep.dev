#!/usr/bin/env node
/**
 * Piše statični HTML po ruti, sa pravim naslovom, opisom, `canonical`-om i JSON-LD-om.
 *
 * **Zašto uopšte.** Sajt je SPA bez SSR-a: `dist/index.html` je jedan fajl koji se servira
 * na svakoj adresi, pa svaka ruta ima isti `<title>` i isti opis dok se JS ne izvrši.
 * Googlebot renderuje i to preživi, ali **pregled linka ne renderuje ništa** — LinkedIn,
 * WhatsApp, Slack i X čitaju samo sirov HTML. Posledica: podeliš studiju slučaja, a u
 * pregledu se vidi početna.
 *
 * Skripta ne pravi SSR i ne renderuje React. Ona kopira `index.html` po ruti i menja samo
 * `<head>`. Sadržaj i dalje crta JS — meta oznake više ne čekaju na njega.
 *
 * Spisak ruta i ključeva dolazi iz `apps/web/src/lib/seo.ts`, isti koji čita i
 * `useDocumentHead`. Slug-ovi projekata sa API-ja, kao u `build-sitemap.mjs`.
 *
 * Kači se kao `postbuild` u `apps/web`, dakle posle `vite build`.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://cloudsheep.dev'
const DIST = path.join(ROOT, 'apps/web/dist')
const LOCALE = path.join(ROOT, 'apps/web/src/locales/sr.json')
const SEO_FILE = path.join(ROOT, 'apps/web/src/lib/seo.ts')

const API_URL = process.env.VITE_API_URL

/** Ključevi se čitaju regexom iz `seo.ts` — skripta radi u golom node-u, bez build koraka. */
function routeKeys() {
  const src = readFileSync(SEO_FILE, 'utf8')
  const block = /export const SEO_BY_ROUTE[^{]*\{([\s\S]*?)\n\}/.exec(src)
  if (!block) throw new Error('ne mogu da pročitam SEO_BY_ROUTE iz lib/seo.ts')

  return [...block[1].matchAll(/'([^']+)':\s*\{\s*titleKey:\s*'([^']+)',\s*descriptionKey:\s*'([^']+)'/g)]
    .map(([, route, titleKey, descriptionKey]) => ({ route, titleKey, descriptionKey }))
}

const dig = (obj, dotted) => dotted.split('.').reduce((acc, k) => acc?.[k], obj)

/** Studije slučaja — naslov i opis iz baze, isti izvor koji sajt zove u runtime-u. */
async function projectPages() {
  if (!API_URL) {
    console.warn('build-seo-pages: VITE_API_URL nije postavljen — bez stranica projekata')
    return []
  }

  try {
    const res = await fetch(`${API_URL}/projects`)
    if (!res.ok) throw new Error(`API je vratio ${res.status}`)
    const body = await res.json()
    const items = Array.isArray(body) ? body : (body.items ?? [])

    return items.map((p) => ({
      route: `/projects/${p.slug}`,
      title: `${p.title?.sr ?? p.slug} — CloudSheep`,
      description: p.desc?.sr ?? '',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: p.title?.sr ?? p.slug,
        description: p.desc?.sr ?? '',
        url: `${SITE}/projects/${p.slug}`,
        author: { '@type': 'Organization', name: 'CloudSheep' },
      },
    }))
  } catch (error) {
    console.warn(`build-seo-pages: projekti nisu dohvaćeni (${error.message})`)
    return []
  }
}

/** Vizit-karta studija. Ide samo na početnu — ponovljena na svakoj ruti nije dodatni signal. */
const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'CloudSheep',
  url: SITE,
  logo: `${SITE}/og.png`,
  image: `${SITE}/og.png`,
  areaServed: 'Worldwide',
  address: { '@type': 'PostalAddress', addressLocality: 'Niš', addressCountry: 'RS' },
  knowsLanguage: ['sr', 'en'],
  sameAs: ['https://github.com/dusanpavl0vic'],
}

const escape = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Menja SAMO `<head>`; telo dokumenta ostaje netaknuto. */
function render(html, { route, title, description, jsonLd }) {
  const url = `${SITE}${route}`
  let out = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${escape(description)}" />`,
    )
    .replace(
      /<meta\s+property="og:title"[\s\S]*?\/>/,
      `<meta property="og:title" content="${escape(title)}" />`,
    )
    .replace(
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${escape(description)}" />`,
    )

  /*
   * Prvo se briše ono što je možda već ubačeno, pa se ubacuje ponovo. Bez ovog koraka
   * drugo pokretanje nad istim `dist`-om ostavlja DVA `canonical`-a sa različitim adresama,
   * a na dva različita `canonical`-a Google ignoriše oba. `vite build` doduše svaki put
   * prepiše `index.html` iz izvora, pa se to u pravom buildu ne dešava — ali skripta se
   * pokreće i ručno, i tada je razlika nevidljiva u izlazu a vidljiva pretraživaču.
   */
  out = out
    .replace(/\s*<link rel="canonical"[^>]*>/g, '')
    .replace(/\s*<meta property="og:url"[^>]*>/g, '')
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')

  const injected = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:url" content="${url}" />`,
    jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : '',
  ]
    .filter(Boolean)
    .join('\n    ')

  return out.replace('</head>', `  ${injected}\n  </head>`)
}

const html = readFileSync(path.join(DIST, 'index.html'), 'utf8')
const locale = JSON.parse(readFileSync(LOCALE, 'utf8'))

const staticPages = routeKeys().map(({ route, titleKey, descriptionKey }) => ({
  route,
  title: dig(locale, titleKey),
  description: dig(locale, descriptionKey),
  ...(route === '/' ? { jsonLd: HOME_JSON_LD } : {}),
}))

const missing = staticPages.filter((p) => !p.title || !p.description)
if (missing.length > 0) {
  throw new Error(`nedostaju seo prevodi za: ${missing.map((p) => p.route).join(', ')}`)
}

const pages = [...staticPages, ...(await projectPages())]

for (const page of pages) {
  /*
   * `/projects` → `dist/projects.html`, NE `dist/projects/index.html`.
   *
   * Sa `index.html` u folderu nginx vidi direktorijum i po pravilu preusmerava `/projects`
   * na `/projects/` — a `canonical` i `sitemap.xml` govore adresu bez kose crte. Ispadne da
   * adresa iz sitemapa preusmerava na drugu adresu, što je zbrka koja se šalje u indeks.
   *
   * Uz `try_files $uri $uri.html …` u `spa.conf` fajl se servira direktno, bez skoka.
   */
  const target =
    page.route === '/'
      ? path.join(DIST, 'index.html')
      : path.join(DIST, `${page.route.replace(/^\//, '')}.html`)

  mkdirSync(path.dirname(target), { recursive: true })
  writeFileSync(target, render(html, page))
}

console.log(`build-seo-pages: ${pages.length} stranica (${pages.length - staticPages.length} projekata)`)
