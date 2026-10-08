import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import i18nextPlugin from 'eslint-plugin-i18next'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import { appPlugin } from './eslint-rules/index.js'

/** Kategorije design system-a — ne znaju za domen (docs/01-architecture.md §4). */
const DESIGN_SYSTEM = [
  'foundations',
  'buttons',
  'inputs',
  'data-display',
  'feedback',
  'navigation',
  'overlays',
  'media',
  'sections',
  'cards',
  'layout',
]
const DOMAINS = ['home', 'projects', 'notes', 'contact', 'errors', 'admin']

/** Moduli koji se izvršavaju i u pregledaču — ne smeju da vide `src/server` (tajne, baza). */
const CLIENT_REACHABLE = [
  'src/components/**',
  'src/hooks/**',
  'src/store/**',
  'src/modals/**',
  'src/providers/**',
  'src/helpers/**',
  'src/constants/**',
  'src/styles/**',
  'src/i18n/navigation.ts',
]

/** Fajlovi kojima okvir ili šablon propisuje `default export`. */
const DEFAULT_EXPORT_ALLOWED = [
  'src/components/**/*.tsx',
  'src/components/**/index.ts',
  'src/modals/**/*.tsx',
  'src/modals/**/index.ts',
  'src/store/slices/*/reducer/index.ts',
  'src/providers/*.tsx',
  'src/app/**/{page,layout,not-found,error,global-error,loading,template,default}.tsx',
  'src/app/**/{sitemap,robots,manifest}.ts',
  'src/i18n/request.ts',
  'src/constants/i18n/{en,sr}.ts',
  'prisma/seed.ts',
  '*.config.{ts,mjs,js}',
]

