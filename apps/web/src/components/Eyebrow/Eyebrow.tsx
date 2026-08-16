import type { VariantProps } from 'class-variance-authority'
import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

import { eyebrowMarkerVariants, eyebrowVariants } from './Eyebrow.variants'

type EyebrowProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof eyebrowVariants> & {
    /** Obojena oznaka ispred teksta (podrazumevano "//"). `null` je uklanja. */
    marker?: ReactNode
  }

export const Eyebrow = ({ className, tone, marker = '//', children, ...props }: EyebrowProps) => (
  <span className={cn(eyebrowVariants({ tone }), className)} {...props}>
    {marker !== null && <span className={eyebrowMarkerVariants({ tone })}>{marker}</span>}
    {children}
  </span>
)
