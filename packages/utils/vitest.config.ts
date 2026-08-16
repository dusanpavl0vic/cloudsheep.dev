import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // jsdom samo zbog createStorage testa; ostalo su čiste funkcije
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/index.ts', 'src/**/*.test.ts'],
      // docs/12-testing.md: packages/utils je jedini paket na 100%
      thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 },
    },
  },
});
