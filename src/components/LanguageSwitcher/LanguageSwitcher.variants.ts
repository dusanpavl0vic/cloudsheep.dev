import { cva } from 'class-variance-authority'

export const languageSwitcherVariants = cva(
  'inline-flex overflow-hidden rounded-full border border-border',
)

export const languageOptionVariants = cva(
  'px-3 py-1 font-mono text-xs lowercase transition-colors',
  {
    variants: {
      active: {
        true: 'bg-primary text-primary-foreground',
        false: 'text-muted-foreground hover:bg-muted hover:text-foreground',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
)
