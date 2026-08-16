import { cva } from 'class-variance-authority'

/**
 * Pečat sa diplomom stoji na mestu na kom je ranije bila pilula „primam projekte za Q3".
 *
 * Zamena nije samo vizuelna: kvartal zastareva svaka tri meseca i sajt datira, a diploma ne.
 * Diploma je sopstvena površina (papir sa svojom senkom), pa je od pasusa deli samo razmak.
 * Nešto veći razmak nego između pasusa — dokument nije nastavak rečenice nego potpis pod njom.
 */
export const studioSealVariants = cva('mt-6')

/** Uži tok za pasuse — preko ~80 znakova po redu čitljivost pada (docs/22). */
export const studioBodyVariants = cva('mx-auto flex max-w-[680px] flex-col gap-5 text-center')

export const studioLeadVariants = cva(
  'text-[clamp(1.05rem,1.7vw,1.28rem)] leading-relaxed text-pretty text-foreground',
)

export const studioTextVariants = cva(
  'text-[16.5px] leading-relaxed text-pretty text-muted-foreground',
)
