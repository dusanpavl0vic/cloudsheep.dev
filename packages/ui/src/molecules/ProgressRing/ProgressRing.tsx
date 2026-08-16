import { useRef } from 'react'

import { useIntersection, useMediaQuery } from '@app/hooks'

import {
  progressIndicatorVariants,
  progressRingVariants,
  progressTrackVariants,
  progressValueVariants,
} from './ProgressRing.variants'
import { cn } from '../../lib/cn'

const SIZE_PX = { sm: 80, md: 112, lg: 144 } as const
const STROKE = { sm: 6, md: 8, lg: 10 } as const

interface ProgressRingProps {
  /** Vrednost u procentima, 0–100. */
  value: number
  /** Tekst u sredini. Ako se izostavi, prikazuje se `value` sa znakom procenta. */
  label?: string
  /** Pristupačno ime — obavezno, jer SVG sam po sebi ne kaže šta meri. */
  ariaLabel: string
  size?: keyof typeof SIZE_PX
  tone?: 'default' | 'accent' | 'inverse'
  className?: string
}

/**
 * Kružni indikator koji se popunjava kad uđe u viewport.
 *
 * Animacija kreće tek na ulasku (`useIntersection` sa `once`), ne pri mount-u —
 * indikator koji se napuni dok je van ekrana korisnik nikad ne vidi.
 *
 * Poštuje `prefers-reduced-motion`: tada se odmah crta puna vrednost, bez prelaza.
 */
export function ProgressRing({
  value,
  label,
  ariaLabel,
  size = 'md',
  tone = 'accent',
  className,
}: ProgressRingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useIntersection(ref, { once: true, threshold: 0.4 })
  const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  const px = SIZE_PX[size]
  const stroke = STROKE[size]
  const radius = (px - stroke) / 2
  const circumference = 2 * Math.PI * radius

  const clamped = Math.min(Math.max(value, 0), 100)
  const filled = isVisible || prefersReduced
  const offset = circumference * (1 - (filled ? clamped : 0) / 100)

  return (
    <div
      ref={ref}
      className={cn(progressRingVariants({ size }), className)}
      role="img"
      aria-label={ariaLabel}
    >
      <svg width={px} height={px} viewBox={`0 0 ${String(px)} ${String(px)}`} aria-hidden>
        <circle
          cx={px / 2}
          cy={px / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className={progressTrackVariants({ tone })}
        />
        <circle
          cx={px / 2}
          cy={px / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={progressIndicatorVariants({ tone })}
        />
      </svg>

      <span aria-hidden className={progressValueVariants({ size, tone })}>
        {label ?? `${String(clamped)}%`}
      </span>
    </div>
  )
}
