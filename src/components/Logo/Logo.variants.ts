import { cva } from 'class-variance-authority'

export const logoVariants = cva('inline-flex items-center gap-2.5')

export const logoMarkVariants = cva('shrink-0', {
  variants: {
    tone: {
      default: 'text-primary',
      inverse: 'text-inverse-primary',
    },
    size: {
      sm: 'size-[34px]',
      md: 'size-10',
      lg: 'size-14',
    },
  },
  defaultVariants: {
    tone: 'default',
    size: 'sm',
  },
})

export const logoWordmarkVariants = cva('font-heading leading-none font-bold tracking-tight', {
  variants: {
    tone: {
      default: 'text-foreground',
      inverse: 'text-inverse-foreground',
    },
    size: {
      sm: 'text-[19px]',
      md: 'text-[23px]',
      lg: 'text-2xl',
    },
  },
  defaultVariants: {
    tone: 'default',
    size: 'sm',
  },
})
