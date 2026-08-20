import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    /*
     * Podrazumevanih 5 s je premalo kad `turbo` pusti sve jsdom pakete PARALELNO: otimaju se
     * o ista jezgra, pojedinačni `waitFor` probije rok i paket padne nasumično — lokalno
     * dvaput od tri pokretanja, dok isti paket pušten sam prolazi za 8 s.
     *
     * Granica postoji da uhvati ZAGLAVLJEN test, ne da meri koliko je mašina zauzeta.
     */
    // Turbo je već na `--concurrency=3`, ali svaki vitest povrh toga cepa jedan fork po
    // jezgru — 3 × 7 = 21 proces na 8 jezgara. Otud `Failed to start forks worker`.
    maxWorkers: 2,
    testTimeout: 20_000,
    hookTimeout: 20_000,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/index.ts', 'src/**/*.test.tsx', 'src/**/*.variants.ts'],
      thresholds: { lines: 80, functions: 80, branches: 75, statements: 80 },
    },
  },
})
