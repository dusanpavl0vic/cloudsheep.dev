import { cva } from 'class-variance-authority'

export const progressRingVariants = cva('relative inline-grid place-items-center', {
  variants: {
    size: {
      sm: 'size-20',
      md: 'size-28',
      lg: 'size-36',
    },
  },
  defaultVariants: { size: 'md' },
})

/** Podloga prstena — puna kružnica u prigušenoj boji. */
export const progressTrackVariants = cva('stroke-current opacity-15', {
  variants: {
    tone: {
      default: 'text-foreground',
      accent: 'text-primary',
      inverse: 'text-inverse-foreground',
    },
  },
  defaultVariants: { tone: 'accent' },
})

/**
 * Popunjeni luk.
 *
 * Animira se `stroke-dashoffset`, a ne širina ili `clip-path` — SVG obim je poznat,
 * pa je pomeraj tačan do decimale i ne izaziva relayout. `will-change` je namerno
 * izostavljen: animacija traje jednom pri ulasku u viewport, a trajni sloj kompozicije
 * bi koštao više nego što donosi.
 */
export const progressIndicatorVariants = cva(
  '-rotate-90 origin-center stroke-current transition-[stroke-dashoffset] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
  {
    variants: {
      tone: {
        default: 'text-foreground',
        accent: 'text-primary',
        inverse: 'text-inverse-primary',
      },
    },
    defaultVariants: { tone: 'accent' },
  },
)

export const progressValueVariants = cva(
  'absolute font-heading font-bold tabular-nums tracking-tight',
  {
    variants: {
      size: {
        sm: 'text-[15px]',
        md: 'text-[20px]',
        lg: 'text-[26px]',
      },
      tone: {
        default: 'text-foreground',
        accent: 'text-foreground',
        inverse: 'text-inverse-foreground',
      },
    },
    defaultVariants: { size: 'md', tone: 'accent' },
  },
)
