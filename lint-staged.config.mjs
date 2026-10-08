/** Pre commit-a: ESLint --fix i Prettier samo na staged fajlovima (typecheck je u pre-push). */
export default {
  '*.{ts,tsx,mjs,js}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yaml,yml}': 'prettier --write',
}
