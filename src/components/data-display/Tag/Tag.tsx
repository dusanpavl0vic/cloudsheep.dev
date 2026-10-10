import type { ReactNode } from 'react'

import { Logo, Root, type TagVariant } from './Tag.styles'

interface TagProps {
  children: ReactNode
  /** Logotip tehnologije ispred naziva. */
  iconUrl?: string | null
  variant?: TagVariant
  className?: string
}

const ICON_SIZE: Record<TagVariant, number> = { code: 14, soft: 14, outline: 16 }

/** Mala oznaka: stručni termin, tehnologija sa logotipom, kategorija. */
const Tag = ({ children, iconUrl, variant = 'code', className }: TagProps) => (
  <Root $variant={variant} className={className}>
    {iconUrl && <Logo src={iconUrl} alt="" width={ICON_SIZE[variant]} height={ICON_SIZE[variant]} loading="lazy" />}
    {children}
  </Root>
)

export default Tag
