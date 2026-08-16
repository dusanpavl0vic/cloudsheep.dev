import { cva } from 'class-variance-authority'

/**
 * Lebdeće kartice oko hero naslova (motiv sa reference).
 *
 * Sve su `absolute`, `aria-hidden` i **skrivene ispod `xl`**: na užem ekranu nema mesta,
 * a gurati ih pod tekst bi napravilo zbrku umesto utiska. Dekoracija koja smeta nije dekoracija.
 */
export const heroCardVariants = cva(
  'absolute hidden rounded-2xl bg-card p-4 shadow-[0_2px_6px_rgb(0_0_0/0.05),0_20px_44px_-18px_rgb(0_0_0/0.22)] ring-1 ring-border/50 ring-inset xl:block',
)

/** Žuta beleška — jedina topla površina na stranici, zato je i primetna. */
export const heroNoteVariants = cva(
  'absolute hidden rounded-lg bg-[oklch(93%_0.09_98)] p-4 shadow-[0_2px_6px_rgb(0_0_0/0.06),0_18px_40px_-16px_rgb(0_0_0/0.24)] xl:block',
)

export const heroNoteTextVariants = cva(
  'max-w-[190px] text-[13.5px] leading-snug text-[oklch(38%_0.06_75)]',
)

export const heroCardTitleVariants = cva(
  'mb-2.5 font-mono text-[10.5px] tracking-[0.14em] text-faint uppercase',
)

export const heroTaskRowVariants = cva('flex items-center gap-2.5 py-1.5')

export const heroTaskLabelVariants = cva('flex-1 text-[12.5px] text-muted-foreground')

/** Traka napretka — statična; punjenje je već zauzeto u ProgressRing-u (docs/22 §6). */
export const heroTaskBarVariants = cva('h-1.5 w-16 overflow-hidden rounded-full bg-muted')

export const heroTaskFillVariants = cva('h-full rounded-full', {
  variants: {
    tone: {
      primary: 'bg-primary',
      success: 'bg-success',
    },
  },
  defaultVariants: { tone: 'primary' },
})

export const heroStatusDotVariants = cva('size-2 shrink-0 rounded-full bg-success')

export const heroStatusValueVariants = cva(
  'font-heading text-[26px] leading-none font-bold text-display',
)
