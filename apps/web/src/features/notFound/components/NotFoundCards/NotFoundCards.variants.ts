import { cva } from 'class-variance-authority'

/**
 * Papir je preuzet iz hero kartica (`HeroCards.variants.ts`), verbatim.
 *
 * Kopija, ne uvoz: feature ne uvozi feature, a izdizanje u `packages/ui` bi ove stringove
 * ubacilo u modul koji je već u POČETNOM učitavanju — gde je rezerva 0.3 KB. Ovde su u
 * lazy chunk-u 404 stranice i ne koštaju ništa.
 *
 * **Papir se ne invertuje** (`bg-plate`), pa ni mastilo ne sme (`text-plate-ink`). Zato
 * unutra nema `text-foreground` ni `text-muted-foreground` — u tamnoj temi bi pobeleli i
 * nestali sa svetlog papira (vidi objašnjenje `plate-*` tokena u `theme.css`).
 */
export const cardVariants = cva(
  'absolute rounded-2xl bg-plate p-4 text-plate-ink shadow-[0_2px_6px_rgb(0_0_0/0.05),0_20px_44px_-18px_rgb(0_0_0/0.22)] ring-1 ring-plate-line/25 ring-inset',
)

/**
 * Žuta cedulja. Boja je sirov `oklch` i tu ostaje: nema tokena za papir cedulje, a hero
 * koristi istu vrednost — dva različita žuta na istom sajtu bila bi gora greška od jedne
 * vrednosti bez tokena.
 */
export const noteVariants = cva(
  'absolute rounded-2xl bg-[oklch(93%_0.09_98)] p-4 shadow-[0_2px_6px_rgb(0_0_0/0.06),0_18px_40px_-16px_rgb(0_0_0/0.24)]',
)

/** Sloj kartica. `z-0`, dakle iza sadržaja koji je na `z-10`. */
export const cardLayerVariants = cva('pointer-events-none absolute inset-0 z-0 hidden xl:block')

export const cardTitleVariants = cva(
  'mb-2.5 font-mono text-[10.5px] tracking-[0.14em] text-plate-ink-muted uppercase',
)

export const noteTextVariants = cva(
  'max-w-[190px] text-[13.5px] leading-snug text-[oklch(38%_0.06_75)]',
)

export const logRowVariants = cva(
  'flex items-center justify-between gap-6 py-1 font-mono text-[12px]',
)

export const logPathVariants = cva('text-plate-ink-muted')

export const logCodeVariants = cva('font-semibold', {
  variants: {
    failed: {
      /** Jedini crveni piksel na kartici — oko ide tačno na red koji je pao. */
      true: 'text-destructive',
      false: 'text-plate-ink-muted',
    },
  },
  defaultVariants: { failed: false },
})

export const statusValueVariants = cva(
  'font-heading text-[26px] leading-none font-bold text-destructive',
)

export const statusMetaVariants = cva('mt-1 font-mono text-[11px] text-plate-ink-muted')
