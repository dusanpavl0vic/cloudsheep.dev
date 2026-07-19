import { cva } from 'class-variance-authority'

export const eyebrowVariants = cva('font-mono text-xs tracking-wider lowercase', {
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
})
