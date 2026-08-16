#!/usr/bin/env node
/**
 * Proverava da svaki `t('...')` ključ u komponentama feature-a postoji u namespace-u
 * koji ta komponenta stvarno učitava.
 *
 * Postoji zbog konkretnog bug-a: `ContactSection` živi u `features/landing`, učitava
 * namespace `landing`, ali je zvao `t('contact.titleTop')` — ključ koji postoji samo u
 * namespace-u `contact`. Typecheck, lint i i18n testovi su svi prošli, a na ekranu je
 * stajao sirov ključ.
 *
 * Skripta, ne vitest test: statički skenira fajlove, pa joj ne trebaju ni jsdom ni React,
 * a app tsconfig namerno nema node tipove.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const APP = 'apps/web/src'

/** Feature → namespace fajlovi koje njegove komponente imaju na raspolaganju. */
const SCOPES = [
  { dir: `${APP}/features/landing`, locales: [`${APP}/features/landing/locales/sr.json`, `${APP}/locales/sr.json`] },
  { dir: `${APP}/features/projects`, locales: [`${APP}/features/projects/locales/sr.json`, `${APP}/locales/sr.json`] },
  { dir: `${APP}/features/contact`, locales: [`${APP}/features/contact/locales/sr.json`, `${APP}/locales/sr.json`] },
  { dir: `${APP}/features/uses`, locales: [`${APP}/features/uses/locales/sr.json`, `${APP}/locales/sr.json`] },

  // `pages/` i `components/` su dugo nedostajali, iako sve četiri stranice zovu `t()`.
  // Zaštita koja pokriva pola mesta daje lažan osećaj sigurnosti. Obe mape učitavaju
  // više namespace-a (`['projects','common']`, `['contact','common']`…), pa im je
  // na raspolaganju unija svih rečnika — provera je time labavija nego kod feature-a,
  // ali i dalje hvata ključ koji ne postoji nigde.
  {
    dir: `${APP}/pages`,
    locales: [
      `${APP}/locales/sr.json`,
      `${APP}/features/projects/locales/sr.json`,
      `${APP}/features/contact/locales/sr.json`,
      `${APP}/features/uses/locales/sr.json`,
    ],
  },
  { dir: `${APP}/components`, locales: [`${APP}/locales/sr.json`] },
]

const tsxFiles = (dir) => {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...tsxFiles(full))
    else if (full.endsWith('.tsx') && !full.endsWith('.test.tsx')) out.push(full)
  }
  return out
}

/** Skup punih ključeva (`a.b.c`) iz jednog JSON rečnika. */
function keysOf(file) {
  const walk = (obj, prefix = '') =>
    Object.entries(obj).flatMap(([k, v]) =>
      typeof v === 'object' && v !== null ? walk(v, `${prefix}${k}.`) : [`${prefix}${k}`],
    )
  return new Set(walk(JSON.parse(readFileSync(file, 'utf8'))))
}

const missing = []

for (const scope of SCOPES) {
  const available = new Set(scope.locales.flatMap((f) => [...keysOf(f)]))

  for (const file of tsxFiles(scope.dir)) {
    const source = readFileSync(file, 'utf8')

    for (const match of source.matchAll(/\bt\(\s*'([a-zA-Z][\w.]*)'/g)) {
      const key = match[1]
      // `ns:key` bira namespace eksplicitno — nije predmet ove provere
      if (key.includes(':') || available.has(key)) continue
      missing.push(`${file} → ${key}`)
    }
  }
}

if (missing.length) {
  console.error('❌ ključevi koji ne postoje u učitanom namespace-u:\n')
  for (const m of missing) console.error(`   ${m}`)
  console.error('\nKljuč možda postoji u DRUGOM namespace-u — to je upravo greška koju ovo hvata.')
  process.exit(1)
}

console.log('✅ svi t() ključevi postoje u namespace-u koji komponenta učitava')
