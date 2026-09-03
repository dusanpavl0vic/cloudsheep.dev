import { cva } from 'class-variance-authority'

/**
 * Tipografija unutar oblačića na 404 strani.
 *
 * Ploha i rep dolaze iz `@/components/ThoughtBubble` — ovde ostaje samo sadržaj. **Papir se
 * ne invertuje** (`bg-plate`), pa ni mastilo ne sme (`text-plate-ink`): u tamnoj temi bi
 * `text-foreground` pobeleo i nestao sa svetlog papira (vidi `plate-*` tokene u `theme.css`).
 */

/** Sloj misli. `z-0`, dakle iza sadržaja koji je na `z-10`. */
export const thoughtLayerVariants = cva('pointer-events-none absolute inset-0 z-0 hidden xl:block')

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
