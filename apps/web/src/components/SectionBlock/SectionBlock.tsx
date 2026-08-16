import type { VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'

import { Eyebrow } from '@/components/Eyebrow'
import { Container } from '@/components/ui/Container'
import { type containerVariants } from '@/components/ui/Container/Container.variants'
import { cn } from '@/lib/cn'

import {
  sectionBlockBodyVariants,
  sectionBlockHeadVariants,
  sectionBlockTitleVariants,
  sectionBlockVariants,
} from './SectionBlock.variants'

type SectionBlockProps = VariantProps<typeof sectionBlockVariants> & {
  id?: string
  /** Mono labela iznad naslova, npr. "// 02 · what the studio does" */
  eyebrow?: ReactNode
  title?: ReactNode
  /** Akcija desno od naslova (npr. "all case studies →") */
  action?: ReactNode
  align?: VariantProps<typeof sectionBlockTitleVariants>['align']
  width?: VariantProps<typeof containerVariants>['width']
  children?: ReactNode
  className?: string
}

/**
 * Univerzalni omotač sekcije: eyebrow + naslov + akcija + sadržaj.
 * Sve sekcije stranice koriste ovu komponentu — bez dupliranja markupa.
 */
export const SectionBlock = ({
  id,
  eyebrow,
  title,
  action,
  spacing,
  tone,
  align,
  width,
  children,
  className,
}: SectionBlockProps) => {
  const isInverse = tone === 'inverse'
  const hasHead = Boolean(eyebrow || title || action)

  return (
    <section id={id} className={cn(sectionBlockVariants({ spacing, tone }), className)}>
      <Container width={width}>
        {hasHead && (
          <div
            className={cn(
              sectionBlockHeadVariants(),
              align === 'center' && 'md:flex-col md:items-center',
            )}
          >
            <div className={cn('flex flex-col gap-2', align === 'center' && 'items-center')}>
              {eyebrow && <Eyebrow tone={isInverse ? 'inverse' : 'muted'}>{eyebrow}</Eyebrow>}
              {title && (
                <h2
                  className={sectionBlockTitleVariants({
                    tone: isInverse ? 'inverse' : 'default',
                    align,
                  })}
                >
                  {title}
                </h2>
              )}
            </div>
            {action}
          </div>
        )}
        {children && <div className={cn(hasHead && sectionBlockBodyVariants())}>{children}</div>}
      </Container>
    </section>
  )
}
