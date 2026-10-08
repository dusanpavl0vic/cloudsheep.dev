import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

/**
 * Dva projekta (docs/12-testing.md):
 * - `unit` — bez baze, paralelno: helperi, šeme, store, hookovi, komponente, čist serverski kod;
 * - `db` — servisi nad PRAVIM Postgres-om (test baza), sekvencijalno, jer dele tabele.
 *   Atomično zauzimanje termina ili jedinstvenost adrese mock ne može da dokaže.
 *
 * Komponente i hookovi traže `// @vitest-environment jsdom` u prvom redu fajla.
 */
const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? 'postgresql://app:app@localhost:5434/appdb_test'

const alias = {
  '@': fileURLToPath(new URL('./src', import.meta.url)),
  // `server-only` baca grešku van React Server okruženja — u testu je obična biblioteka.
  'server-only': fileURLToPath(new URL('./src/test/serverOnlyStub.ts', import.meta.url)),
}

export default defineConfig({
  resolve: { alias },
  oxc: { jsx: { runtime: 'automatic' } },
  test: {
    restoreMocks: true,
    clearMocks: true,
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
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.{ts,tsx}', 'eslint-rules/**/*.test.js'],
          exclude: ['src/**/*.db.test.ts'],
          setupFiles: ['./src/test/setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'db',
          environment: 'node',
          include: ['src/**/*.db.test.ts'],
          fileParallelism: false,
          env: {
            NODE_ENV: 'test',
            DATABASE_URL: TEST_DATABASE_URL,
            JWT_SECRET: 'test-test-test-test-test-test-test-test',
            UPLOAD_DIR: './.test-uploads',
          },
          globalSetup: ['./src/test/dbGlobalSetup.ts'],
          setupFiles: ['./src/test/dbSetup.ts'],
        },
      },
    ],
  },
})
