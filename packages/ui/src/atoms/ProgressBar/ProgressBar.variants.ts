import { cva } from 'class-variance-authority'

/**
 * Kašnjenje ulaza je u CSS-u (`--animate-progress-in` nosi `150ms` delay), ne u JS timeru.
 *
 * Bez njega svaka navigacija koja se razreši za 80 ms bljesne trakom, a bljesak se čita kao
 * greška u renderu, ne kao napredak. `backwards` fill drži `opacity: 0` tokom kašnjenja — pa
 * nema ni `useState`, ni `setTimeout`, ni čišćenja tajmera pri odmontiranju.
 *
 * Pri `prefers-reduced-motion` traka se ne animira ali OSTAJE vidljiva: signal da se nešto
 * dešava nije dekoracija (docs/15-accessibility.md).
 *
 * `z-70` je izmerena vrednost, ne okrugao broj: `SiteHeader` je lepljiv na `z-60` sa
 * `backdrop-blur-xl`. Na `z-50` traka ne bi bila samo ispod zaglavlja nego i **zamućena
 * njegovim filterom**, pa bi se čitala kao senka.
 */
export const progressTrackVariants = cva(
  'pointer-events-none fixed inset-x-0 top-0 z-70 h-[3px] overflow-hidden bg-primary/15 opacity-0 animate-progress-in motion-reduce:animate-none motion-reduce:opacity-100',
)

/**
 * Segment koji putuje. `w-2/5` + `translateX` preko celog traga daje neodređeni napredak —
 * lažni procenti su gore od nikakvih, jer ne znamo koliko je ostalo.
 */
export const progressBarVariants = cva(
  'block h-full w-2/5 animate-progress-slide rounded-e-full bg-primary motion-reduce:w-full motion-reduce:animate-none',
)
