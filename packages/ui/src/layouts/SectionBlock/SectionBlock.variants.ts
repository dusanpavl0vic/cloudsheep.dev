import { cva } from 'class-variance-authority'

import { glassVariants } from '../../lib/surface.variants'

export const sectionBlockVariants = cva('w-full', {
  variants: {
    spacing: {
      default: 'py-20',
      compact: 'py-14',
      none: 'py-0',
    },
    tone: {
      default: '',
      inverse: 'bg-inverse text-inverse-foreground',
    },
  },
  defaultVariants: {
    spacing: 'default',
    tone: 'default',
  },
})

/**
 * Sekcija upakovana u svetli panel (docs/22 §3, §6).
 *
 * Panel nosi finu **statičnu** tačkastu teksturu i veliki radijus. Naizmenično pakovanje
 * sekcija u panele daje stranici ritam bez ijedne razdelne linije.
 */
export const sectionSurfaceVariants = cva('', {
  variants: {
    surface: {
      plain: '',
      panel: [
        glassVariants({ radius: 'xl', elevation: 'flat' }),
        'relative',
        // Tekstura ostaje (§6) i ostaje statična. Sad leži NA staklu, pa je slabija:
        // preko providne ploče je isti uzorak čitljiviji nego preko pune `bg-muted`.
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-3xl before:bg-[radial-gradient(currentColor_1px,transparent_1px)] before:bg-[length:22px_22px] before:text-border-strong/25 before:content-['']",
      ].join(' '),
    },
  },
  defaultVariants: { surface: 'plain' },
})

export const sectionBlockHeadVariants = cva(
  'flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8',
)

/**
 * Naslov ide na `text-display` (skoro crna), ne na `text-foreground` (plavo mastilo).
 * Referenca dobija svoj kontrast upravo iz te razlike: naslov je najtamnija stvar na
 * ekranu, a plava je rezervisana za akciju (docs/22 §4).
 */
export const sectionBlockTitleVariants = cva(
  'font-heading text-4xl leading-[1.08] font-bold tracking-[-0.03em] text-balance md:text-[46px]',
  {
    variants: {
      tone: {
        default: 'text-display',
        inverse: 'text-inverse-foreground',
      },
      align: {
        start: 'text-left',
        center: 'text-center',
      },
    },
    defaultVariants: {
      tone: 'default',
      align: 'start',
    },
  },
)

/** Prigušeni nastavak naslova — dopuna, nikad ključna informacija (docs/22 §1). */
export const sectionBlockMutedVariants = cva('', {
  variants: {
    tone: {
      default: 'text-faint',
      inverse: 'text-inverse-faint',
    },
  },
  defaultVariants: { tone: 'default' },
})

/** Kratak red ispod naslova. */
export const sectionBlockSubtitleVariants = cva('max-w-[560px] text-[16.5px] leading-relaxed', {
  variants: {
    tone: {
      default: 'text-muted-foreground',
      inverse: 'text-inverse-muted',
    },
    align: {
      start: 'text-left',
      center: 'mx-auto text-center',
    },
  },
  defaultVariants: { tone: 'default', align: 'start' },
})

export const sectionBlockBodyVariants = cva('pt-10')
