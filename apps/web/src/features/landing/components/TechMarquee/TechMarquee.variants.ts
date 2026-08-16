import { cva } from 'class-variance-authority'

/**
 * Dijagonalna traka sa tehnologijama.
 *
 * Ranije je bila tamna navy traka. Sada prati vizuelni jezik iz docs/22: svetli panel,
 * meka široka senka umesto ivice, veliki radijus. Tamna traka je u okruženju koje je
 * skoro celo svetlo delovala kao zakrpa iz drugog dizajna.
 *
 * `-rotate-2` na kontejneru, `w-[104%] -mx-[2%]` da rotacija ne otkrije prazne uglove.
 * `overflow-hidden` je obavezan — bez njega druga kopija liste širi stranicu.
 */
export const techMarqueeVariants = cva(
  'relative -mx-[2%] my-8 w-[104%] -rotate-2 overflow-hidden bg-card py-6 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_18px_44px_-16px_rgb(0_0_0/0.16)] ring-1 ring-border/50 select-none ring-inset',
)

/** Traka koja klizi. Sadrži DVE identične kopije liste. */
export const techTrackVariants = cva('cs-marquee flex w-max items-center')

export const techGroupVariants = cva('flex shrink-0 items-center')

export const techItemVariants = cva(
  'flex items-center gap-3 px-6 text-[14px] font-medium whitespace-nowrap text-muted-foreground',
)

/**
 * Squircle pločica sa ikonom — motiv iz reference (docs/22 §3).
 * Bela podloga, meka senka, veliki radijus; ikona uzima boju akcenta.
 */
export const techTileVariants = cva(
  'grid size-9 shrink-0 place-items-center rounded-[11px] bg-background text-primary shadow-[0_1px_2px_rgb(0_0_0/0.06),0_4px_10px_-4px_rgb(0_0_0/0.14)] ring-1 ring-border/60 ring-inset',
)

export const techIconVariants = cva('size-[18px]')

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
