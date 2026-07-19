import { cva } from 'class-variance-authority'

export const logoVariants = cva('inline-flex items-center gap-3', {
  variants: {
    tone: {
      default: 'text-primary',
      inverse: 'text-inverse-foreground',
    },
  },
  defaultVariants: {
    tone: 'default',
  },
})

// Marka nije kvadratna (160×137) — dimenzionišemo po visini, širina se računa sama
export const logoMarkVariants = cva('w-auto shrink-0', {
  variants: {
    size: {
      sm: 'h-8',
      md: 'h-9',
      lg: 'h-[480px] max-w-full',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const logoWordmarkVariants = cva('font-heading text-xl leading-none font-bold tracking-tight')
