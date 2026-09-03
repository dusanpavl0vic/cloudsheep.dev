import { cva } from 'class-variance-authority'
/** Uži tok za pasuse — preko ~80 znakova po redu čitljivost pada (docs/22). */
export const studioBodyVariants = cva('mx-auto flex max-w-[680px] flex-col gap-5 text-center')

export const studioLeadVariants = cva(
  'text-[clamp(1.05rem,1.7vw,1.28rem)] leading-relaxed text-pretty text-foreground',
)

export const studioTextVariants = cva(
  'text-[16.5px] leading-relaxed text-pretty text-muted-foreground',
)
