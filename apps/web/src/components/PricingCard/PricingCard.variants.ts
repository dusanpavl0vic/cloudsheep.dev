import { cva } from 'class-variance-authority'

/**
 * Istaknuta kartica u grupi (docs/22 §5).
 *
 * Srednja je puna akcenatska i **podignuta** (`lg:-translate-y-4`) — bez toga korisnik
 * ne zna šta preporučujemo. Izdvaja se senkom i podlogom, ne debljom ivicom (§3).
 */
export const pricingCardVariants = cva(
  'relative flex flex-col gap-3.5 rounded-2xl p-8 transition-[box-shadow,transform] duration-300',
  {
    variants: {
      featured: {
        true: 'bg-primary text-primary-foreground shadow-[0_2px_6px_rgb(0_0_0/0.06),0_28px_64px_-20px_color-mix(in_oklch,var(--color-primary)_55%,transparent)] lg:-translate-y-4 lg:scale-[1.03]',
        false:
          'bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_-12px_rgb(0_0_0/0.14)] ring-1 ring-border/50 ring-inset hover:shadow-[0_2px_6px_rgb(0_0_0/0.06),0_24px_48px_-16px_rgb(0_0_0/0.2)]',
      },
    },
    defaultVariants: {
      featured: false,
    },
  },
)

export const pricingTitleVariants = cva('font-heading text-[22px] font-semibold', {
  variants: {
    featured: { true: 'text-primary-foreground', false: 'text-foreground' },
  },
  defaultVariants: { featured: false },
})

export const pricingPriceVariants = cva('font-mono text-[13px] tracking-wide lowercase', {
  variants: {
    featured: { true: 'text-primary-foreground/70', false: 'text-faint' },
  },
  defaultVariants: { featured: false },
})

export const pricingTextVariants = cva('flex-1 text-[15px] leading-relaxed', {
  variants: {
    featured: { true: 'text-primary-foreground/85', false: 'text-muted-foreground' },
  },
  defaultVariants: { featured: false },
})

export const pricingFeatureListVariants = cva('flex flex-col gap-2.5 pt-2')

export const pricingFeatureVariants = cva('flex items-start gap-2 text-[14.5px]', {
  variants: {
    featured: { true: 'text-primary-foreground/85', false: 'text-muted-foreground' },
  },
  defaultVariants: { featured: false },
})

export const pricingBadgeVariants = cva(
  'absolute -top-3 right-6 bg-card text-primary shadow-[0_2px_8px_rgb(0_0_0/0.12)] ring-1 ring-border/60 ring-inset',
)
