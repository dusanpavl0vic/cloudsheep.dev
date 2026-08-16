import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import i18nextPlugin from 'eslint-plugin-i18next';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { appPlugin } from './rules/index.js';

const IGNORES = [
  'dist/**',
  'coverage/**',
  'node_modules/**',
  '.turbo/**',
  'playwright-report/**',
  // Sami sebi konfiguracija — nisu deo tsconfig programa, pa ih projectService ne vidi
  '**/eslint.config.js',
];

/** Pravila zajednička svemu što je TypeScript. */
const baseTypeScript = (tsconfigRootDir) => [
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: { projectService: true, tsconfigRootDir },
    },
    plugins: { import: importPlugin, '@app': appPlugin },
    settings: {
      'import/resolver': { typescript: { alwaysTryTypes: true } },
    },
    rules: {
      // ── Bez any, bez ! ────────────────────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // ── Imenovanje (docs/03) ──────────────────────────────────────────
      // default export samo za lazy route module — te fajlove izuzimamo niže
      'import/no-default-export': 'error',
      'import/no-cycle': ['error', { maxDepth: Infinity }],
      'import/no-useless-path-segments': 'error',
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [{ pattern: '@app/**', group: 'internal' }, { pattern: '@/**', group: 'internal' }],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // ── Performanse (docs/07) ─────────────────────────────────────────
      '@app/max-usestate': ['error', { max: 2 }],
      '@app/require-effect-comment': 'error',

      // ── Sigurnost (docs/20) ───────────────────────────────────────────
      'no-restricted-properties': [
        'error',
        {
          object: 'localStorage',
          property: 'setItem',
          message:
            'Tokeni nikad u localStorage (docs/20-security.md). Za ostalo koristi createStorage iz @app/utils.',
        },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'eval', message: 'Zabranjeno (docs/20-security.md).' },
      ],
    },
  },
];

/** Preset za aplikacije: apps/* */
export function createAppConfig({ tsconfigRootDir, srcDir = './src' } = {}) {
  return tseslint.config(
    { ignores: IGNORES },
    ...baseTypeScript(tsconfigRootDir),
    {
      files: ['**/*.{ts,tsx}'],
      plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
        'jsx-a11y': jsxA11y,
        i18next: i18nextPlugin,
      },
      rules: {
        // Hook pravila + React Compiler (v7 ih nosi) — error, ne warning
        ...reactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

        // A11y je error nivo (docs/15)
        ...jsxA11y.configs.recommended.rules,

        // ── Granice slojeva (docs/01 §6) ────────────────────────────────
        'import/no-restricted-paths': [
          'error',
          {
            zones: [
              {
                target: `${srcDir}/features/*`,
                from: `${srcDir}/features/*`,
                except: ['./index.ts'],
                message:
                  'Feature ne sme importovati drugi feature. Izdigni deljeno u components/hooks/lib, ili komuniciraj preko store-a (docs/01-architecture.md §3).',
              },
              {
                target: `${srcDir}/components`,
                from: `${srcDir}/features`,
                message: 'Deljena komponenta ne sme zavisiti od feature-a (docs/01-architecture.md §2).',
              },
              {
                target: `${srcDir}/lib`,
                from: [`${srcDir}/features`, `${srcDir}/pages`],
                message: 'lib/ je najniži sloj app-e — ne sme zavisiti od feature-a ni stranica.',
              },
              {
                target: `${srcDir}/hooks`,
                from: `${srcDir}/features`,
                message: 'Deljeni hook ne sme zavisiti od feature-a.',
              },
            ],
          },
        ],

        // Paket se uvozi samo kroz barrel (docs/adr/0005).
        // Ograničeno na @app/* — relativni importi unutar iste app-e su normalan rad,
        // a spoljne biblioteke imaju legitimne subpath exporte.
        'import/no-internal-modules': [
          'error',
          {
            forbid: ['@app/*/*'],
          },
        ],
      },
    },
    // Bez literal stringova u UI — samo tamo gde UI stvarno živi (docs/09)
    {
      files: [`${srcDir}/features/**/*.tsx`, `${srcDir}/pages/**/*.tsx`, `${srcDir}/components/**/*.tsx`],
      rules: {
        'i18next/no-literal-string': [
          'error',
          { mode: 'jsx-text-only', 'should-validate-template': true },
        ],
      },
    },
    // Lazy route moduli i config fajlovi smeju default export
    {
      files: [`${srcDir}/pages/**/*.tsx`, `${srcDir}/**/modals/**/*.tsx`, '*.config.{ts,js}', 'vite.config.ts'],
      rules: { 'import/no-default-export': 'off' },
    },
    // Testovi
    {
      files: ['**/*.test.{ts,tsx}', 'e2e/**/*.spec.ts', '**/__tests__/**'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/unbound-method': 'off',
        'i18next/no-literal-string': 'off',
        '@app/max-usestate': 'off',
      },
    },
    // Konstante i lokalizacija — ovde literal stringovi jesu podatak
    {
      files: [`${srcDir}/**/*.constants.ts`, `${srcDir}/lib/**`],
      rules: { 'i18next/no-literal-string': 'off' },
    },
  );
}

/** Preset za pakete: packages/* */
export function createPackageConfig({ tsconfigRootDir, react = true } = {}) {
  return tseslint.config(
    { ignores: IGNORES },
    ...baseTypeScript(tsconfigRootDir),
    react
      ? {
          files: ['**/*.{ts,tsx}'],
          plugins: { 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
          rules: {
            ...reactHooks.configs.recommended.rules,
            ...jsxA11y.configs.recommended.rules,
            // packages/ui ne sme znati za domen, store ni i18n (packages/ui/CLAUDE.md)
            'no-restricted-imports': [
              'error',
              {
                patterns: [
                  {
                    group: ['@app/core', '@app/core/*', 'react-redux', '@reduxjs/toolkit'],
                    message:
                      'packages/ui ne sme zavisiti od store-a. Komponenta prima sve preko propsa (docs/01-architecture.md §2).',
                  },
                  {
                    group: ['react-i18next', 'i18next', '@app/i18n'],
                    message:
                      'packages/ui ne sme znati za i18n ključeve. Tekst ide kao prop (packages/ui/CLAUDE.md).',
                  },
                ],
              },
            ],
          },
        }
      : {},
    // Config fajlovi zahtevaju default export po ugovoru alata
    {
      files: ['**/*.config.{ts,js,mjs}'],
      rules: { 'import/no-default-export': 'off' },
    },
    {
      files: ['**/*.test.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@app/max-usestate': 'off',
      },
    },
  );
}

export { appPlugin };
