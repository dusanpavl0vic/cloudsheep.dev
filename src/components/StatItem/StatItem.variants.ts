import { cva } from 'class-variance-authority'

export const statItemVariants = cva('flex flex-col gap-1 border-l-2 pl-4', {
  variants: {
    tone: {
      primary: 'border-primary',
      accent: 'border-accent',
    },
  },
  defaultVariants: {
    tone: 'primary',
  },
})

export const statValueVariants = cva('font-heading text-3xl leading-none font-bold text-primary')

export const statLabelVariants = cva(
  'font-mono text-xs tracking-wide lowercase text-muted-foreground',
)
