import { cva } from 'class-variance-authority'

export const cardVariants = cva(
  'rounded-xl border border-border bg-card text-card-foreground shadow-sm',
)

export const cardHeaderVariants = cva('flex flex-col gap-1.5 p-8')

export const cardTitleVariants = cva('font-heading text-xl leading-none font-semibold text-primary')

export const cardContentVariants = cva('p-8 pt-0')
