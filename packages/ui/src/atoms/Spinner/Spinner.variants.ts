import { cva } from 'class-variance-authority'

export const spinnerVariants = cva(
  'inline-block animate-spin rounded-full border-current border-e-transparent motion-reduce:animate-none',
  {
    variants: {
      size: {
        sm: 'size-4 border-2',
        md: 'size-6 border-2',
        lg: 'size-9 border-[3px]',
      },
    },
    defaultVariants: { size: 'md' },
  },
)
