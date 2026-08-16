import { cva } from 'class-variance-authority'

/** Grb i tekst stoje jedno pored drugog; na uskom ekranu se slažu i centriraju. */
export const credentialSealVariants = cva(
  'inline-flex flex-col items-center gap-4 text-center sm:flex-row sm:gap-5 sm:text-start',
)

/**
 * Pločica ispod grba — jedino mesto gde se koristi `bg-plate`.
 *
 * Grb je tamno plav sa providnom pozadinom. Na `bg-card` bi u tamnoj temi nestao,
 * pa mu treba podloga koja se ne invertuje. Krug, a ne squircle: grb je i sam krug,
 * pa bi ga zaobljen kvadrat uokvirio dvaput.
 */
export const credentialPlateVariants = cva(
  'grid size-[72px] shrink-0 place-items-center rounded-full bg-plate p-1.5 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_20px_-8px_rgb(0_0_0/0.18)] ring-1 ring-border/50 ring-inset',
)

export const credentialImageVariants = cva('size-full object-contain')

export const credentialTextVariants = cva('flex flex-col gap-0.5')

/** Zvanje — nosivi podatak, pa ide u punoj boji teksta. */
export const credentialDegreeVariants = cva(
  'text-[14.5px] leading-snug font-medium text-foreground',
)

/** Ustanova — dopuna, prigušena i u mono ritmu kao ostale meta labele. */
export const credentialInstitutionVariants = cva(
  'font-mono text-[12.5px] leading-snug text-muted-foreground',
)
