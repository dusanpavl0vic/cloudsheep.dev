import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'

import { noRuntimeTokens } from './no-runtime-tokens.js'

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2022, sourceType: 'module' } })
const imports = "import { colors } from '@/styles/tokens.yak'\n"

describe('no-runtime-tokens', () => {
  it('prolazi RuleTester', () => {
    ruleTester.run('no-runtime-tokens', noRuntimeTokens, {
      valid: [
        { code: imports + 'const a = styled.p`color: ${colors.ink};`' },
        { code: imports + 'const a = styled.p`${({ $on }) => $on && css`color: ${colors.accent};`}`' },
        { code: "import { media } from './x'\nconst a = styled.p`${({ $w }) => media[$w]}`" },
      ],
      invalid: [
        {
          code: imports + 'const a = styled.p`color: ${({ $on }) => ($on ? colors.accent : colors.ink)};`',
          errors: [{ messageId: 'runtime' }, { messageId: 'runtime' }],
        },
        {
          code: "import { SIZES } from './Button.yak'\nconst a = styled.p`height: ${({ $s }) => SIZES[$s]}px;`",
          errors: [{ messageId: 'runtime' }],
        },
      ],
    })
  })
})
