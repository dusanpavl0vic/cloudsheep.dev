#!/usr/bin/env node
// PostToolUse hook — ESLint --fix na fajlu koji je upravo izmenjen.
//
// Namerno lintuje SAMO taj fajl, ne ceo paket: `pnpm lint` nad monorepoom traje predugo
// da bi se pokretao posle svake izmene. Typecheck se ne radi ovde iz istog razloga —
// tsc nema brz per-file režim, pa ostaje na `pnpm validate` i CI-ju.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

let input;
try {
  input = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}

const filePath = input?.tool_input?.file_path ?? '';
if (!/\.(ts|tsx)$/.test(filePath) || /\.d\.ts$/.test(filePath) || !existsSync(filePath)) {
  process.exit(0);
}

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

/**
 * ESLint 9 flat config se traži počev od CWD-a. U monorepou koren nema `eslint.config.js` —
 * ima ga svaki paket. Zato se penjemo od fajla naviše do prvog paketa sa konfiguracijom
 * i pokrećemo ESLint odatle. (Isti razlog postoji i u `lint-staged.config.mjs`.)
 */
function packageRootOf(file) {
  let dir = path.dirname(path.resolve(file));
  while (dir.startsWith(root) && dir !== root) {
    if (existsSync(path.join(dir, 'eslint.config.js'))) return dir;
    dir = path.dirname(dir);
  }
  return null;
}

const packageRoot = packageRootOf(filePath);
if (!packageRoot) process.exit(0); // fajl van paketa sa lint konfiguracijom

const eslintBin = path.join(root, 'node_modules', '.bin', 'eslint');
if (!existsSync(eslintBin)) process.exit(0); // pre `pnpm install`

try {
  execFileSync(eslintBin, ['--fix', path.relative(packageRoot, filePath)], {
    cwd: packageRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 30_000,
  });
  process.exit(0);
} catch (err) {
  const out = `${err.stdout ?? ''}${err.stderr ?? ''}`.trim();
  if (!out) process.exit(0);

  // Exit 2 vraća izlaz modelu da ga popravi u istom potezu.
  process.stderr.write(`ESLint prijavljuje probleme u ${filePath}:\n${out}\n`);
  process.exit(2);
}
