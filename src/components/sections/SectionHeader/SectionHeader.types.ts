import type { ReactNode } from 'react'

export interface SectionHeaderProps {
  /** Mala oznaka iznad naslova, u zagradama: `[ Services ]`. */
  eyebrow?: string
  title: string
  /** Prigušeni nastavak naslova: „Four disciplines, *one desk.*" */
  muted?: string
  lead?: ReactNode
  /** `statement` — krupna izjava ispod naslova; `body` (podrazumevano) — običan pasus. */
  leadTone?: 'statement' | 'body'
  /** `id` naslova — sekcija ga koristi za `aria-labelledby`. */
  titleId?: string
  align?: 'left' | 'center'
  /** `h1` na podstranici (Projects, Notes), `h2` u sekcijama početne. */
  as?: 'h1' | 'h2'
  className?: string
}
