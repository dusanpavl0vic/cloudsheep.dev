import type { ReactNode } from 'react'

export interface OverlayProps {
  children: ReactNode
  onClose: () => void
  /** Ime dijaloga za čitač ekrana. */
  label: string
  /** Gde stoji sadržaj: centar (dijalog) ili desna ivica (drawer). */
  placement?: 'center' | 'right'
  className?: string
}
