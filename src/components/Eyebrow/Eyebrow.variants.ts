import { cva } from 'class-variance-authority'

export const eyebrowVariants = cva(
  'inline-flex items-center gap-2 font-mono text-[13px] tracking-wide',
  {
    variants: {
      tone: {
        muted: 'text-muted-foreground',
        primary: 'text-primary',
        inverse: 'text-inverse-muted',
      },
    },
    defaultVariants: {
      tone: 'muted',
    },
  },
)

export const eyebrowMarkerVariants = cva('font-semibold', {
  variants: {
    tone: {
      muted: 'text-primary',
      primary: 'text-primary',
      inverse: 'text-inverse-primary',
    },
  },
  defaultVariants: {
    tone: 'muted',
  },
})
