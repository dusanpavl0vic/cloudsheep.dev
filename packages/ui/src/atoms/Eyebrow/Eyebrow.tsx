import type { VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { eyebrowMarkerVariants, eyebrowVariants } from './Eyebrow.variants'
import { cn } from '../../lib/cn'

type EyebrowProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof eyebrowVariants> & {
    /** Prikazuje tačkicu ispred teksta. Čista dekoracija — podrazumevano uključena. */
    marker?: boolean
  }

export const Eyebrow = ({ className, tone, marker = true, children, ...props }: EyebrowProps) => (
  <span className={cn(eyebrowVariants({ tone }), className)} {...props}>
    {marker && <span aria-hidden className={eyebrowMarkerVariants({ tone })} />}
    {children}
  </span>
)
