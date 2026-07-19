import { cva } from 'class-variance-authority'

export const workItemVariants = cva(
  'grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12',
  {
    variants: {
      media: {
        start: '',
        /** Slika desno — tekst ide u prvu kolonu */
        end: '',
      },
    },
    defaultVariants: {
      media: 'start',
    },
  },
)

export const workMediaVariants = cva(
  'flex aspect-[16/10] items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground',
  {
    variants: {
      media: {
        start: 'md:order-1',
        end: 'md:order-2',
      },
    },
    defaultVariants: {
      media: 'start',
    },
  },
)

export const workBodyVariants = cva('flex flex-col gap-3', {
  variants: {
    media: {
      start: 'md:order-2',
      end: 'md:order-1',
    },
  },
  defaultVariants: {
    media: 'start',
  },
})

export const workIndexVariants = cva('font-mono text-xs tracking-wide text-muted-foreground')

export const workTitleVariants = cva('font-heading text-3xl font-bold text-primary')

export const workMetaVariants = cva('font-mono text-xs tracking-wide lowercase text-accent')

export const workTextVariants = cva('text-sm leading-relaxed text-muted-foreground')

export const workCaptionVariants = cva('font-mono text-xs tracking-wide lowercase')
