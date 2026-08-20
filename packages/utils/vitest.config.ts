import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // jsdom samo zbog createStorage testa; ostalo su čiste funkcije
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
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/index.ts', 'src/**/*.test.ts'],
      // docs/12-testing.md: packages/utils je jedini paket na 100%
      thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 },
    },
  },
})
