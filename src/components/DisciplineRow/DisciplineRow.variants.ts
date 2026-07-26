import { cva } from 'class-variance-authority'

export const disciplineRowVariants = cva(
  'grid grid-cols-1 items-center gap-4 rounded-lg border-t px-2 py-8 transition-colors hover:bg-muted md:grid-cols-[110px_1.1fr_1.4fr_40px] md:gap-6',
  {
    variants: {
      emphasis: {
        first: 'border-t-2 border-foreground',
        default: 'border-border',
      },
    },
    defaultVariants: {
      emphasis: 'default',
    },
  },
)

export const disciplineIndexVariants = cva('font-mono text-[13px] tracking-wide text-faint')

export const disciplineTitleVariants = cva(
  'font-heading text-2xl font-semibold tracking-tight text-foreground',
)

export const disciplineTextVariants = cva('text-[15.5px] leading-relaxed text-muted-foreground')

export const disciplineArrowVariants = cva(
  'hidden text-xl text-primary transition-transform group-hover:translate-x-1 md:block md:justify-self-end',
)
