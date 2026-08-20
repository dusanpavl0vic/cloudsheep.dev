import type { ReactNode } from 'react'

import {
  emptyStateDescriptionVariants,
  emptyStateTitleVariants,
  emptyStateVariants,
} from './EmptyState.variants'
import { cn } from '../../lib/cn'

interface EmptyStateProps {
  title: ReactNode
  description?: ReactNode
  /** Radnja koja stanje razrešava — „Dodaj projekat". */
  action?: ReactNode
  className?: string
}

/**
 * Prazna lista sa objašnjenjem i izlazom.
 *
 * Postoji da prazan ekran ne bi izgledao kao pad. Zato `action`: prazno stanje bez
 * ponuđene radnje ostavlja korisnika da sam pogodi šta dalje.
 */
export const EmptyState = ({ title, description, action, className }: EmptyStateProps) => (
  <div className={cn(emptyStateVariants(), className)}>
    <p className={emptyStateTitleVariants()}>{title}</p>
    {description && <p className={emptyStateDescriptionVariants()}>{description}</p>}
    {action}
  </div>
)
