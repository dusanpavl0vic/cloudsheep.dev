import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

/**
 * Jedinični i integracioni testovi (docs/12-testing.md).
 * Podrazumevano okruženje je `node` (server, helperi, store); komponente i hookovi traže
 * `// @vitest-environment jsdom` u prvom redu fajla.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // `server-only` baca grešku van React Server okruženja — u testu je to obična biblioteka.
      'server-only': fileURLToPath(new URL('./src/test/serverOnlyStub.ts', import.meta.url)),
    },
  },
  oxc: { jsx: { runtime: 'automatic' } },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}', 'eslint-rules/**/*.test.js', 'prisma/**/*.test.ts'],
    setupFiles: ['./src/test/setup.ts'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
        'src/app/**',
        'src/**/*.styles.ts',
        'src/**/*.types.ts',
      ],
    },
  },
})
