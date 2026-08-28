import { cva } from 'class-variance-authority'

export const formVariants = cva('flex flex-col gap-10')

/** Sekcija CV-a — naslov, opis, sadržaj. */
export const sectionVariants = cva('flex flex-col gap-4')

export const sectionHeadVariants = cva('flex items-baseline justify-between gap-4')

export const sectionTitleVariants = cva('font-heading text-[17px] font-bold text-foreground')

export const sectionHintVariants = cva('text-[13px] text-muted-foreground')

/**
 * Jedan red kolekcije — posao, projekat, veština, jezik.
 *
 * Okvir postoji da bi se videlo gde jedna stavka počinje a druga se završava: bez njega se
 * pri četiri posla sa po osam polja ne razaznaje čije je koje polje.
 */
export const rowVariants = cva('flex flex-col gap-4 rounded-xl border border-border bg-card p-4')

export const rowHeadVariants = cva('flex items-center justify-between gap-3')

export const rowTitleVariants = cva('font-mono text-[12px] tracking-wide text-faint uppercase')

/** Dve kolone od `sm` naviše; na telefonu se sve slaže u jednu. */
export const gridVariants = cva('grid grid-cols-1 gap-4 sm:grid-cols-2')

/** Uski parovi — godina i mesec stoje jedno uz drugo i na telefonu. */
export const pairVariants = cva('grid grid-cols-2 gap-3')

export const actionsVariants = cva(
  'sticky bottom-0 -mx-1 flex flex-wrap items-center gap-3 border-t border-border bg-background/95 px-1 py-4 backdrop-blur',
)

export const emptyVariants = cva(
  'rounded-xl border border-dashed border-border/70 px-4 py-6 text-center text-[13.5px] text-faint',
)
