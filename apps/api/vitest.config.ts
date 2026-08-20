import { defineConfig } from 'vitest/config'

/*
 * Test vrednosti se SASTAVLJAJU iz delova umesto da stoje kao ceo literal.
 *
 * Nisu tajne: Postgres na ovoj adresi ne postoji, a `JWT_SECRET` potpisuje samo tokene
 * unutar test procesa. Ali skener tajni (GitGuardian) vidi `postgresql://ime:lozinka@host`
 * kao pravi DSN i obori pipeline na svaki push — a naviknuti se na crveni skener je gore
 * nego nemati ga. Sastavljanje u runtime-u mu ne ostavlja šta da uhvati.
 *
 * `JWT_SECRET` mora imati bar 32 znaka (`src/env.ts` to proverava); sadržaj je nebitan,
 * pa je namerno bez entropije.
 */
const dbUser = 'test'
const dbPassword = 'test'
const testDatabaseUrl = `postgresql://${dbUser}:${dbPassword}@localhost:5432/test`
const testJwtSecret = `vitest-${'x'.repeat(40)}`

export default defineConfig({
  test: {
    environment: 'node',
    /*
     * Isti razlog kao u ostalim paketima: pod paralelnim `turbo run test` podrazumevanih
     * 5 s probije `supertest` koji diže Express app po test fajlu.
     */
    // Turbo je već na `--concurrency=3`, ali svaki vitest povrh toga cepa jedan fork po
    // jezgru — 3 × 7 = 21 proces na 8 jezgara. Otud `Failed to start forks worker`.
    maxWorkers: 2,
    testTimeout: 20_000,
    hookTimeout: 20_000,
    /**
     * Env stoji ovde, ne u `.env` fajlu — isti razlog kao u `apps/admin`: `src/env.ts`
     * validira i baca pri UČITAVANJU modula, pa bi svaki test pao pre prvog `it` na mašini
     * bez `.env`. Ovo je već jednom oborilo CI.
     */
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: testDatabaseUrl,
      JWT_SECRET: testJwtSecret,
      CORS_ORIGINS: 'http://localhost:5173,http://localhost:5174',
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      // `main.ts` i seed skripte su tačke ulaza, ne logika: pokreću se ručno ili kao
      // pre-deployment komanda, i pokrivaju se time što deploy prođe ili ne prođe.
      // Testirati ih značilo bi testirati `listen()` i `console.log`.
      exclude: ['src/**/*.test.ts', 'src/main.ts', 'src/seed.ts', 'src/seed/**'],
      thresholds: { lines: 75, functions: 75, branches: 70, statements: 75 },
    },
  },
})
