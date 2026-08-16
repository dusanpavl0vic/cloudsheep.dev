import type { VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

import { badgeDotVariants, badgeVariants } from './Badge.variants'

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    /** Prikazuje tačku-indikator ispred teksta */
    dot?: VariantProps<typeof badgeDotVariants>['tone']
  }

export const Badge = ({
  className,
  variant,
  size,
  shape,
  font,
  dot,
  children,
  ...props
}: BadgeProps) => (
  <span className={cn(badgeVariants({ variant, size, shape, font }), className)} {...props}>
    {dot && <span aria-hidden className={badgeDotVariants({ tone: dot })} />}
    {children}
  </span>
)
