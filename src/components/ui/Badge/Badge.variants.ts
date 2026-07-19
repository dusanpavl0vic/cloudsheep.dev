import { cva } from 'class-variance-authority'

export const badgeVariants = cva(
  'inline-flex items-center gap-2 whitespace-nowrap transition-colors',
  {
    variants: {
      variant: {
        outline: 'border border-input text-muted-foreground',
        solid: 'bg-primary text-primary-foreground',
        accent: 'bg-accent text-accent-foreground',
        plain: 'text-muted-foreground',
        inverse: 'border border-inverse-border text-inverse-muted',
      },
      size: {
        sm: 'px-3 py-1 text-xs',
        md: 'px-4 py-1.5 text-sm',
      },
      shape: {
        pill: 'rounded-full',
        square: 'rounded-md',
      },
      font: {
        sans: 'font-sans',
        mono: 'font-mono tracking-wide lowercase',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'sm',
      shape: 'pill',
      font: 'mono',
    },
  },
)

export const badgeDotVariants = cva('size-2 shrink-0 rounded-full', {
  variants: {
    tone: {
      success: 'bg-success shadow-[0_0_0_4px] shadow-success/20',
      accent: 'bg-accent shadow-[0_0_0_4px] shadow-accent/20',
    },
  },
  defaultVariants: {
    tone: 'success',
  },
})
