import { cva } from 'class-variance-authority'

export const tagListVariants = cva('flex flex-wrap items-center gap-2')

/** Logotip u oznaci. Sitan i `object-contain` — brend logotipi nisu istih proporcija. */
export const tagListIconVariants = cva('size-4 shrink-0 object-contain')
