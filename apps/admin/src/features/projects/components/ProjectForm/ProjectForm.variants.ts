import { cva } from 'class-variance-authority'

export const projectFormVariants = cva('flex flex-col gap-6')

export const projectFormSectionVariants = cva(
  'flex flex-col gap-5 rounded-xl border border-border bg-card p-6',
)

export const projectFormRowVariants = cva('grid gap-5 sm:grid-cols-2')

export const localeTabsVariants = cva('flex gap-2 border-b border-border')

export const localeTabVariants = cva(
  'rounded-t-lg px-4 py-2 text-sm font-semibold transition-colors',
  {
    variants: {
      active: {
        true: 'border-b-2 border-primary text-foreground',
        false: 'text-muted-foreground hover:text-foreground',
      },
    },
    defaultVariants: { active: false },
  },
)
