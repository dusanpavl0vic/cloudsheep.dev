import type { ReactNode } from 'react'

import type { IconName } from '@/constants/icons'

export interface TextLinkProps {
  href: string
  children: ReactNode
  /** Linija ispod (dizajn: „See all projects →"). */
  underline?: boolean
  /** Ikonica posle teksta; strelica pomera se udesno na hover. */
  icon?: IconName | null
  /** Strelica ispred teksta („← All work"). */
  iconLeft?: IconName
  tone?: 'accent' | 'muted'
  className?: string
}
