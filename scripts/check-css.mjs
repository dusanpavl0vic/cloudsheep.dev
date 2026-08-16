#!/usr/bin/env node
/**
 * Provera balansa zagrada u CSS fajlovima.
 *
 * Postoji zbog konkretnog incidenta: brisanje bloka regexom odnelo je zatvarajuću `}`
 * `@media` bloka, a `typecheck`, `lint` i `test` su svi prošli. CSS sintaksu je uhvatio
 * tek `build`, koji se pokreće ređe — pa je repo neko vreme bio zeleno-a-pokvaren.
 *
 * Namerno bez `stylelint`: preko 20 KB zavisnosti tražilo bi ADR (docs/07 §6), a ovo
 * hvata upravo onu grešku koja se stvarno desila.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const ROOTS = ['apps', 'packages']
const SKIP = new Set(['node_modules', 'dist', '.turbo', 'coverage'])

function cssFiles(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...cssFiles(full))
    else if (entry.endsWith('.css')) out.push(full)
  }
  return out
}

/** Broji zagrade van stringova i komentara — inače `content: '{'` daje lažnu uzbunu. */
function balance(source) {
  let depth = 0
  let inComment = false
  let quote = ''

  for (let i = 0; i < source.length; i += 1) {
    const c = source[i]
    const next = source[i + 1]

    if (inComment) {
      if (c === '*' && next === '/') { inComment = false; i += 1 }
      continue
    }
    if (quote) {
      if (c === '\\') i += 1
      else if (c === quote) quote = ''
      continue
    }
    if (c === '/' && next === '*') { inComment = true; i += 1; continue }
    if (c === '"' || c === "'") { quote = c; continue }
    if (c === '{') depth += 1
    if (c === '}') depth -= 1
    if (depth < 0) return depth
  }
  return depth
}

let bad = 0
const files = ROOTS.flatMap((root) => cssFiles(root))

for (const file of files) {
  const depth = balance(readFileSync(file, 'utf8'))
  if (depth === 0) continue

  bad += 1
  console.error(
    depth > 0
      ? `❌ ${file}: fali ${String(depth)} zatvarajuć${depth === 1 ? 'a }' : 'ih }'}`
      : `❌ ${file}: ${String(-depth)} viška zatvarajućih }`,
  )
}

console.log(bad ? '' : `✅ ${String(files.length)} CSS fajlova, zagrade uravnotežene`)
process.exit(bad ? 1 : 0)
