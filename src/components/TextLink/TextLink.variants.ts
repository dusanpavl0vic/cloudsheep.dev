import { cva } from 'class-variance-authority'

export const textLinkVariants = cva(
  'inline-flex w-fit items-center gap-1.5 border-b-2 border-primary pb-0.5 text-[15px] font-semibold transition-colors',
  {
    variants: {
      tone: {
        default: 'text-foreground hover:text-primary',
        inverse: 'text-inverse-foreground hover:text-inverse-primary',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
)
