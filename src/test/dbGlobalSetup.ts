import { execSync } from 'node:child_process'

/**
 * Jednom pre `db` projekta: test baza dobija tačno šemu iz migracija (`migrate deploy`, ne
 * `db push` — testira se ista istorija koja ide u produkciju). Nedestruktivno: izolaciju
 * testova daje TRUNCATE pre svakog testa (`dbSetup.ts`), ne reset baze.
 */

export default function setup() {
  const url = process.env.TEST_DATABASE_URL ?? 'postgresql://app:app@localhost:5432/appdb_test'
  execSync('pnpm exec prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: url },
    stdio: 'ignore',
  })
}
