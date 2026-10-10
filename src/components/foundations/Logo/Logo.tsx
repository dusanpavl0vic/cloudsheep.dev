import { BRAND } from '@/constants/brand'

import { Mark, Root, Tld, Word } from './Logo.styles'
import type { LogoProps } from './Logo.types'

/**
 * Marka (ovca-oblak) + reč „cloudsheep.dev". Marka je statičan SVG, ne komponenta — nula JS-a i
 * jedan keširan zahtev (ranije je 2 KB putanje sedelo u početnom bundle-u).
 */
const Logo = ({ size = 36, markOnly = false, tone = 'default', animated = false, className }: LogoProps) => (
  <Root className={className}>
    <Mark src={BRAND.markSrc} alt="" width={size} height={size} $animated={animated} />
    {!markOnly && (
      <Word $tone={tone}>
        {BRAND.wordmark}
        <Tld $tone={tone}>{BRAND.tld}</Tld>
      </Word>
    )}
  </Root>
)

export default Logo
