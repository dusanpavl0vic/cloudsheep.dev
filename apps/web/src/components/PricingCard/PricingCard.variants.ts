import { cva } from 'class-variance-authority'

export const pricingCardVariants = cva(
  'relative flex flex-col gap-3.5 rounded-xl border p-8 transition-shadow',
  {
    variants: {
      featured: {
        true: 'border-2 border-inverse bg-inverse text-inverse-foreground shadow-xl shadow-inverse/20',
        false: 'border-border bg-card',
      },
    },
    defaultVariants: {
      featured: false,
    },
  },
)

export const pricingTitleVariants = cva('font-heading text-[22px] font-semibold', {
  variants: {
    featured: { true: 'text-inverse-foreground', false: 'text-foreground' },
  },
  defaultVariants: { featured: false },
})

export const pricingPriceVariants = cva('font-mono text-[13px] tracking-wide lowercase', {
  variants: {
    featured: { true: 'text-inverse-faint', false: 'text-faint' },
  },
  defaultVariants: { featured: false },
})

export const pricingTextVariants = cva('flex-1 text-[15px] leading-relaxed', {
  variants: {
    featured: { true: 'text-inverse-muted', false: 'text-muted-foreground' },
  },
  defaultVariants: { featured: false },
})

export const pricingFeatureListVariants = cva('flex flex-col gap-2.5 pt-2')

export const pricingFeatureVariants = cva('flex items-start gap-2 text-[14.5px]', {
  variants: {
    featured: { true: 'text-inverse-muted', false: 'text-muted-foreground' },
  },
  defaultVariants: { featured: false },
})

export const pricingBadgeVariants = cva('absolute -top-3 left-7')
