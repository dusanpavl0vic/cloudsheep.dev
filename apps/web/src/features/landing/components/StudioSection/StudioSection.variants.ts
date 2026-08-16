import { cva } from 'class-variance-authority'

/**
 * Status dostupnosti — istaknut red, ne sitan badge sa strane.
 *
 * To je jedini podatak u sekciji koji zastareva i jedini na koji posetilac reaguje,
 * pa dobija svoju liniju i zelenu tačku umesto da stoji kao fusnota.
 */
export const availabilityVariants = cva(
  'inline-flex items-center gap-2.5 rounded-full bg-success/10 px-4 py-2 font-mono text-[13px] text-success ring-1 ring-success/20 ring-inset',
)

export const availabilityDotVariants = cva('pulse-dot size-2 shrink-0 rounded-full bg-success')

/** Uži tok za pasuse — preko ~80 znakova po redu čitljivost pada (docs/22). */
export const studioBodyVariants = cva('mx-auto flex max-w-[680px] flex-col gap-5 text-center')

export const studioLeadVariants = cva(
  'text-[clamp(1.05rem,1.7vw,1.28rem)] leading-relaxed text-pretty text-foreground',
)

export const studioTextVariants = cva(
  'text-[16.5px] leading-relaxed text-pretty text-muted-foreground',
)
