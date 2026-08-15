#!/usr/bin/env node
// PostToolUse hook — ESLint --fix na fajlu koji je upravo izmenjen.
//
// Namerno lintuje SAMO taj fajl, ne ceo paket: `pnpm lint` nad monorepoom traje predugo
// da bi se pokretao posle svake izmene. Typecheck se ne radi ovde iz istog razloga —
// tsc nema per-file režim koji bi bio brz, pa ostaje na `pnpm validate` i CI-ju.

import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

let input;
try {
  input = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}

const path = input?.tool_input?.file_path ?? '';
if (!/\.(ts|tsx)$/.test(path) || !existsSync(path)) process.exit(0);
if (/\.d\.ts$/.test(path)) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
if (!existsSync(`${root}/node_modules/.bin/eslint`)) process.exit(0); // pre pnpm install

try {
  execFileSync(`${root}/node_modules/.bin/eslint`, ['--fix', path], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 30_000,
  });
  process.exit(0);
} catch (err) {
  const out = `${err.stdout ?? ''}${err.stderr ?? ''}`.trim();
  if (!out) process.exit(0);

  // Exit 2 vraća izlaz modelu da ga popravi u istom potezu.
  process.stderr.write(`ESLint prijavljuje probleme u ${path}:\n${out}\n`);
  process.exit(2);
}
