import type { ReactNode } from 'react'

import { Root, type BadgeTone } from './Badge.styles'

/** Kratka oznaka statusa (potvrđeno, nacrt, zauzeto…). */
const Badge = ({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) => <Root $tone={tone}>{children}</Root>

export default Badge
