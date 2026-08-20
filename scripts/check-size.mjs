#!/usr/bin/env node
/**
 * Bundle budžeti (`apps/web/CLAUDE.md`).
 *
 * Postoji zato što je `pnpm size` do sada bio **prazan hod**: root skripta je zvala
 * `turbo run size`, nijedan workspace nije definisao `size`, pa je turbo pokretao samo
 * `build` iz `dependsOn` i javljao uspeh. `pnpm validate` ga zove kao poslednji korak —
 * dakle validacija je prolazila proveru budžeta a da ništa nije izmerila.
 *
 * **Šta je „initial" čita se iz `dist/index.html`, ne iz imena fajlova.** Ranije merenje
 * je nagađalo po prefiksima (`index`, `react-vendor`, `redux-vendor`, `rolldown-runtime`,
 * `src`) i time je propuštalo sve što Vite doda kao `modulepreload` — `schemas`, `routes`,
 * `navigation`, `Logo`, `createLucideIcon`. Browser povuče svaki od njih pre prvog kadra,
 * pa svi ulaze u budžet.
 *
 * Ostali `.js` u `dist/assets` su lazy rute i mere se pojedinačno.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { gzipSync } from 'node:zlib'

const KB = 1024

/** Budžeti iz `apps/web/CLAUDE.md`. Menjaju se tamo pa ovde — nikad samo ovde. */
const APPS = [{ name: 'web', dist: 'apps/web/dist', initialJs: 158, css: 20, route: 60 }]

const gzipOf = (file) => gzipSync(readFileSync(file)).length
const kb = (bytes) => bytes / KB
const fmt = (bytes) => `${kb(bytes).toFixed(1)} KB`

/** Fajlovi koje `index.html` povuče pre prvog kadra: entry script + svaki modulepreload. */
function initialFrom(html) {
  const names = new Set()
  for (const m of html.matchAll(/(?:src|href)="\/assets\/([^"]+)"/g)) names.add(m[1])
  return names
}

let failed = false

for (const app of APPS) {
  const assets = path.join(app.dist, 'assets')
  if (!statSync(assets, { throwIfNoEntry: false })) {
    console.error(`❌ ${app.name}: nema ${assets} — pokreni build pre provere`)
    failed = true
    continue
  }

  const preloaded = initialFrom(readFileSync(path.join(app.dist, 'index.html'), 'utf8'))
  const files = readdirSync(assets).filter((f) => !f.endsWith('.map'))

  let initialJs = 0
  let css = 0
  const routes = []

  for (const file of files) {
    const size = gzipOf(path.join(assets, file))
    if (file.endsWith('.css')) css += size
    else if (preloaded.has(file)) initialJs += size
    else routes.push({ file, size })
  }

  const check = (label, bytes, budget) => {
    const over = kb(bytes) > budget
    if (over) failed = true
    console.log(`  ${over ? '❌' : '✅'} ${label.padEnd(26)} ${fmt(bytes).padStart(9)} / ${budget} KB`)
  }

  console.log(`\n${app.name} — ${preloaded.size} fajla u početnom učitavanju\n`)
  check('initial JS', initialJs, app.initialJs)
  check('CSS', css, app.css)

  const worst = routes.sort((a, b) => b.size - a.size)[0]
  if (worst) check(`najveća ruta (${worst.file.split('-')[0]})`, worst.size, app.route)
}

if (failed) {
  console.error('\n❌ budžet probijen — vidi `apps/web/CLAUDE.md`')
  process.exit(1)
}

console.log('\n✅ svi bundle budžeti prolaze')
