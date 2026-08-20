import { cva } from 'class-variance-authority'

/**
 * Sjaj ide kroz `animate-shimmer` iz `@app/tailwind-config/theme.css`, a ne kroz
 * `apps/web/src/styles/animations.css` — taj fajl ova app ne uvozi.
 *
 * Gradijent je dvostruko širi od elementa, pa pomeranje pozicije daje prelaz svetla preko
 * bloka. `bg-muted` ostaje kao podloga za slučaj da animacija ne radi.
 */
export const skeletonVariants = cva(
  'block bg-muted bg-[linear-gradient(90deg,var(--color-muted)_0%,var(--color-border)_50%,var(--color-muted)_100%)] bg-[length:200%_100%] animate-shimmer motion-reduce:animate-none',
  {
    variants: {
      shape: {
        /** Red teksta. */
        line: 'h-4 rounded-md',
        /** Naslov ili vrednost. */
        title: 'h-6 rounded-md',
        /** Polje forme. */
        field: 'h-10 rounded-lg',
        /** Sličica ili avatar. */
        thumb: 'size-10 shrink-0 rounded-lg',
      },
    },
    defaultVariants: { shape: 'line' },
  },
)

export const skeletonRowVariants = cva('flex items-center gap-4 border-b border-border py-4')

export const skeletonFieldVariants = cva('flex flex-col gap-2')

export const skeletonLabelVariants = cva('h-3 w-24 rounded-sm bg-muted')
