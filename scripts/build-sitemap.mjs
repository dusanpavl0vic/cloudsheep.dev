#!/usr/bin/env node
/**
 * Gradi `apps/web/public/sitemap.xml` iz izvora istine, umesto da se piše rukom.
 *
 * Ručno pisan sitemap zastari čim se doda projekat, i to tiho — niko ne primeti da nova
 * studija slučaja nikad nije prijavljena pretraživaču. Zato se rute i slug-ovi čitaju iz
 * koda i skripta se kači kao `prebuild`, pa je izlaz tačan po definiciji.
 *
 * Čitanje ide regexom, a ne importom: fajlovi su TypeScript, a skripta mora da radi u golom
 * node-u bez build koraka. Isti obrazac već koristi `check-tech-icons.mjs`.
 *
 * Pada glasno ako ne nađe ništa — prazan sitemap je gori od nikakvog, jer izgleda ispravno.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Putanje se vezuju za lokaciju SKRIPTE, ne za cwd: kači se kao `prebuild` u `apps/web`,
// pa se pokreće odande, a ne iz korena repoa.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const SITE = 'https://cloudsheep.dev'
const ROUTES_FILE = 'apps/web/src/lib/routes.ts'
const PROJECTS_FILE = 'apps/web/src/features/projects/projects.constants.ts'
const OUT = 'apps/web/public/sitemap.xml'

const read = (file) => readFileSync(path.join(ROOT, file), 'utf8')

/** Statične rute — bez parametarskih (`:slug`) i bez catch-all (`*`). */
function staticRoutes() {
  const block = /export const ROUTES = \{([\s\S]*?)\} as const/.exec(read(ROUTES_FILE))
  if (!block) throw new Error(`ne mogu da pročitam ROUTES iz ${ROUTES_FILE}`)

  return [...block[1].matchAll(/:\s*'([^']+)'/g)]
    .map((m) => m[1])
    .filter((route) => route.startsWith('/') && !route.includes(':'))
}

/** Studije slučaja — jedna URL po projektu. */
function projectRoutes() {
  const slugs = [...read(PROJECTS_FILE).matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
  return slugs.map((slug) => `/projects/${slug}`)
}

const paths = [...new Set([...staticRoutes(), ...projectRoutes()])]

if (paths.length < 2) {
  console.error(`❌ sitemap: nađeno samo ${String(paths.length)} ruta — regex verovatno ne hvata`)
  process.exit(1)
}

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

console.log(`✅ sitemap: ${String(paths.length)} ruta → ${OUT}`)
