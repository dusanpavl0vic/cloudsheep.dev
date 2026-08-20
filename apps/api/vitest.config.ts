import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    /**
     * Env stoji ovde, ne u `.env` fajlu — isti razlog kao u `apps/admin`: `src/env.ts`
     * validira i baca pri UČITAVANJU modula, pa bi svaki test pao pre prvog `it` na mašini
     * bez `.env`. Ovo je već jednom oborilo CI.
     */
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      JWT_SECRET: 'test-secret-koji-ima-bar-trideset-dva-znaka',
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
