import { cva } from 'class-variance-authority'

export const processCardVariants = cva('flex flex-col gap-2.5 border-t-2 pt-4.5', {
  variants: {
    tone: {
      primary: 'border-foreground',
      accent: 'border-primary',
    },
  },
  defaultVariants: {
    tone: 'primary',
  },
})

export const processIndexVariants = cva('font-mono text-xs tracking-wide text-primary')

export const processTitleVariants = cva('font-heading text-xl font-semibold text-foreground')

export const processTextVariants = cva('flex-1 text-[15px] leading-relaxed text-muted-foreground')

export const processMetaVariants = cva('font-mono text-[11px] tracking-wide lowercase text-faint')
