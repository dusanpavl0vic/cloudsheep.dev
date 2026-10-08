import { maxUseState } from './max-usestate.js'
import { noRawColors } from './no-raw-colors.js'
import { requireEffectComment } from './require-effect-comment.js'

/**
 * Lokalna pravila koja standardni plugini ne pokrivaju (docs/16-tooling-ci.md §2) —
 * pravilo bez lint provere je želja, ne pravilo.
 */
export const appPlugin = {
  meta: { name: '@app/eslint-plugin', version: '1.0.0' },
  rules: {
    'max-usestate': maxUseState,
    'require-effect-comment': requireEffectComment,
    'no-raw-colors': noRawColors,
  },
}
