import type { InputHTMLAttributes } from 'react'

import { checkboxVariants } from './checkbox.variants'
import { cn } from '../lib/cn'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

/**
 * Nativni `<input type="checkbox">`.
 *
 * `type` je izostavljen iz propsa namerno — čekboks koji nije `type="checkbox"` nije
 * čekboks, pa to nije podešavanje nego greška.
 *
 * Labela NE ide ovde. Čekboks u formi se slaže sa `FormField`-om, koji već vodi računa o
 * `htmlFor` i `aria-describedby`.
 */
export const Checkbox = ({ className, ...props }: CheckboxProps) => (
  <input type="checkbox" className={cn(checkboxVariants(), className)} {...props} />
)
