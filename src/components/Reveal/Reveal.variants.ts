import { cva } from 'class-variance-authority'

export const revealVariants = cva('reveal', {
  variants: {
    direction: {
      up: '',
      left: 'reveal-left',
      right: 'reveal-right',
    },
  },
  defaultVariants: {
    direction: 'up',
  },
})
