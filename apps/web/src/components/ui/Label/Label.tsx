import type { LabelHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

import { labelVariants } from './Label.variants'

export const Label = ({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn(labelVariants(), className)} {...props} />
)
