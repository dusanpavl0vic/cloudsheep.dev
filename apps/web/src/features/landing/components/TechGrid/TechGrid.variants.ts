import { cva } from 'class-variance-authority'

/**
 * Mreža logotipa na bledim linijama (motiv sa reference).
 *
 * Linije su `repeating-linear-gradient`, ne pravi border-i: pločice tako mogu da „lebde"
 * preko preseka umesto da budu zarobljene u ćelijama. Statične su (docs/22 §6).
 */
export const techGridWrapVariants = cva('relative')

export const techGridLinesVariants = cva(
  'pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_right,currentColor_0_1px,transparent_1px_128px),repeating-linear-gradient(to_bottom,currentColor_0_1px,transparent_1px_128px)] text-border/70 [mask-image:radial-gradient(ellipse_80%_75%_at_50%_50%,#000_35%,transparent_100%)]',
)

/** Logotipi u redovima koji se centriraju; drugi red je uvučen kao na referenci. */
export const techGridRowVariants = cva('flex flex-wrap justify-center gap-4 md:gap-5', {
  variants: {
    offset: {
      true: 'md:px-14',
      false: '',
    },
  },
  defaultVariants: { offset: false },
})

export const techGridListVariants = cva('relative flex flex-col gap-4 md:gap-5')

export const techGridItemVariants = cva('list-none')
