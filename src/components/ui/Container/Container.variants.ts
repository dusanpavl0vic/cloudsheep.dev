import { cva } from 'class-variance-authority'

export const containerVariants = cva('mx-auto w-full px-5 sm:px-8 lg:px-10', {
  variants: {
    width: {
      wide: 'max-w-[1280px]',
      content: 'max-w-[1200px]',
      article: 'max-w-[1040px]',
      narrow: 'max-w-[760px]',
      text: 'max-w-[720px]',
    },
  },
  defaultVariants: {
    width: 'wide',
  },
})
