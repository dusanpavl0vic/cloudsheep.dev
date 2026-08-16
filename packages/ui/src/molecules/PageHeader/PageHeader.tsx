import type { ReactNode } from 'react'

import {
  pageHeaderBackVariants,
  pageHeaderMutedVariants,
  pageHeaderSubtitleVariants,
  pageHeaderTitleVariants,
  pageHeaderVariants,
} from './PageHeader.variants'
import { Eyebrow } from '../../atoms/Eyebrow'
import { cn } from '../../lib/cn'

interface PageHeaderProps {
  /** Labela u zagradama. Izostavlja se kad stranica ima `backLink`. */
  eyebrow?: ReactNode
  title: ReactNode
  /** Prigušeni nastavak naslova (docs/22 §1). */
  muted?: ReactNode
  subtitle?: ReactNode
  /** Povratni link umesto labele — case study. */
  backLink?: ReactNode
  className?: string
}

/**
 * Zaglavlje podstranice: labela (ili povratni link) + naslov + podnaslov.
 *
 * Sve podstranice idu kroz njega. Ranije su `ContactPage` i `ProjectPage` imale sopstveni
 * markup sa sopstvenom `clamp` skalom, pa su tri stranice imale tri veličine naslova.
 */
export const PageHeader = ({
  eyebrow,
  title,
  muted,
  subtitle,
  backLink,
  className,
}: PageHeaderProps) => (
  <header className={cn(pageHeaderVariants(), className)}>
    {backLink && <div className={pageHeaderBackVariants()}>{backLink}</div>}
    {!backLink && eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

    <h1 className={pageHeaderTitleVariants()}>
      {title}
      {muted && (
        <>
          {' '}
          <span className={pageHeaderMutedVariants()}>{muted}</span>
        </>
      )}
    </h1>

    {subtitle && <p className={pageHeaderSubtitleVariants()}>{subtitle}</p>}
  </header>
)
