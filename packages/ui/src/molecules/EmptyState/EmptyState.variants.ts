import { cva } from 'class-variance-authority'

export const emptyStateVariants = cva(
  'flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-14 text-center',
)

export const emptyStateTitleVariants = cva('font-heading text-base font-semibold text-foreground')

export const emptyStateDescriptionVariants = cva('max-w-prose text-[15px] text-muted-foreground')
