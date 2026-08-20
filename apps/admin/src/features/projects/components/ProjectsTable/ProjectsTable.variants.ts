import { cva } from 'class-variance-authority'

export const statusBadgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[12.5px] font-semibold',
  {
    variants: {
      published: {
        true: 'bg-success/15 text-success',
        false: 'bg-muted text-muted-foreground',
      },
    },
    defaultVariants: { published: false },
  },
)

export const rowActionsVariants = cva('flex justify-end gap-2')
