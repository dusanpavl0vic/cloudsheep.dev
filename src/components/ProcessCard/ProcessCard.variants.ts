import { cva } from 'class-variance-authority'

export const processCardVariants = cva('flex flex-col gap-3 border-t-2 pt-5', {
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

export const processIndexVariants = cva('font-mono text-xs tracking-wide text-muted-foreground')

export const processTitleVariants = cva('font-heading text-lg font-semibold text-primary')

export const processTextVariants = cva('flex-1 text-sm leading-relaxed text-muted-foreground')

export const processMetaVariants = cva('font-mono text-xs tracking-wide lowercase', {
  variants: {
    tone: {
      primary: 'text-primary',
      accent: 'text-accent',
    },
  },
  defaultVariants: {
    tone: 'primary',
  },
})
