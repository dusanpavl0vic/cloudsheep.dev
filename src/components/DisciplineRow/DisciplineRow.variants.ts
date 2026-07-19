import { cva } from 'class-variance-authority'

export const disciplineRowVariants = cva(
  'grid grid-cols-1 items-center gap-4 border-t py-8 transition-colors md:grid-cols-[110px_1.1fr_1.4fr_40px] md:gap-6',
  {
    variants: {
      emphasis: {
        first: 'border-t-2 border-primary',
        default: 'border-border',
      },
    },
    defaultVariants: {
      emphasis: 'default',
    },
  },
)

export const disciplineIndexVariants = cva(
  'font-mono text-xs tracking-wide lowercase text-muted-foreground',
)

export const disciplineTitleVariants = cva('font-heading text-xl font-semibold text-primary')

export const disciplineTextVariants = cva('text-sm leading-relaxed text-muted-foreground')

export const disciplineArrowVariants = cva(
  'hidden text-muted-foreground transition-transform group-hover:translate-x-1 md:block md:justify-self-end',
)
