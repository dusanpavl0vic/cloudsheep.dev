import type { ReactNode } from 'react'

import {
  pageHeaderSubtitleVariants,
  pageHeaderTitleVariants,
  pageHeaderVariants,
} from './PageHeader.variants'
import { Eyebrow } from '../../atoms/Eyebrow'
import { cn } from '../../lib/cn'


interface PageHeaderProps {
  eyebrow: ReactNode
  /** Tačkica ispred labele. Dekoracija — podrazumevano uključena. */
  marker?: boolean
  title: ReactNode
  subtitle?: ReactNode
  className?: string
}

/** Zaglavlje podstranice: eyebrow + gigant naslov + podnaslov. */
export const PageHeader = ({ eyebrow, marker, title, subtitle, className }: PageHeaderProps) => (
  <header className={cn(pageHeaderVariants(), className)}>
    <Eyebrow {...(marker === undefined ? {} : { marker })}>{eyebrow}</Eyebrow>
    <h1 className={pageHeaderTitleVariants()}>{title}</h1>
    {subtitle && <p className={pageHeaderSubtitleVariants()}>{subtitle}</p>}
  </header>
)
