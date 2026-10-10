import { EFFECT_ATTRS } from '@/constants/effects'

import { CursorGlow, Dots, Slant, Spine } from './HeroBackdrop.styles'

/** Slojevi iza sadržaja hero-a: staklo sa kosinom, tačkice, sjaj kursora i vertikalna linija. */
const HeroBackdrop = () => (
  <>
    <Slant aria-hidden="true" />
    <Dots aria-hidden="true" />
    <CursorGlow aria-hidden="true" {...{ [EFFECT_ATTRS.heroGlow]: '' }} />
    <Spine aria-hidden="true" />
  </>
)

export default HeroBackdrop
