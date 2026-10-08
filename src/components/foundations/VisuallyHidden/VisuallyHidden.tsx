import type { ReactNode } from 'react'

import { Root } from './VisuallyHidden.styles'

/** Tekst samo za čitač ekrana (oznaka dugmeta sa ikonicom, kontekst linka). */
const VisuallyHidden = ({ children }: { children: ReactNode }) => <Root>{children}</Root>

export default VisuallyHidden
