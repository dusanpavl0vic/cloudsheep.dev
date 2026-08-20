#!/usr/bin/env node
/**
 * Gradi `apps/web/public/sitemap.xml` iz izvora istine, umesto da se piše rukom.
 *
 * Ručno pisan sitemap zastari čim se doda projekat, i to tiho — niko ne primeti da nova
 * studija slučaja nikad nije prijavljena pretraživaču. Zato se rute i slug-ovi čitaju iz
 * koda i skripta se kači kao `prebuild`, pa je izlaz tačan po definiciji.
 *
 * Statične rute se čitaju regexom iz `routes.ts` — fajl je TypeScript, a skripta mora da
 * radi u golom node-u bez build koraka.
 *
 * **Slug-ovi projekata više NISU u kodu** nego u bazi, pa se povlače sa API-ja. Ranije su
 * se čitali iz `projects.constants.ts`; kad su projekti prešli u bazu, regex je prestao da
 * hvata bilo šta, a provera „bar 2 rute" je i dalje prolazila sa četiri statične — dakle
 * sitemap bi tiho izašao bez ijedne studije slučaja. To je tačno greška zbog koje ova
 * skripta postoji, pa su provere sada dve i odvojene.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Putanje se vezuju za lokaciju SKRIPTE, ne za cwd: kači se kao `prebuild` u `apps/web`,
// pa se pokreće odande, a ne iz korena repoa.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const SITE = 'https://cloudsheep.dev'
const ROUTES_FILE = 'apps/web/src/lib/routes.ts'
const OUT = 'apps/web/public/sitemap.xml'

/** Isti izvor koji sajt zove u runtime-u. U Coolify-u je to Build Variable za `web`. */
const API_URL = process.env.VITE_API_URL
/** Produkcioni build MORA da dohvati projekte; lokalni sme bez API-ja. */
const IS_PRODUCTION_BUILD = process.env.NODE_ENV === 'production' || process.env.CI === 'true'

const read = (file) => readFileSync(path.join(ROOT, file), 'utf8')

/** Statične rute — bez parametarskih (`:slug`) i bez catch-all (`*`). */
function staticRoutes() {
  const block = /export const ROUTES = \{([\s\S]*?)\} as const/.exec(read(ROUTES_FILE))
  if (!block) throw new Error(`ne mogu da pročitam ROUTES iz ${ROUTES_FILE}`)

  return [...block[1].matchAll(/:\s*'([^']+)'/g)]
    .map((m) => m[1])
    .filter((route) => route.startsWith('/') && !route.includes(':'))
}

/** Studije slučaja — jedna URL po objavljenom projektu, sa API-ja. */
async function projectRoutes() {
  if (!API_URL) {
    if (IS_PRODUCTION_BUILD) {
      console.error('❌ sitemap: VITE_API_URL nije postavljen, a ovo je produkcioni build')
      process.exit(1)
    }
    console.warn('⚠️  sitemap: VITE_API_URL nije postavljen — pišem samo statične rute')
    return []
  }

  try {
    const response = await fetch(`${API_URL}/projects`)
    if (!response.ok) throw new Error(`HTTP ${String(response.status)}`)

    const { items } = await response.json()
    return items.map(({ slug }) => `/projects/${slug}`)
  } catch (error) {
    // Nedostupan API u produkcionom buildu OBARA build. Alternativa je tiho isporučen
    // sitemap bez ijednog projekta, što je greška koja se ne primeti mesecima.
    if (IS_PRODUCTION_BUILD) {
      console.error(`❌ sitemap: API nedostupan (${error.message})`)
      process.exit(1)
    }
    console.warn(`⚠️  sitemap: API nedostupan (${error.message}) — pišem samo statične rute`)
    return []
  }
}

const statics = staticRoutes()
const projects = await projectRoutes()

// Dve odvojene provere, ne jedna zbirna: zbirna je prolazila i kad projekata nema nijednog.
if (statics.length < 4) {
  console.error(`❌ sitemap: samo ${String(statics.length)} statičnih ruta — regex ne hvata`)
  process.exit(1)
}

if (projects.length === 0 && IS_PRODUCTION_BUILD) {
  console.error('❌ sitemap: nijedan projekat sa API-ja u produkcionom buildu')
  process.exit(1)
}

const paths = [...new Set([...statics, ...projects])]

/** Početna je najvažnija, studije slučaja najmanje — grubo, ali to je sve što priority znači. */
const priorityOf = (route) =>
  route === '/' ? '1.0' : route.startsWith('/projects/') ? '0.6' : '0.8'

const body = paths
  .map(
    (route) =>
      `  <url>\n    <loc>${SITE}${route}</loc>\n    <priority>${priorityOf(route)}</priority>\n  </url>`,
  )
  .join('\n')

writeFileSync(path.join(ROOT, OUT), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`)

console.log(
  `✅ sitemap: ${String(statics.length)} statičnih + ${String(projects.length)} projekata → ${OUT}`,
)
