import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = import.meta.dirname;

/**
 * ESLint 9 flat config traži `eslint.config.js` počev od CWD-a, a lint-staged radi iz korena
 * monorepoa — gde te konfiguracije nema. Zato staged fajlove grupišemo po workspace paketu
 * i pokrećemo ESLint iz svakog korena posebno.
 */
function packageRootOf(file) {
  let dir = path.dirname(path.resolve(ROOT, file));
  while (dir.startsWith(ROOT) && dir !== ROOT) {
    if (existsSync(path.join(dir, 'eslint.config.js'))) return dir;
    dir = path.dirname(dir);
  }
  return null;
}

export default {
  '*.{ts,tsx}': (files) => {
    const byPackage = new Map();

    for (const file of files) {
      const root = packageRootOf(file);
      if (!root) continue; // fajl van paketa sa lint konfiguracijom — pokriva ga prettier
      if (!byPackage.has(root)) byPackage.set(root, []);
      byPackage.get(root).push(path.relative(root, file));
    }

    const commands = [...byPackage].map(
      ([root, rel]) => `pnpm --dir ${JSON.stringify(root)} exec eslint --fix ${rel.map((r) => JSON.stringify(r)).join(' ')}`,
    );

    return [...commands, `prettier --write ${files.map((f) => JSON.stringify(f)).join(' ')}`];
  },

  '*.{json,css,md,yaml,yml}': 'prettier --write',
};
