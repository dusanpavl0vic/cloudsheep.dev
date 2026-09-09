import { cva } from 'class-variance-authority'

import { glassVariants } from '../lib/surface.variants'

/**
 * `m-auto` je OBAVEZAN, ne ukras.
 *
 * Pretraživač modalni `<dialog>` centrira preko `margin: auto` u svom podrazumevanom stilu,
 * ali Tailwind preflight postavlja `margin: 0` na SVE elemente i time to poništi — pa se
 * dijalog zalepi za gornji levi ugao. `max-h` + `overflow-y-auto` drže dugmad na ekranu
 * i kad je sadržaj duži od prozora.
 */
export const dialogVariants = cva(
  [
    glassVariants({ radius: 'md', elevation: 'floating', overlay: true }),
    'm-auto max-h-[calc(100dvh-4rem)] w-[calc(100vw-2rem)] overflow-y-auto p-0 text-foreground',
    // Zastor iza dijaloga muti STRANICU, ne sebe — otud `backdrop:`, a ne `overlay` varijanta.
    'backdrop:bg-foreground/40 backdrop:backdrop-blur-sm',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export const dialogHeaderVariants = cva('border-b border-border px-6 py-4')

export const dialogTitleVariants = cva('font-heading text-lg font-semibold')

export const dialogBodyVariants = cva('px-6 py-5 text-[15px] text-muted-foreground')

export const dialogFooterVariants = cva(
  'flex flex-wrap justify-end gap-2.5 border-t border-border px-6 py-4',
)
