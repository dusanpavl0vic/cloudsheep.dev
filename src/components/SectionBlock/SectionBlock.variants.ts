import { cva } from 'class-variance-authority'

export const sectionBlockVariants = cva('w-full', {
  variants: {
    spacing: {
      default: 'py-20',
      compact: 'py-14',
      none: 'py-0',
    },
    tone: {
      default: '',
      inverse: 'bg-inverse text-inverse-foreground',
    },
  },
  defaultVariants: {
    spacing: 'default',
    tone: 'default',
  },
})

export const sectionBlockHeadVariants = cva(
  'flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-8',
)

export const sectionBlockTitleVariants = cva(
  'font-heading text-4xl leading-tight font-bold tracking-tight text-balance md:text-[44px]',
  {
    variants: {
      tone: {
        default: 'text-foreground',
        inverse: 'text-inverse-foreground',
      },
      align: {
        start: 'text-left',
        center: 'text-center',
      },
    },
    defaultVariants: {
      tone: 'default',
      align: 'start',
    },
  },
)

export const sectionBlockBodyVariants = cva('pt-8')
