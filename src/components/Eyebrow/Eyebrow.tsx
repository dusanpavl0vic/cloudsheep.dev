import type { VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

import { eyebrowVariants } from './Eyebrow.variants'

type EyebrowProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof eyebrowVariants>

export const Eyebrow = ({ className, tone, ...props }: EyebrowProps) => (
  <span className={cn(eyebrowVariants({ tone }), className)} {...props} />
)
