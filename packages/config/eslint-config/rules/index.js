import { maxUseState } from './max-usestate.js';
import { requireEffectComment } from './require-effect-comment.js';

/**
 * Custom pravila koja standardni plugini ne pokrivaju.
 * Oba su tražena u docs/16-tooling-ci.md §2 — pravilo bez lint rule je želja, ne pravilo.
 */
export const appPlugin = {
  meta: { name: '@app/eslint-plugin', version: '0.0.0' },
  rules: {
    'max-usestate': maxUseState,
    'require-effect-comment': requireEffectComment,
  },
};

export { maxUseState, requireEffectComment };
