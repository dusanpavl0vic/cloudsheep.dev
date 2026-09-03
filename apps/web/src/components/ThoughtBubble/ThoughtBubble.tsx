import type { VariantProps } from 'class-variance-authority'
import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@app/ui'

import {
  thoughtBubbleVariants,
  thoughtSurfaceVariants,
  thoughtTailDotVariants,
  thoughtTailVariants,
  thoughtVariants,
} from './ThoughtBubble.variants'

type ThoughtBubbleProps = VariantProps<typeof thoughtVariants> &
  VariantProps<typeof thoughtTailVariants> &
  VariantProps<typeof thoughtSurfaceVariants> & {
    children: ReactNode
    /**
     * Pozicija u lebdećem rasporedu — apsolutni offset i nagib.
     *
     * `| undefined` je eksplicitno zbog `exactOptionalPropertyTypes`: pozicija se traži iz
     * mape po `id`-u, pa pozivalac legitimno prosleđuje `undefined` kad ključa nema.
     */
    style?: CSSProperties | undefined
    className?: string | undefined
  }

/** Od najvećeg ka najmanjem, dakle od oblaka ka izvoru misli. */
const TAIL = [
  { size: 'lg', step: 1 },
  { size: 'md', step: 2 },
  { size: 'sm', step: 3 },
] as const

/**
 * Misao studija — oblak sa repom od tri kružića (docs/22 §3b).
 *
 * Zamenjuje raniju „papirnu karticu". Razlog je značenje: sadržaj je razmišljanje, a ne
 * dokument — kartica obećava nešto što se može otvoriti, oblak ne obećava ništa.
 *
 * **Tri sloja, i svaki postoji sa razlogom:** rep, maskirana podloga i tekst. Rep i podloga su
 * BRAĆA teksta, ne roditelji — maska bi inače sekla i slova, a ulazna animacija podloge bi
 * kružiće repa učinila nevidljivim dok se oblak ne pojavi.
 *
 * Komponenta je čisto prikazna i **ne postavlja `aria-hidden`**: to je odluka mesta upotrebe.
 * U hero-u i na 404 strani cela grupa jeste ukras i tamo se skriva na omotaču — ali oblak sa
 * stvarnim sadržajem ne sme unapred da bude nevidljiv čitaču ekrana.
 *
 * Živi u `components/`, ne u `packages/ui`: koriste ga dva feature-a iste app-e (docs/02), i
 * nijedna druga app ga nema — a paket bi ga uvukao u početno učitavanje admin-a.
 */
export const ThoughtBubble = ({
  children,
  tail,
  tone,
  step,
  drift,
  style,
  className,
}: ThoughtBubbleProps) => (
  <div style={style} className={cn(thoughtVariants({ step, drift }), className)}>
    <span aria-hidden className={thoughtTailVariants({ tail })}>
      {TAIL.map((dot) => (
        <span
          key={dot.size}
          className={thoughtTailDotVariants({ tone, size: dot.size, step: dot.step })}
        />
      ))}
    </span>

    <span aria-hidden className={thoughtSurfaceVariants({ tone })} />

    <div className={thoughtBubbleVariants()}>{children}</div>
  </div>
)
