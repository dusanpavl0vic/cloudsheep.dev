import type { VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'

import { statItemVariants, statLabelVariants, statValueVariants } from './StatItem.variants'
import { cn } from '../../lib/cn'


type StatItemProps = VariantProps<typeof statItemVariants> & {
  value: ReactNode
  label: ReactNode
  className?: string
}

export const StatItem = ({ value, label, tone, className }: StatItemProps) => (
  <div className={cn(statItemVariants({ tone }), className)}>
    <span className={statValueVariants()}>{value}</span>
    <span className={statLabelVariants()}>{label}</span>
  </div>
)
