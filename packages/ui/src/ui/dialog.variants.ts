import { cva } from 'class-variance-authority'

/**
 * `m-auto` je OBAVEZAN, ne ukras.
 *
 * Pretraživač modalni `<dialog>` centrira preko `margin: auto` u svom podrazumevanom stilu,
 * ali Tailwind preflight postavlja `margin: 0` na SVE elemente i time to poništi — pa se
 * dijalog zalepi za gornji levi ugao. `max-h` + `overflow-y-auto` drže dugmad na ekranu
 * i kad je sadržaj duži od prozora.
 */
export const dialogVariants = cva(
  'm-auto max-h-[calc(100dvh-4rem)] w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-border bg-card p-0 text-foreground shadow-lg backdrop:bg-foreground/40 backdrop:backdrop-blur-sm',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export const dialogHeaderVariants = cva('border-b border-border px-6 py-4')

export const dialogTitleVariants = cva('font-heading text-lg font-semibold')

export const dialogBodyVariants = cva('px-6 py-5 text-[15px] text-muted-foreground')

export const dialogFooterVariants = cva(
  'flex flex-wrap justify-end gap-2.5 border-t border-border px-6 py-4',
)
