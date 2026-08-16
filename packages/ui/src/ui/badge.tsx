import type { VariantProps } from 'class-variance-authority'
import type { HTMLAttributes, ReactNode } from 'react'

import { badgeMarkerVariants, badgeVariants } from './badge.variants'
import { cn } from '../lib/cn'

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    /** Boja markera ispred teksta. Bez ovoga se marker ne prikazuje. */
    marker?: VariantProps<typeof badgeMarkerVariants>['tone']
    /**
     * Znak markera.
     *
     * Podrazumevano `$` — `packages/ui` ne sme da uvozi konstante iz app-e (docs/01 §2),
     * pa vrednost stoji ovde, a app je sme zameniti kroz prop.
     */
    markerGlyph?: ReactNode
  }

export const Badge = ({
  className,
  variant,
  size,
  shape,
  font,
  marker,
  markerGlyph = '$',
  children,
  ...props
}: BadgeProps) => (
  <span className={cn(badgeVariants({ variant, size, shape, font }), className)} {...props}>
    {marker && (
      <span aria-hidden className={badgeMarkerVariants({ tone: marker })}>
        {markerGlyph}
      </span>
    )}
    {children}
  </span>
)
