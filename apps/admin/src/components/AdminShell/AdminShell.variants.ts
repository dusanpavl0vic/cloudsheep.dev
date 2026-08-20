import { cva } from 'class-variance-authority'

export const shellVariants = cva('flex min-h-dvh')

export const sidebarVariants = cva(
  'flex w-60 shrink-0 flex-col gap-1 border-e border-border bg-card p-4',
)

export const brandVariants = cva('px-3 py-4 font-heading text-lg font-bold text-foreground')

export const navLinkVariants = cva(
  'rounded-lg px-3 py-2 text-[15px] font-medium transition-colors',
  {
    variants: {
      active: {
        true: 'bg-primary/10 text-primary',
        false: 'text-muted-foreground hover:bg-muted hover:text-foreground',
      },
    },
    defaultVariants: { active: false },
  },
)

export const mainVariants = cva('flex min-w-0 flex-1 flex-col')

export const topbarVariants = cva(
  'flex items-center justify-between gap-4 border-b border-border px-8 py-4',
)

export const contentVariants = cva('flex-1 px-8 py-8')
