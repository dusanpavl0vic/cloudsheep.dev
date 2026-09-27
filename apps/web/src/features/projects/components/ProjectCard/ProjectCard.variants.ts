import { cva } from 'class-variance-authority'

import { glassVariants } from '@app/ui'

/** Elevacija umesto ivice (docs/22 §3): široka bleda senka, veliki radijus. */
export const projectCardVariants = cva(
  [glassVariants({ interactive: true }), 'group flex h-full flex-col overflow-hidden'].join(' '),
)

export const projectMediaVariants = cva(
  // Providno, ne `bg-background`: puna podloga bi u staklenoj kartici bila zakrpa.
  'flex aspect-[16/10] items-center justify-center bg-glass-edge-soft text-faint',
)

export const projectBodyVariants = cva('flex flex-1 flex-col gap-2 p-6')

export const projectTitleVariants = cva(
  'font-heading text-xl font-semibold tracking-tight text-foreground',
)

export const projectYearVariants = cva('font-mono text-xs text-faint')

export const projectCatVariants = cva('font-mono text-[11.5px] tracking-wide text-primary')

export const projectDescVariants = cva('flex-1 text-[14.5px] leading-relaxed text-muted-foreground')
