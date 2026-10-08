import { SECTION_WIDTH } from './Section.constants'
import { Root } from './Section.styles'
import type { SectionProps } from './Section.types'

/** Sekcija stranice: širina, vertikalni ritam i sidro iz dizajna. */
const Section = ({ children, id, labelledBy, align = 'left', spacing = 'default', width = SECTION_WIDTH, className }: SectionProps) => (
  <Root id={id} aria-labelledby={labelledBy} $align={align} $spacing={spacing} $width={width} className={className}>
    {children}
  </Root>
)

export default Section
