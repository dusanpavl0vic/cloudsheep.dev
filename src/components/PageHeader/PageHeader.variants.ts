import { cva } from 'class-variance-authority'

export const pageHeaderVariants = cva('flex flex-col gap-3.5')

export const pageHeaderTitleVariants = cva(
  'font-heading text-[clamp(3rem,7vw,5.5rem)] leading-[0.95] font-bold tracking-[-0.045em] text-foreground text-balance',
)

export const pageHeaderSubtitleVariants = cva(
  'max-w-[560px] text-[17.5px] leading-relaxed text-muted-foreground text-pretty',
)
