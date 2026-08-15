#!/usr/bin/env node
// PreToolUse hook — blokira izmene fajlova koji se menjaju samo kroz namenski postupak.
//
// pnpm-lock.yaml  → menja ga pnpm, ne ruka. Ručna izmena tiho razilazi lock i node_modules.
// docs/adr/*      → ADR se pravi kroz /adr, da bi dobio broj, šablon i unos u indeks.
//                   Izuzetak: template.md i 0000-initial-spec.md nisu odluke.

import { readFileSync } from 'node:fs';

const PROTECTED = [
  {
    test: (p) => /(^|\/)pnpm-lock\.yaml$/.test(p),
    reason:
      'pnpm-lock.yaml se ne menja ručno. Koristi `pnpm install` / `pnpm update` — ' +
      'ručna izmena razilazi lock i stvarno instalirano stablo.',
  },
  {
    test: (p) =>
      /(^|\/)docs\/adr\/\d{4}-.+\.md$/.test(p) && !/0000-initial-spec\.md$/.test(p),
    reason:
      'ADR fajlovi se prave i menjaju kroz /adr — komanda dodeljuje sledeći slobodan broj, ' +
      'primenjuje šablon i upisuje red u indeks u docs/README.md. Direktna izmena preskače sve troje.',
  },
];

let input;
try {
  input = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0); // ne možemo da parsiramo — ne blokiramo
}

const path = input?.tool_input?.file_path ?? input?.tool_input?.notebook_path ?? '';
if (!path) process.exit(0);

const hit = PROTECTED.find((rule) => rule.test(path));
if (!hit) process.exit(0);

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: hit.reason,
    },
  }),
);
process.exit(0);
