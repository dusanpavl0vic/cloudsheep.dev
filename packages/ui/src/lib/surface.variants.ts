import { cva } from 'class-variance-authority'

/**
 * Elevacija površina (docs/22-visual-language.md §3).
 *
 * Kartice se izdvajaju **senkom i podlogom, ne ivicom**. Senka je široka i bleda;
 * tamna i uska izgleda kao Bootstrap iz 2014.
 *
 * `ring-inset` umesto `border`: ivica ne ulazi u box model, pa se kartice ne pomeraju
 * za 1px kad se elevacija promeni na hover.
 */
export const surfaceVariants = cva('bg-card transition-shadow duration-300', {
  variants: {
    elevation: {
      /** Ravno — samo podloga, bez senke. */
      flat: 'ring-1 ring-border/60 ring-inset',
      /** Podrazumevano za kartice. */
      raised:
        'shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_-12px_rgb(0_0_0/0.14)] ring-1 ring-border/50 ring-inset',
      /** Istaknuta kartica u grupi — vidno iznad ostalih. */
      floating:
        'shadow-[0_2px_4px_rgb(0_0_0/0.05),0_24px_56px_-16px_rgb(0_0_0/0.22)] ring-1 ring-border/40 ring-inset',
    },
    interactive: {
      true: 'hover:shadow-[0_2px_6px_rgb(0_0_0/0.06),0_24px_48px_-16px_rgb(0_0_0/0.2)]',
      false: '',
    },
    radius: {
      md: 'rounded-xl',
      lg: 'rounded-2xl',
      xl: 'rounded-3xl',
    },
  },
  defaultVariants: {
    elevation: 'raised',
    interactive: false,
    radius: 'lg',
  },
})

/**
 * Fina tačkasta tekstura (docs/22 §6).
 *
 * **Statična.** Animiran uzorak je već dvaput pao na performansama — vidi napomenu u docs/22.
 */
export const dottedSurfaceVariants = cva(
  'bg-[radial-gradient(currentColor_1px,transparent_1px)] bg-[length:22px_22px] text-border-strong/45',
)
