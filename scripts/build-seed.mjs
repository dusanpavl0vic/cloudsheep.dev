/**
 * Pakuje `prisma/seed.ts` u `dist/seed.cjs` za Docker image (ADR 0017).
 *
 * Seed se u image-u pokreće VAN Next servera (`scripts/docker-start.sh`). Standalone
 * `node_modules` prati samo ono što koristi `server.js`, pa je jedini spoljni paket
 * `@prisma/client` (njega server sigurno koristi), a sve ostalo ide u paket. Next se NE
 * pakuje: ako ga seed preko nekog modula uveze (npr. `next/server` kroz `server/http.ts`),
 * build pada ovde, ne na serveru u petlji restartovanja.
 */
import { build } from 'esbuild'

const result = await build({
  entryPoints: ['prisma/seed.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node22',
  // `server-only` u react-server okruženju je prazan modul.
  conditions: ['react-server'],
  external: ['@prisma/client'],
  alias: { '@': './src' },
  outfile: 'dist/seed.cjs',
  metafile: true,
  logLevel: 'warning',
})

const nextInputs = Object.keys(result.metafile.inputs).filter((input) => /node_modules\/(\.pnpm\/next@[^/]+\/node_modules\/)?next\//.test(input))
if (nextInputs.length > 0) {
  console.error('dist/seed.cjs uvozi Next — u image-u ga nema van server.js. Lanac počinje ovde:')
  for (const input of nextInputs.slice(0, 5)) console.error(`  ${input}`)
  console.error('Seed sme da uvozi samo module bez Next-a (npr. HttpError iz server/errors.ts).')
  process.exit(1)
}

const bytes = result.metafile.outputs['dist/seed.cjs']?.bytes ?? 0
console.log(`dist/seed.cjs  ${(bytes / 1024).toFixed(1)} KB`)
