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
 * Animira se `stroke-dashoffset`, ne širina ili `clip-path` — SVG obim je poznat, pa je
 * pomeraj tačan do decimale i ne izaziva relayout.
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

/**
 * Luk-tragač koji se vrti dok se prsten puni, pa nestane.
 *
 * Bez njega punjenje izgleda kao statična vrednost koja je „skočila"; sa njim se čita
 * kao učitavanje koje se završilo. Rotira se `transform`-om, dakle na compositor-u.
 */
export const progressSweepVariants = cva(
  'cs-ring-sweep origin-center stroke-current transition-opacity duration-500 motion-reduce:animate-none',
  {
    variants: {
      tone: {
        default: 'text-foreground',
        accent: 'text-primary',
        inverse: 'text-inverse-primary',
      },
      state: {
        loading: 'opacity-70',
        done: 'opacity-0',
      },
    },
    defaultVariants: { tone: 'accent', state: 'done' },
  },
)

/** Sjaj iza prstena — jača kako se popunjava, pa „upaljeno" stanje ima težinu. */
export const progressGlowVariants = cva(
  'pointer-events-none absolute inset-2 rounded-full blur-xl transition-opacity duration-[1400ms] motion-reduce:transition-none',
  {
    variants: {
      tone: {
        default: 'bg-foreground/25',
        accent: 'bg-primary/30',
        inverse: 'bg-inverse-primary/35',
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
