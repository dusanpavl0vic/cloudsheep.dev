import CountUp from '@/components/data-display/CountUp'
import { BRAND_COLORS, THOUGHT } from '@/constants/theme'

import { Arc, Ring, Root, Value } from './ScoreRing.styles'
import { RING } from './ScoreRing.yak'

const center = RING.size / 2

/** Lighthouse prsten iz dizajna: luk se zatvara, broj naraste do 100. */
const ScoreRing = () => (
  <Root>
    <Ring viewBox={`0 0 ${String(RING.size)} ${String(RING.size)}`} width={RING.size} height={RING.size} aria-hidden="true">
      <circle cx={center} cy={center} r={RING.radius} fill="none" stroke={THOUGHT.track} strokeWidth={RING.stroke} />
      <Arc cx={center} cy={center} r={RING.radius} fill="none" stroke={BRAND_COLORS.blue} strokeWidth={RING.stroke} strokeLinecap="round" />
    </Ring>
    <Value>
      <CountUp value={100} />
    </Value>
  </Root>
)

export default ScoreRing
