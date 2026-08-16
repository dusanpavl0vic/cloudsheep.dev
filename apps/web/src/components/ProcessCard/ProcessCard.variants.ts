import { cva } from 'class-variance-authority'

/**
 * Umesto pune gornje ivice — nit koja se gasi udesno (`::before`).
 * Puna linija je secla kolonu na dva bloka; gradijent daje isti ritam bez rezа.
 */
export const processCardVariants = cva(
  "relative flex flex-col gap-2.5 pt-4.5 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-linear-to-r before:content-['']",
  {
    variants: {
      // Svaki korak nosi svoju boju (docs/22 §4): boja je na NITI i na broju,
      // nikad na podlozi kartice — inače bi četiri kartice vikale jedna preko druge.
      tone: {
        primary: 'before:from-primary before:to-transparent',
        amber: 'before:from-mark-amber before:to-transparent',
        violet: 'before:from-mark-violet before:to-transparent',
        teal: 'before:from-mark-teal before:to-transparent',
        rose: 'before:from-mark-rose before:to-transparent',
      },
    },
    defaultVariants: {
      tone: 'primary',
    },
  },
)

export const processIndexVariants = cva('font-mono text-xs tracking-wide', {
  variants: {
    tone: {
      primary: 'text-primary',
      amber: 'text-mark-amber',
      violet: 'text-mark-violet',
      teal: 'text-mark-teal',
      rose: 'text-mark-rose',
    },
  },
  defaultVariants: { tone: 'primary' },
})

export const processTitleVariants = cva('font-heading text-xl font-semibold text-foreground')

export const processTextVariants = cva('flex-1 text-[15px] leading-relaxed text-muted-foreground')

export const processMetaVariants = cva('font-mono text-[11px] tracking-wide lowercase text-faint')
