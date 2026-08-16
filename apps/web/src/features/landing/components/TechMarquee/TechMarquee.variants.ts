import { cva } from 'class-variance-authority'

/**
 * Dijagonalna traka preko cele širine.
 *
 * `-rotate-2` na kontejneru, a `w-[104%] -mx-[2%]` da rotacija ne otkrije prazne uglove.
 * `overflow-hidden` je obavezan: bez njega druga kopija liste širi stranicu i pravi
 * horizontalni skrol.
 */
export const techMarqueeVariants = cva(
  'relative -mx-[2%] w-[104%] -rotate-2 overflow-hidden border-y border-inverse-border bg-inverse py-4 select-none',
)

/** Traka koja klizi. Sadrži DVE identične kopije liste. */
export const techTrackVariants = cva('cs-marquee flex w-max items-center')

/** Jedna kopija liste. */
export const techGroupVariants = cva('flex shrink-0 items-center')

export const techItemVariants = cva(
  'flex items-center gap-2.5 px-7 font-mono text-[13px] tracking-wide whitespace-nowrap text-inverse-muted',
)

export const techIconVariants = cva('size-[18px] shrink-0 text-inverse-primary')

/** Zvezdica između stavki — dekoracija, kao na referentnom dizajnu. */
export const techSeparatorVariants = cva('text-[11px] text-inverse-faint')

/** Meko gašenje na krajevima, da stavke ne „iskaču" iz trake. */
export const techEdgeVariants = cva(
  'pointer-events-none absolute inset-y-0 z-10 w-24 from-inverse to-transparent',
  {
    variants: {
      side: {
        left: 'left-0 bg-linear-to-r',
        right: 'right-0 bg-linear-to-l',
      },
    },
  },
)
