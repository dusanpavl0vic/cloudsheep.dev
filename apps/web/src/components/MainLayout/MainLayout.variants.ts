import { cva } from 'class-variance-authority'

/**
 * Spoljna podloga — malo tamnija od stranice, da okvir ima na čemu da lebdi.
 * Motiv iz reference (docs/22): sadržaj je „list" položen na sto, ne zalepljen za ivicu ekrana.
 */
export const appBackdropVariants = cva('min-h-dvh bg-muted/70 lg:p-3')

/**
 * Sam okvir stranice.
 *
 * `overflow-clip`, ne `overflow-hidden`: `hidden` pravi novi scroll kontejner i lomi
 * `position: sticky` na headeru. `clip` seče isto, a sticky nastavlja da radi.
 */
export const appFrameVariants = cva(
  'flex min-h-dvh flex-1 flex-col overflow-clip bg-background lg:min-h-[calc(100dvh-1.5rem)] lg:rounded-[28px] lg:shadow-[0_1px_2px_rgb(0_0_0/0.04),0_24px_64px_-24px_rgb(0_0_0/0.18)] lg:ring-1 lg:ring-border/60 lg:ring-inset',
)
