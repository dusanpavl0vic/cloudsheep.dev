import type { ReactNode } from 'react'

import { Logo, Root } from './Tag.styles'

interface TagProps {
  children: ReactNode
  /** Logotip tehnologije ispred naziva. */
  iconUrl?: string | null
  className?: string
}

/** Mala oznaka u mono fontu (tehnologija, oblast, kategorija). */
const Tag = ({ children, iconUrl, className }: TagProps) => (
  <Root className={className}>
    {iconUrl && <Logo src={iconUrl} alt="" width={14} height={14} loading="lazy" />}
    {children}
  </Root>
)

export default Tag
