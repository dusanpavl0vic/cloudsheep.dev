import { cva } from 'class-variance-authority'

export const pricingCardVariants = cva(
  'relative flex flex-col gap-3 rounded-xl border bg-card p-8 transition-shadow',
  {
    variants: {
      featured: {
        true: 'border-2 border-primary shadow-lg',
        false: 'border-border',
      },
    },
    defaultVariants: {
      featured: false,
    },
  },
)

export const pricingTitleVariants = cva('font-heading text-xl font-semibold text-primary')

export const pricingPriceVariants = cva('font-mono text-xs tracking-wide lowercase text-accent')

export const pricingTextVariants = cva('text-sm leading-relaxed text-muted-foreground')

export const pricingFeatureListVariants = cva('flex flex-col gap-2 pt-2')

export const pricingFeatureVariants = cva('flex items-start gap-2 text-sm text-muted-foreground')

export const pricingBadgeVariants = cva('absolute -top-3 left-8')
