import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    /*
     * Podrazumevanih 5 s je premalo kad `turbo` pusti sve jsdom pakete PARALELNO: otimaju se
     * o ista jezgra, pojedinačni `waitFor` probije rok i paket padne nasumično — lokalno
     * dvaput od tri pokretanja, dok isti paket pušten sam prolazi za 8 s.
     *
     * Granica postoji da uhvati ZAGLAVLJEN test, ne da meri koliko je mašina zauzeta.
     */
    testTimeout: 20_000,
    hookTimeout: 20_000,
    setupFiles: ['./vitest.setup.ts'],
    /**
     * Vitest gleda samo `src/`, i to samo `.test.` fajlove.
     *
     * Podrazumevani obrazac hvata i `*.spec.ts`, pa je pokupio Playwright testove iz `e2e/`
     * i pao na `import { test } from '@playwright/test'`. Dva pokretača, dva foldera, dva
     * nastavka — granica mora biti izričita, ne podrazumevana.
     */
    include: ['src/**/*.test.{ts,tsx}'],
    /**
     * Env za testove stoji OVDE, ne u `.env` fajlu.
     *
     * `src/lib/env.ts` validira `import.meta.env` i baca **pri importu modula**, pa bi
     * svaki test koji dodirne API klijent pao pre nego što se ijedan `it` pokrene.
     * `apps/web/.env` je gitignore-ovan, pa u CI-ju ne postoji. Vrednost je lažna —
     * testovi presreću mrežu MSW-om.
     */
    env: {
      VITE_APP_ENV: 'test',
      VITE_API_URL: 'http://localhost:3000',
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/index.ts', 'src/**/*.test.tsx', 'src/**/*.variants.ts', 'src/main.tsx'],
    },
  },
})
