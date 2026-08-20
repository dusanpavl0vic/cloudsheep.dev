import { cva } from 'class-variance-authority'

/**
 * `accent-color` umesto prilagođenog SVG kvadratića: nativna kontrola zadržava sve što
 * pretraživač i pomoćna tehnologija o njoj znaju, a dobija boju teme. Prilagođena verzija
 * traži skriveni input plus ikonicu i uvek negde omane — najčešće u `:indeterminate`
 * stanju ili u kontrastu na tamnoj temi.
 */
export const checkboxVariants = cva(
  'size-4 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50',
)
