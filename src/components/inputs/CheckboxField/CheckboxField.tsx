import type { InputHTMLAttributes, Ref } from 'react'

import { Root } from './CheckboxField.styles'

interface CheckboxFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  ref?: Ref<HTMLInputElement>
}

/** Čekboks sa oznakom (klik na tekst ga menja). Radi sa RHF `register`. */
const CheckboxField = ({ label, className, ...rest }: CheckboxFieldProps) => (
  <Root className={className}>
    <input type="checkbox" {...rest} />
    {label}
  </Root>
)

export default CheckboxField
