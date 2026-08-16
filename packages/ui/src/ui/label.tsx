import type { LabelHTMLAttributes } from 'react'

import { labelVariants } from './label.variants'
import { cn } from '../lib/cn'

/**
 * `htmlFor` je OBAVEZAN, ne opcion.
 *
 * `jsx-a11y/label-has-associated-control` ovde ne može da dokaže povezanost jer je Label
 * generički omotač. Umesto potiskivanja pravila, ugovor je pomeren u tipove: label bez
 * kontrole je greška u kompilaciji, ne upozorenje koje neko ugasi.
 *
 * Forme ionako idu kroz `FormField`, koji ovo popunjava sam (docs/10-forms-validation.md).
 */
type LabelProps = Omit<LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'> & {
  /** id kontrole koju ovaj label opisuje */
  htmlFor: string
}

export const Label = ({ className, ...props }: LabelProps) => (
  // eslint-disable-next-line jsx-a11y/label-has-associated-control -- htmlFor je obavezan kroz tip
  <label className={cn(labelVariants(), className)} {...props} />
)
