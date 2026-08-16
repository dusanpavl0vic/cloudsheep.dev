import { cva } from 'class-variance-authority'

export const pageHeaderVariants = cva('flex flex-col gap-3.5')

/**
 * Naslov na `text-display` (skoro crna), kao i naslovi sekcija.
 *
 * Ranije je bio `text-foreground` (plavo mastilo), pa su podstranice imale drugačiji
 * kontrast od landinga. Uz to su postojale TRI različite `clamp` skale — ova, i po jedna
 * ručno napisana u `ContactPage` i `ProjectPage`.
 */
export const pageHeaderTitleVariants = cva(
  'font-heading text-[clamp(2.8rem,6.5vw,4.8rem)] leading-[0.98] font-bold tracking-[-0.04em] text-display text-balance',
)

/** Prigušeni nastavak naslova — isti obrazac kao u sekcijama (docs/22 §1). */
export const pageHeaderMutedVariants = cva('text-faint')

export const pageHeaderSubtitleVariants = cva(
  'max-w-[560px] text-[17.5px] leading-relaxed text-muted-foreground text-pretty',
)

/** Povratni link iznad naslova — case study ga koristi umesto labele. */
export const pageHeaderBackVariants = cva(
  'inline-flex w-fit items-center gap-1.5 font-mono text-[13px] text-muted-foreground transition-colors hover:text-foreground',
)
