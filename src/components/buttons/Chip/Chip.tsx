'use client'

import { Hint, Root } from './Chip.styles'
import type { ChipProps } from './Chip.types'

/** Izbor u obliku pločice (procena, upit, filter projekata). `aria-checked` nosi stanje. */
const Chip = ({ children, selected = false, hint, role = 'radio', type = 'button', className, ...rest }: ChipProps) => (
  <Root
    type={type}
    role={role}
    aria-checked={selected}
    $selected={selected}
    $hasHint={Boolean(hint)}
    className={className}
    {...rest}
  >
    {children}
    {hint && <Hint>{hint}</Hint>}
  </Root>
)

export default Chip
