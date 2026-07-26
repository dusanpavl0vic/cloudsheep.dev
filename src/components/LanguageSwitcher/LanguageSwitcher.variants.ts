import { cva } from 'class-variance-authority'

export const languageSwitcherVariants = cva('relative')

export const languageTriggerVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border border-border-strong px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground',
)

export const languageMenuVariants = cva(
  'menu-in absolute top-[calc(100%+8px)] right-0 z-70 min-w-[136px] overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-xl shadow-inverse/15',
)

export const languageOptionVariants = cva(
  'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[13px] transition-colors',
  {
    variants: {
      active: {
        true: 'bg-muted font-semibold text-foreground',
        false: 'text-muted-foreground hover:bg-muted hover:text-foreground',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
)
