import { cva } from 'class-variance-authority'

export const statItemVariants = cva('flex flex-col gap-1 border-l-2 pl-3.5', {
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

export const statValueVariants = cva('font-heading text-[32px] leading-none font-bold text-foreground')

export const statLabelVariants = cva('font-mono text-[11.5px] tracking-wide lowercase text-faint')
