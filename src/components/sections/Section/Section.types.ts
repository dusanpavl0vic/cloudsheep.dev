import type { ReactNode } from 'react'

export type SectionSpacing = 'default' | 'loose' | 'tight'

export interface SectionProps {
  children: ReactNode
  /** Sidro (`/#pricing`) — iz `HOME_SECTIONS`. */
  id?: string
  /** Ime oblasti za čitač ekrana (`aria-labelledby` naslova sekcije). */
  labelledBy?: string
  align?: 'left' | 'center'
  spacing?: SectionSpacing
  /** Najveća širina (dizajn: 1200, utisci 1100). */
  width?: number
  className?: string
}
