import type { ReactNode } from 'react'

export interface GlassCardProps {
  children: ReactNode
  /** Krupan prigušen broj u gornjem desnom uglu („01"). */
  number?: string
  /** Oznake uglova i akcentna linija na vrhu (kartice usluga). */
  decorated?: boolean
  /** Podizanje i jači okvir na hover. */
  interactive?: boolean
  as?: 'article' | 'div' | 'li'
  className?: string
}
