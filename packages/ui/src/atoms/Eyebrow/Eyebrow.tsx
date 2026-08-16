import type { VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { eyebrowVariants } from './Eyebrow.variants'
import { cn } from '../../lib/cn'

type EyebrowProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof eyebrowVariants>

export const Eyebrow = ({ className, tone, children, ...props }: EyebrowProps) => (
  <span className={cn(eyebrowVariants({ tone }), className)} {...props}>
    {children}
  </span>
)
