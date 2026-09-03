import { cva } from 'class-variance-authority'

/**
 * Oblačići misli oko hero naslova (docs/22 §3b).
 *
 * Sama ploha i rep žive u `@/components/ThoughtBubble` — ovde su samo raspored i tipografija
 * sadržaja. Materijal je papir koji se **ne invertuje** (`bg-plate`), pa se unutra ne sme
 * koristiti `text-foreground` ni `text-muted-*`: u tamnoj temi bi postali skoro beli i
 * nestali sa svetlog papira. Otud `plate-ink` varijante svuda ispod.
 */

/**
 * Lebdeći raspored — samo `xl` i naviše.
 *
 * Ispod te širine oblačići nemaju gde: naslov je centriran i zauzima celu širinu, pa bi svaka
 * pozicija sa strane pala preko njega. Dekoracija koja pokriva naslov nije dekoracija.
 */
export const heroFloatVariants = cva('pointer-events-none absolute inset-0 z-0')

export const heroCardTitleVariants = cva(
  'mb-2.5 font-mono text-[10.5px] tracking-[0.14em] text-plate-ink-muted uppercase',
)

export const heroTaskRowVariants = cva('flex items-center gap-2.5 py-1.5')

export const heroTaskLabelVariants = cva('flex-1 text-[12.5px] text-plate-ink-muted')

/** Traka napretka — statična ilustracija, ne stvarni napredak. */
export const heroTaskBarVariants = cva('h-1.5 w-16 overflow-hidden rounded-full bg-plate-line/30')

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
  'font-heading text-[26px] leading-none font-bold text-plate-ink',
)

/**
 * Žuta misao je namerno **najveća u grupi**: ona jedina nosi rečenicu koja se čita, a ne
 * status. Raste kroz širinu; slova ostaju 13.5px, kao u ostalim misli.
 */
export const heroNoteTextVariants = cva(
  'max-w-[232px] text-[13.5px] leading-snug text-[oklch(38%_0.06_75)]',
)

/**
 * Red pločica u misli „stack".
 *
 * `min-w` postoji jer tri pločice od 32px daju oblak uži od ostalih, pa je u grupi izgledao
 * kao omaška. Razmak radi ostatak posla — pločice ostaju iste veličine.
 */
export const heroStackRowVariants = cva('flex min-w-[188px] justify-center gap-4')
