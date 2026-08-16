import { cva } from 'class-variance-authority'

/**
 * Squircle pločica sa logotipom — glavni motiv reference (docs/22 §3).
 * Bela podloga, meka senka, veliki radijus; logo je obojen i stoji u sredini.
 */
export const techTileVariants = cva(
  'grid shrink-0 place-items-center rounded-[22%] bg-card shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_20px_-8px_rgb(0_0_0/0.18)] ring-1 ring-border/50 ring-inset',
  {
    variants: {
      size: { sm: 'size-10', md: 'size-14', lg: 'size-[68px]' },
      interactive: {
        true: 'transition-shadow duration-300 hover:shadow-[0_2px_4px_rgb(0_0_0/0.06),0_14px_28px_-10px_rgb(0_0_0/0.24)]',
        false: '',
      },
    },
    defaultVariants: { size: 'md', interactive: false },
  },
)

export const techTileImageVariants = cva('object-contain', {
  variants: {
    size: { sm: 'size-5', md: 'size-7', lg: 'size-9' },
  },
  defaultVariants: { size: 'md' },
})

/** Rezerva dok SVG fajl nije skinut — inicijal umesto rupe u rasporedu. */
export const techTileFallbackVariants = cva('font-heading font-bold text-faint', {
  variants: {
    size: { sm: 'text-[13px]', md: 'text-[17px]', lg: 'text-[21px]' },
  },
  defaultVariants: { size: 'md' },
})
