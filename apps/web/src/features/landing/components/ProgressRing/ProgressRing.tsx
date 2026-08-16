import { useRef } from 'react'

import { useCountUp, useIntersection, useMediaQuery } from '@app/hooks'
import { cn } from '@app/ui'

import {
  progressGlowVariants,
  progressIndicatorVariants,
  progressRingVariants,
  progressSweepVariants,
  progressTrackVariants,
  progressValueVariants,
} from './ProgressRing.variants'

const SIZE_PX = { sm: 80, md: 112, lg: 144 } as const
const STROKE = { sm: 6, md: 8, lg: 10 } as const

interface ProgressRingProps {
  /** Stvarna vrednost, u jedinicama `domain`. */
  value: number
  /**
   * Opseg koji prsten prikazuje, podrazumevano `[0, 100]`.
   *
   * Postoji zbog vrednosti kao što je uptime: 99.95 na skali 0–100 daje procep od
   * **0.21px** na obimu od 421px — prsten izgleda potpuno pun i ne saopštava ništa.
   * Sa `domain={[99, 100]}` ista vrednost popunjava 95% luka, pa se razlika vidi.
   */
  domain?: readonly [min: number, max: number]
  /** Broj decimala u ispisu. */
  decimals?: number
  /** Sufiks uz broj. */
  suffix?: string
  /** Pristupačno ime — obavezno, jer SVG sam po sebi ne kaže šta meri. */
  ariaLabel: string
  size?: keyof typeof SIZE_PX
  tone?: 'default' | 'accent' | 'inverse'
  className?: string
}

/**
 * Kružni indikator koji se popunjava i odbrojava kad uđe u viewport.
 *
 * Animacija kreće na ulasku (`useIntersection` sa `once`), ne pri mount-u — indikator
 * koji se napuni dok je van ekrana korisnik nikad ne vidi.
 *
 * Poštuje `prefers-reduced-motion`: tada se odmah crta konačno stanje, bez prelaza.
 */
export function ProgressRing({
  value,
  domain = [0, 100],
  decimals = 0,
  suffix = '%',
  ariaLabel,
  size = 'md',
  tone = 'accent',
  className,
}: ProgressRingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useIntersection(ref, { once: true, threshold: 0.4 })
  const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  const displayed = useCountUp(value, {
    active: isVisible,
    decimals,
    immediate: prefersReduced,
  })

  const px = SIZE_PX[size]
  const stroke = STROKE[size]
  const radius = (px - stroke) / 2
  const circumference = 2 * Math.PI * radius

  const [min, max] = domain
  const span = max - min || 1
  const ratio = Math.min(Math.max((value - min) / span, 0), 1)

  const filled = isVisible || prefersReduced
  const offset = circumference * (1 - (filled ? ratio : 0))

  // „Učitava se" dok brojač nije stigao do cilja. Izvodi se iz animacije, ne prima propom —
  // dva izvora istine za isto stanje bi se razišla.
  const isLoading = !prefersReduced && isVisible && displayed < value

  // Tragač pokriva petinu obima: dovoljno da se vidi rotacija, premalo da se pobrka sa vrednošću
  const sweepLength = circumference / 5

  return (
    <div
      ref={ref}
      className={cn(progressRingVariants({ size }), className)}
      role="img"
      // Ime nosi STVARNU vrednost, ne animiranu — screen reader ne sme da čita odbrojavanje
      aria-label={ariaLabel}
    >
      <span
        aria-hidden
        className={progressGlowVariants({ tone })}
        style={{ opacity: filled ? 0.55 : 0 }}
      />

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

        <circle
          cx={px / 2}
          cy={px / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke / 2}
          strokeLinecap="round"
          strokeDasharray={`${String(sweepLength)} ${String(circumference)}`}
          className={progressSweepVariants({ tone, state: isLoading ? 'loading' : 'done' })}
        />
      </svg>

      <span aria-hidden className={progressValueVariants({ size, tone })}>
        {displayed.toFixed(decimals)}
        {suffix}
      </span>
    </div>
  )
}
