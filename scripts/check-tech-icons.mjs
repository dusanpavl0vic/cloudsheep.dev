#!/usr/bin/env node
/**
 * Proverava da svaka tehnologija u `lib/tech.ts` ima svoj SVG u `public/tech/`,
 * i obrnuto — da nema zaboravljenih fajlova.
 *
 * Postoji jer je nesklad tih dveju lista nevidljiv u typecheck-u: pločica bez fajla
 * tiho pokaže inicijal, a fajl bez unosa se nikad ne renderuje.
 */
import { readdirSync, readFileSync } from 'node:fs'

const CONSTANTS = 'apps/web/src/lib/tech.ts'
const ICON_DIR = 'apps/web/public/tech'

const ids = [...readFileSync(CONSTANTS, 'utf8').matchAll(/tech\('([a-z0-9]+)'/g)].map((m) => m[1])
const files = readdirSync(ICON_DIR)
  .filter((f) => f.endsWith('.svg'))
  .map((f) => f.replace(/\.svg$/, ''))

const missing = ids.filter((id) => !files.includes(id))
const unused = files.filter((f) => !ids.includes(f))

console.log(`${String(ids.length)} tehnologija · ${String(files.length)} logotipa`)

if (missing.length) console.error(`\n❌ nema logotip: ${missing.join(', ')}`)
if (unused.length) console.error(`\n❌ logotip bez unosa u spisku: ${unused.join(', ')}`)
if (!missing.length && !unused.length) console.log('\n✅ spisak i fajlovi se poklapaju')

// Siroče je greška, ne upozorenje. Ranije je ovde stajao `exit(missing.length ? 1 : 0)`,
// pa je `gmail.svg` mesecima stajao u `public/` i putovao u svaki deploy — skripta ga je
// uredno prijavljivala i uredno završavala uspehom, tako da ga niko nije video.
process.exit(missing.length || unused.length ? 1 : 0)
