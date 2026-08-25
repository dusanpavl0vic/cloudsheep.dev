import { cva } from 'class-variance-authority'

export const logoVariants = cva('inline-flex items-center gap-2.5')

/**
 * `viewBox` marke je 136×126, dakle NIJE kvadratan — zato `h-* w-auto`, nikad `size-*`
 * (`docs/22`). Odnos je 1.08:1, pa je razlika mala, ali `size-*` bi je ipak sabio.
 *
 * **`text-foreground`, ne `text-primary`.** Crtež je isporučen u dubokoj plavoj (`#133E87`),
 * a to je tačno `--foreground` u svetloj temi; akcentna plava (`--primary`, `#1E56E0`)
 * ostaje rezervisana za ono što se klikće.
 */
export const logoMarkVariants = cva('w-auto shrink-0', {
  variants: {
    tone: {
      default: 'text-foreground',
      inverse: 'text-inverse-foreground',
    },
    size: {
      sm: 'h-[34px]',
      md: 'h-10',
      lg: 'h-14',
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

/**
 * Halo i obrub marke. Debljina dolazi iz `--logo-*-width` tokena, koji su u svetloj temi
 * pozitivni a u tamnoj nula — pa se obrub gasi promenom teme, bez grananja u komponenti.
 *
 * Boja haloa je `--logo-halo`, sa `--background` kao podrazumevanim: komponenta ne zna na
 * kojoj površini stoji. Površina koja nije `background` postavlja svoju vrednost.
 */
export const logoHaloVariants = cva(
  '[stroke:var(--logo-halo,var(--background))] [stroke-width:var(--logo-halo-width)]',
)

export const logoEdgeVariants = cva('[stroke-width:var(--logo-edge-width)]')
