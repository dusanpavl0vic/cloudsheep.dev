import type { ReactNode } from 'react'

import { Root } from './VisuallyHidden.styles'

interface VisuallyHiddenProps {
  children: ReactNode
  /** `h2` kad sekcija ima naslov samo za čitač ekrana (utisci). */
  as?: 'span' | 'h2' | 'h3'
  id?: string
}

/** Tekst samo za čitač ekrana (oznaka dugmeta sa ikonicom, kontekst linka, skriven naslov). */
const VisuallyHidden = ({ children, as = 'span', id }: VisuallyHiddenProps) => (
  <Root as={as} id={id}>
    {children}
  </Root>
)

export default VisuallyHidden
