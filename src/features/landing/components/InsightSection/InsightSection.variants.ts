import { cva } from 'class-variance-authority'

export const insightGridVariants = cva('grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1fr_1.7fr]')

export const insightBlueCardVariants = cva(
  'group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-[20px] bg-primary p-7 text-primary-foreground transition-transform duration-300 hover:-translate-y-1',
)

export const insightPanelVariants = cva(
  'flex flex-wrap items-center gap-9 rounded-[20px] border border-border bg-card p-8',
)

export const insightHeadingVariants = cva(
  'font-heading text-[26px] leading-tight font-bold tracking-tight text-foreground',
)

export const insightTextVariants = cva('text-[16px] leading-relaxed text-muted-foreground')

/** Prsten iskorišćenosti (uptime) — konusni gradijent + tamno jezgro. */
export const gaugeRingVariants = cva(
  'flex size-[154px] shrink-0 items-center justify-center rounded-full',
)

export const gaugeCoreVariants = cva(
  'flex size-[120px] flex-col items-center justify-center rounded-full bg-inverse text-inverse-foreground',
)

export const gaugeValueVariants = cva('font-heading text-[26px] leading-none font-bold')

export const gaugeLabelVariants = cva('mt-1 font-mono text-[10.5px] text-inverse-faint')
