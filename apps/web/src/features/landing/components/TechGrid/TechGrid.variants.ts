import { cva } from 'class-variance-authority'

/**
 * Mreža logotipa na bledim linijama.
 *
 * Ranije: dva reda po osam sa uvučenim drugim redom — čitalo se kao tabela.
 * Sada: redovi nejednake dužine, pločice tri veličine i mali uspravni pomak po stavci.
 *
 * Veličina i pomak se **izvode iz indeksa**, ne pišu ručno po pločici: lista tehnologija
 * se menja često, a raspored koji zavisi od ručnih vrednosti bi se raspao pri prvoj izmeni.
 */
export const techGridWrapVariants = cva('relative')

export const techGridLinesVariants = cva(
  'pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_right,currentColor_0_1px,transparent_1px_128px),repeating-linear-gradient(to_bottom,currentColor_0_1px,transparent_1px_128px)] text-border/70 [mask-image:radial-gradient(ellipse_80%_75%_at_50%_50%,#000_35%,transparent_100%)]',
)

export const techGridListVariants = cva('relative flex flex-col gap-5 md:gap-7')

export const techGridRowVariants = cva('flex flex-wrap items-center justify-center gap-4 md:gap-6')

/** Uspravni pomak — samo od `md` naviše; na uskom ekranu bi lomio red. */
export const techGridItemVariants = cva('list-none', {
  variants: {
    lift: {
      none: '',
      up: 'md:-translate-y-3',
      down: 'md:translate-y-3',
    },
  },
  defaultVariants: { lift: 'none' },
})
