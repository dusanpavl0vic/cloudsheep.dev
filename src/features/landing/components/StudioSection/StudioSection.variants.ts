import { cva } from 'class-variance-authority'

export const studioGridVariants = cva('grid grid-cols-1 gap-12 lg:grid-cols-[340px_1fr] lg:gap-16')

export const studioIndexVariants = cva(
  'font-heading text-7xl leading-none font-bold text-transparent [-webkit-text-stroke:1.5px_var(--border-strong)] lg:text-[104px]',
)

export const studioTitleVariants = cva(
  'font-heading text-4xl font-bold tracking-tight text-foreground lg:text-[44px]',
)

export const studioLeadVariants = cva(
  'font-heading text-[23px] leading-snug font-medium tracking-tight text-foreground text-pretty',
)

export const studioTextVariants = cva(
  'max-w-[640px] text-[16.5px] leading-relaxed text-muted-foreground text-pretty',
)

export const studioStatsVariants = cva('grid grid-cols-2 gap-6 pt-2 md:grid-cols-4')

export const studioStackRowVariants = cva('flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4')

export const studioStackLabelVariants = cva(
  'w-[78px] shrink-0 font-mono text-[11.5px] tracking-wide lowercase text-faint',
)
