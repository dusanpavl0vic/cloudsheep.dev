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
    glassVariants({ radius: 'md', elevation: 'flat' }),
    // `-mt-7`: traka se podvlači pod kosu ivicu hero-a, pa dijagonala teče bez prekida.
    // Bez toga između njih ostaje klin nepokrivene podloge.
    'relative -mx-[2%] -mt-7 mb-14 w-[104%] -rotate-2 overflow-hidden border-transparent py-6 select-none',
    /*
     * Meko gašenje po VISINI, 10px gore i dole.
     *
     * Traka ostaje traka — 10px na 88px visine se čita kao mek rub, ne kao nestajanje. Bez
     * ovoga su joj ivice bile najgrublji prelaz na stranici posle headera (54 nivoa razlike
     * na jednom pikselu), jer je zarotirana ploča sekla auroru pod uglom.
     */
    'mask-[linear-gradient(to_bottom,transparent,#000_10px,#000_calc(100%-10px),transparent)]',
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
  // `from-glass`, ne `from-card`: `card` je NEPROVIDNA boja i unutar providne trake je
  // bila vidljiva zakrpa na oba kraja.
  'pointer-events-none absolute inset-y-0 z-10 w-24 from-glass to-transparent',
  {
    variants: {
      side: {
        left: 'left-0 bg-linear-to-r',
        right: 'right-0 bg-linear-to-l',
      },
    },
  },
)
