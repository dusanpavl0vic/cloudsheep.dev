import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'

import { noRawColors } from './no-raw-colors.js'

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2022, sourceType: 'module' } })

describe('no-raw-colors', () => {
  it('prolazi RuleTester', () => {
    ruleTester.run('no-raw-colors', noRawColors, {
      valid: [
        { code: 'const a = css`color: ${(p) => p.theme.colors.ink};`' },
        { code: "const a = 'var(--c-ink)'" },
        { code: "const id = '#pricing'" },
      ],
      invalid: [
        { code: 'const a = css`color: #0D47A1;`', errors: [{ messageId: 'raw' }] },
        {
          code: 'const a = css`box-shadow: 0 0 0 rgba(0,0,0,.1);`',
          errors: [{ messageId: 'raw' }],
        },
        { code: "const a = '#fff'", errors: [{ messageId: 'raw' }] },
      ],
    })
  })
})
