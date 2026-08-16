import { cva } from 'class-variance-authority'

/**
 * Umesto pune gornje ivice — nit koja se gasi udesno (`::before`).
 * Puna linija je secla kolonu na dva bloka; gradijent daje isti ritam bez rezа.
 */
export const processCardVariants = cva(
  "relative flex flex-col gap-2.5 pt-4.5 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-linear-to-r before:content-['']",
  {
    variants: {
      tone: {
        primary: 'before:from-foreground/45 before:to-transparent',
        accent: 'before:from-primary before:to-transparent',
      },
    },
    defaultVariants: {
      tone: 'primary',
    },
  },
)

export const processIndexVariants = cva('font-mono text-xs tracking-wide text-primary')

export const processTitleVariants = cva('font-heading text-xl font-semibold text-foreground')

export const processTextVariants = cva('flex-1 text-[15px] leading-relaxed text-muted-foreground')

export const processMetaVariants = cva('font-mono text-[11px] tracking-wide lowercase text-faint')
