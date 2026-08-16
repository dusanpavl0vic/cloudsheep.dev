import { cva } from 'class-variance-authority'

/**
 * Redovi su ranije bili razdvojeni punom gornjom ivicom. Sada nose nit koja se gasi
 * ka desnoj ivici — lista i dalje ima ritam, ali bez rešetkastog utiska.
 */
export const disciplineRowVariants = cva(
  "relative grid grid-cols-1 items-center gap-4 rounded-lg px-2 py-8 transition-colors before:absolute before:inset-x-0 before:top-0 before:h-px before:content-[''] hover:bg-muted md:grid-cols-[110px_1.1fr_1.4fr_40px] md:gap-6",
  {
    variants: {
      emphasis: {
        first: 'before:bg-linear-to-r before:from-foreground/60 before:via-border before:to-transparent',
        default: 'before:bg-linear-to-r before:from-border before:to-transparent',
      },
    },
    defaultVariants: {
      emphasis: 'default',
    },
  },
)

export const disciplineIndexVariants = cva('font-mono text-[13px] tracking-wide text-faint')

export const disciplineTitleVariants = cva(
  'font-heading text-2xl font-semibold tracking-tight text-foreground',
)

export const disciplineTextVariants = cva('text-[15.5px] leading-relaxed text-muted-foreground')

export const disciplineArrowVariants = cva(
  'hidden text-xl text-primary transition-transform group-hover:translate-x-1 md:block md:justify-self-end',
)
