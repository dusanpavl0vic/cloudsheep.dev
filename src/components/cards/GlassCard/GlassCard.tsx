import { EFFECT_ATTRS } from '@/constants/effects'

import { Corner, Glow, Number, Root, TopLine } from './GlassCard.styles'
import type { GlassCardProps } from './GlassCard.types'

/** Staklena površina nad aurorom: providna, zamućena, sa spekularom i sjajem kursora. */
const GlassCard = ({ children, number, decorated = false, interactive = true, as = 'article', className }: GlassCardProps) => (
  <Root component={as} $interactive={interactive} className={className} {...{ [EFFECT_ATTRS.glow]: '', [EFFECT_ATTRS.reveal]: '' }}>
    <Glow aria-hidden="true" />
    {decorated && (
      <>
        <TopLine aria-hidden="true" />
        <Corner aria-hidden="true" $side="left" />
        <Corner aria-hidden="true" $side="right" />
      </>
    )}
    {number && <Number aria-hidden="true">{number}</Number>}
    {children}
  </Root>
)

export default GlassCard
