#!/usr/bin/env node
// Stop hook — podseti na /review kad je diff narastao preko praga.
//
// NAMERNO ne blokira. Stop hook koji blokira vrti model u krug; ovo samo ispiše poruku
// korisniku i pusti potez da se završi.

import { execFileSync } from 'node:child_process';

const THRESHOLD = 100; // linija izmena
const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

const git = (args) => {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', timeout: 10_000 });
  } catch {
    return '';
  }
};

if (!git(['rev-parse', '--is-inside-work-tree']).trim()) process.exit(0);

// Uporedi sa granom od koje smo se odvojili; fallback na neispraćene izmene.
const base = git(['merge-base', 'HEAD', 'dev']).trim();
const stat = base
  ? git(['diff', '--shortstat', base, '--'])
  : git(['diff', '--shortstat', 'HEAD', '--']);

const m = stat.match(/(\d+) insertions?\(\+\)(?:, (\d+) deletions?\(-\))?/);
if (!m) process.exit(0);

const changed = Number(m[1] ?? 0) + Number(m[2] ?? 0);
if (changed <= THRESHOLD) process.exit(0);

process.stdout.write(
  JSON.stringify({
    systemMessage:
      `Diff je narastao na ~${changed} izmenjenih linija. ` +
      `Pokreni /review pre commit-a — audituje izmene protiv docs/19-code-review-checklist.md.`,
  }),
);
process.exit(0);