export default tseslint.config(
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'public/**',
      'prisma/migrations/**',
      'next-env.d.ts',
      // Stari kod do brisanja u fazi F6 (ADR 0009) — samo referenca za prenos.
      'apps/**',
      'packages/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    languageOptions: {
      ecmaVersion: 2023,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    plugins: { import: importPlugin, '@app': appPlugin },
    settings: { 'import/resolver': { typescript: { alwaysTryTypes: true } } },
    rules: {
      // ── Bez any, bez ! ───────────────────────────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],

      // ── Šablon §4.1: default export samo za komponente (izuzeci niže) ───────
      'import/no-default-export': 'error',
      'import/no-cycle': ['error', { maxDepth: 4 }],
      'import/no-useless-path-segments': 'error',
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // ── Sigurnost (docs/20) ──────────────────────────────────────────────────
      'no-restricted-properties': [
        'error',
        {
          object: 'localStorage',
          property: 'setItem',
          message:
            'Tokeni nikad u localStorage (docs/20-security.md). Upis ide samo kroz store/persistence.',
        },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'eval', message: 'Zabranjeno (docs/20-security.md).' },
      ],
    },
  },

  // ── Šablon §1.7: funkcije su arrow funkcije (aplikacioni kod; alati u korenu su izuzeti) ──
  {
    files: ['src/**/*.{ts,tsx}', 'prisma/**/*.ts', 'e2e/**/*.ts'],
    rules: {
      'func-style': ['error', 'expression'],
      'prefer-arrow-callback': 'error',
    },
  },

  // ── React: hookovi, React Compiler, a11y, Next ─────────────────────────────
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      '@next/next': nextPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      // Pravilo je za Pages Router; u App Router layout-u `<head>` je ispravan način.
      '@next/next/no-head-element': 'off',

      // Performanse (docs/07)
      '@app/max-usestate': ['error', { max: 2 }],
      '@app/require-effect-comment': 'error',

      // Granice slojeva (docs/01 §4)
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            ...DESIGN_SYSTEM.map((category) => ({
              target: `./src/components/${category}`,
              from: [
                ...DOMAINS.map((domain) => `./src/components/${domain}`),
                './src/store',
                './src/hooks/useStore.ts',
              ],
              message:
                'Design system ne zna za domen ni store — tekst i podaci stižu kroz props (docs/01-architecture.md §4).',
            })),
            {
              target: './src/hooks',
              from: ['./src/components', './src/modals'],
              message: 'Hook ne uvozi komponente (docs/01-architecture.md §4).',
            },
            {
              target: './src/store',
              from: ['./src/hooks', './src/components', './src/modals'],
              message: 'Store ne uvozi hookove ni komponente (docs/01-architecture.md §4).',
            },
            {
              target: './src/helpers',
              from: ['./src/store', './src/hooks', './src/components', './src/server'],
              message:
                'Helper je čista funkcija — bez store-a, React-a i servera (docs/14-helpers-utils.md).',
            },
            {
              target: './src/constants',
              from: [
                './src/store',
                './src/hooks',
                './src/components',
                './src/helpers',
                './src/server',
                './src/styles',
              ],
              message:
                'Konstante uvoze samo tipove i druge konstante (docs/01-architecture.md §4).',
            },
            {
              target: './src/server',
              from: [
                './src/components',
                './src/hooks',
                './src/store',
                './src/modals',
                './src/providers',
              ],
              message: 'Server ne zna za React ni store (docs/17-backend.md §1).',
            },
          ],
        },
      ],
    },
  },

  // ── `src/server` je nedostupan klijentskom kodu (tajne, baza) ──────────────
  {
    files: CLIENT_REACHABLE,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/server', '@/server/*'],
              message:
                'src/server se uvozi samo iz src/app i src/server (docs/01-architecture.md §2).',
            },
          ],
        },
      ],
    },
  },

  // ── Šablon §1.4: komponenta je prezentaciona — store i ruta idu kroz domenski hook ──
  {
    files: ['src/components/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-redux',
              message: 'Komponenta ne čita store — koristi domenski hook (šablon §1.4).',
            },
            {
              name: '@/hooks/useStore',
              message: 'Komponenta ne čita store — koristi domenski hook (šablon §1.4).',
            },
            {
              name: 'next/navigation',
              importNames: ['useParams', 'useSearchParams', 'useRouter'],
              message: 'Parametri, query i navigacija idu u domenski hook (šablon §3.5).',
            },
          ],
          patterns: [
            {
              group: ['@/store', '@/store/*'],
              message: 'Komponenta ne uvozi store — koristi domenski hook.',
            },
            {
              group: ['@/server', '@/server/*'],
              message: 'src/server je samo za server (docs/01 §2).',
            },
          ],
        },
      ],
    },
  },

  // ── Javni sajt: linkovi dobijaju jezički prefiks samo kroz @/i18n/navigation ──
  {
    files: ['src/components/**/*.tsx'],
    ignores: ['src/components/admin/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "ImportDeclaration[source.value='next/link']",
          message:
            'Javni sajt koristi Link iz @/i18n/navigation — on dodaje /sr prefiks (docs/05-routing.md §2).',
        },
      ],
    },
  },

  // ── Bez literal stringova u UI (docs/09) ─────────────────────────────────────
  {
    files: ['src/components/**/*.tsx', 'src/modals/**/*.tsx', 'src/app/**/*.tsx'],
    plugins: { i18next: i18nextPlugin },
    rules: {
      'i18next/no-literal-string': [
        'error',
        { mode: 'jsx-text-only', 'should-validate-template': true },
      ],
    },
  },

  // ── Stil: boje samo iz teme ──────────────────────────────────────────────────
  {
    files: ['src/**/*.styles.ts'],
    rules: { '@app/no-raw-colors': 'error' },
  },

  // ── default export gde ga okvir ili šablon traži ─────────────────────────────
  {
    files: DEFAULT_EXPORT_ALLOWED,
    rules: { 'import/no-default-export': 'off' },
  },

  // ── Testovi ──────────────────────────────────────────────────────────────────
  {
    files: ['**/*.test.{ts,tsx,js}', 'e2e/**/*.ts', 'src/test/**'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'i18next/no-literal-string': 'off',
      '@app/max-usestate': 'off',
      'no-restricted-imports': 'off',
    },
  },

  // ── Čist JS (konfiguracije, lokalna pravila) — bez provere tipova ────────────
  {
    files: ['**/*.{js,mjs}'],
    ...tseslint.configs.disableTypeChecked,
  },
)
