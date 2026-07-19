import { cva } from 'class-variance-authority'

export const studioGridVariants = cva('grid grid-cols-1 gap-12 lg:grid-cols-[340px_1fr] lg:gap-16')

export const studioIndexVariants = cva(
  'font-heading text-7xl leading-none font-bold text-muted-foreground/30 lg:text-[104px]',
)

export const studioTitleVariants = cva(
  'font-heading text-4xl font-bold text-primary lg:text-[44px]',
)

export const studioLeadVariants = cva('text-xl leading-relaxed text-primary')

export const studioTextVariants = cva('max-w-[640px] leading-relaxed text-muted-foreground')

export const studioStatsVariants = cva('grid grid-cols-2 gap-6 pt-4 md:grid-cols-4')

export const studioStackRowVariants = cva(
  'flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4',
)

export const studioStackLabelVariants = cva(
  'w-[78px] shrink-0 font-mono text-xs tracking-wide lowercase text-muted-foreground',
)
