import js from '@eslint/js';
import globals from 'globals';

/**
 * Paket sa lint pravilima lintuje sam sebe minimalno — ovde je običan JS bez TypeScript-a,
 * pa strict-type-checked preset (koji ovaj paket izvozi) nema šta da radi.
 */
export default [
  { ignores: ['node_modules/**'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
  },
];
