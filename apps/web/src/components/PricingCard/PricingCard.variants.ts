import { cva } from 'class-variance-authority'

import { glassVariants } from '@app/ui'

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
        // Istaknuta ostaje PUNA plava (§5): staklo bi joj pojelo baš ono po čemu se ističe.
        false: glassVariants({ interactive: true }),
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
  // Značka je sitna: providnost bez `backdrop-blur` (docs/22 §3b-glass).
  'absolute -top-3 right-6 border border-glass-edge-soft bg-glass-strong text-primary shadow-glass',
)
