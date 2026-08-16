import { cva } from 'class-variance-authority'

/**
 * Kartice oko hero naslova (motiv sa reference).
 *
 * **Ostaju bele u obe teme** (`bg-plate` + `text-plate-ink`), namerno. To je jedina grupa
 * površina u app-i koja se ne invertuje pored diplome i pločica logotipa — obrazloženje i
 * granica su u `docs/22 §4b`. Ovde radi zato što kartice lebde IZNAD hero podloge, pa u
 * tamnoj temi čitaju kao papir na stolu; da su deo toka stranice, bile bi svetla mrlja.
 *
 * Praktična posledica: unutar njih se ne sme koristiti `text-foreground` ni `text-muted-*` —
 * u tamnoj temi bi postali skoro beli i nestali sa belog papira. Otud `plate-ink` varijante.
 */
export const heroCardVariants = cva(
  'rounded-2xl bg-plate p-4 text-plate-ink shadow-[0_2px_6px_rgb(0_0_0/0.05),0_20px_44px_-18px_rgb(0_0_0/0.22)] ring-1 ring-plate-line/25 ring-inset',
)

/** Žuta beleška — jedina topla površina na stranici, zato je i primetna. Boja je fiksna. */
export const heroNoteVariants = cva(
  'rounded-2xl bg-[oklch(93%_0.09_98)] p-4 shadow-[0_2px_6px_rgb(0_0_0/0.06),0_18px_40px_-16px_rgb(0_0_0/0.24)]',
)

/**
 * Lebdeći raspored — samo `xl` i naviše.
 *
 * Ispod te širine kartice nemaju gde: naslov je centriran i zauzima celu širinu, pa bi svaka
 * pozicija sa strane pala preko njega. Zato tamo ide traka (ispod), a ne sitniji floateri —
 * dekoracija koja pokriva naslov nije dekoracija.
 */
export const heroFloatVariants = cva('pointer-events-none absolute inset-0 z-0')

/**
 * Traka ispod poziva na akciju — mobilni i tablet.
 *
 * **Lista se vodoravno na obe širine.** Prelamanje u dva reda je probano i pojede pola
 * hero-a na tabletu; jedan red koji se prevlači zauzima uvek isto.
 *
 * U normalnom je toku, pa ne može da prekrije naslov — što je razlog zbog kog uopšte postoji.
 *
 * Negativne margine + padding: kartice smeju da „izlaze" iz ivice sekcije, inače bi poslednja
 * izgledala odsečeno umesto da poziva na prevlačenje. Traka za skrolovanje se sakriva na oba
 * motora (`scrollbar-width` i `::-webkit-scrollbar`) — sam pomak kartica je dovoljan nagoveštaj.
 */
export const heroStripVariants = cva(
  'relative z-10 -mx-5 mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:hidden',
)

/** Kartica u traci — fiksna širina da vodoravno listanje ima ritam. */
export const heroStripItemVariants = cva('w-[min(230px,72vw)] shrink-0 snap-start text-start')

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

export const heroNoteTextVariants = cva(
  'max-w-[190px] text-[13.5px] leading-snug text-[oklch(38%_0.06_75)]',
)
