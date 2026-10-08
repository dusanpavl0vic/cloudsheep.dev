import { EFFECT_ATTRS } from '@/constants/effects'

import { Eyebrow, Lead, Muted, Root, Title } from './SectionHeader.styles'
import type { SectionHeaderProps } from './SectionHeader.types'

const reveal = { [EFFECT_ATTRS.reveal]: '' }

/** Oznaka, naslov sa prigušenim nastavkom i uvod — isti ritam u svakoj sekciji dizajna. */
const SectionHeader = ({ eyebrow, title, muted, lead, leadTone = 'body', titleId, align = 'left', as = 'h2', className }: SectionHeaderProps) => (
  <Root $align={align} className={className}>
    {eyebrow && <Eyebrow {...reveal}>{`[ ${eyebrow} ]`}</Eyebrow>}
    <Title as={as} id={titleId} {...reveal}>
      {title}
      {muted && (
        <>
          {' '}
          <Muted>{muted}</Muted>
        </>
      )}
    </Title>
    {lead && (
      <Lead $tone={leadTone} {...reveal}>
        {lead}
      </Lead>
    )}
  </Root>
)

export default SectionHeader
