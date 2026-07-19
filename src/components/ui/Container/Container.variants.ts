import { cva } from 'class-variance-authority'

export const containerVariants = cva('mx-auto w-full px-6 md:px-8', {
  variants: {
    width: {
      wide: 'max-w-[1264px]',
      narrow: 'max-w-[824px]',
      text: 'max-w-[640px]',
    },
  },
  defaultVariants: {
    width: 'wide',
  },
})
