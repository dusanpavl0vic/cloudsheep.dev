import { cva } from 'class-variance-authority'

import { glassVariants } from '@app/ui'

/**
 * Dijagonalna traka sa tehnologijama.
 *
 * Prati vizuelni jezik iz docs/22: svetli panel, meka široka senka umesto ivice, veliki
 * radijus. Tamna traka je, kad je sve oko nje postalo svetlo, delovala kao zakrpa.
 *
 * `-rotate-2` na kontejneru, `w-[104%] -mx-[2%]` da rotacija ne otkrije prazne uglove.
 * `overflow-hidden` je obavezan — bez njega druga kopija liste širi stranicu.
 */
export const techMarqueeVariants = cva(
  [
    glassVariants({ radius: 'md' }),
    'relative -mx-[2%] my-10 w-[104%] -rotate-2 overflow-hidden py-6 select-none',
  ].join(' '),
)

/** Traka koja klizi. Sadrži DVE identične kopije liste. */
export const techTrackVariants = cva('cs-marquee flex w-max items-center')

export const techGroupVariants = cva('flex shrink-0 items-center')

export const techItemVariants = cva(
  'flex items-center gap-3 px-6 text-[14px] font-medium whitespace-nowrap text-muted-foreground',
)

/** Meko gašenje na krajevima, da stavke ne „iskaču" iz trake. */
export const techEdgeVariants = cva(
  'pointer-events-none absolute inset-y-0 z-10 w-24 from-card to-transparent',
  {
    variants: {
      side: {
        left: 'left-0 bg-linear-to-r',
        right: 'right-0 bg-linear-to-l',
      },
    },
  },
)
