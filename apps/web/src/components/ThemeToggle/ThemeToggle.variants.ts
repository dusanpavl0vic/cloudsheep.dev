import { cva } from 'class-variance-authority'

export const themeToggleVariants = cva(
  'relative grid size-10 place-items-center overflow-hidden rounded-full border-[1.5px] border-border-strong bg-transparent text-foreground transition-colors duration-300 hover:border-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none motion-safe:active:scale-90',
)

/**
 * Obe ikone stoje jedna preko druge u istoj ćeliji grida; menja se koja je vidljiva.
 *
 * Animira se `transform` i `opacity` — obe idu na compositor, pa nema layout prepravke
 * ni na slabijem uređaju. Ikona koja izlazi rotira i skuplja se, ona koja ulazi se
 * odmotava u suprotnom smeru, pa prelaz izgleda kao jedan pokret, a ne kao dva.
 */
export const themeIconVariants = cva(
  'col-start-1 row-start-1 size-[1.15rem] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none',
  {
    variants: {
      state: {
        visible: 'scale-100 rotate-0 opacity-100',
        hidden: 'scale-0 -rotate-90 opacity-0',
      },
    },
  },
)

/** Meki sjaj iza sunca — pojačava utisak „upalio se dan". */
export const themeGlowVariants = cva(
  'pointer-events-none absolute inset-0 rounded-full bg-accent/25 blur-md transition-opacity duration-500 motion-reduce:transition-none',
  {
    variants: {
      state: {
        visible: 'opacity-100',
        hidden: 'opacity-0',
      },
    },
  },
)
