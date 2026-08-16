import type { VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'

import {
  sectionBlockBodyVariants,
  sectionBlockHeadVariants,
  sectionBlockMutedVariants,
  sectionBlockSubtitleVariants,
  sectionBlockTitleVariants,
  sectionBlockVariants,
  sectionSurfaceVariants,
} from './SectionBlock.variants'
import { Eyebrow } from '../../atoms/Eyebrow'
import { cn } from '../../lib/cn'
import { Container } from '../../ui/container'
import { type containerVariants } from '../../ui/container.variants'

type SectionBlockProps = VariantProps<typeof sectionBlockVariants> & {
  id?: string
  /** Kratka reč u piluli iznad naslova — „Usluge", „Cene" (docs/22 §2) */
  eyebrow?: ReactNode
  title?: ReactNode
  /** Prigušeni nastavak naslova. Dopuna, nikad ključna informacija (docs/22 §1) */
  muted?: ReactNode
  /** Red ispod naslova */
  subtitle?: ReactNode
  /** Akcija desno od naslova (npr. „svi projekti →") */
  action?: ReactNode
  align?: VariantProps<typeof sectionBlockTitleVariants>['align']
  width?: VariantProps<typeof containerVariants>['width']
  /** `panel` pakuje sekciju u svetli zaobljen panel sa tačkastom teksturom */
  surface?: VariantProps<typeof sectionSurfaceVariants>['surface']
  children?: ReactNode
  className?: string
}

/**
 * Univerzalni omotač sekcije: pilula + dvotonski naslov + podnaslov + akcija + sadržaj.
 * Sve sekcije stranice idu kroz njega — bez dupliranja markupa.
 */
export const SectionBlock = ({
  id,
  eyebrow,
  title,
  muted,
  subtitle,
  action,
  spacing,
  tone,
  align,
  width,
  surface,
  children,
  className,
}: SectionBlockProps) => {
  const isInverse = tone === 'inverse'
  const isCentered = align === 'center'

  // Namerno `||`, ne `??`: prazan string znači „nema zaglavlja", a `??` bi ga
  // tretirao kao prisutnu vrednost i renderovao praznu traku.
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- vidi gore
  const hasHead = Boolean(eyebrow || title || action)

  return (
    <section id={id} className={cn(sectionBlockVariants({ spacing, tone }), className)}>
      <Container width={width}>
        <div className={cn(sectionSurfaceVariants({ surface }), surface === 'panel' && 'p-8 md:p-14')}>
          {/* Sadržaj mora iznad `::before` teksture panela */}
          <div className="relative">
            {hasHead && (
              <div
                className={cn(
                  sectionBlockHeadVariants(),
                  isCentered && 'md:flex-col md:items-center',
                )}
              >
                <div className={cn('flex flex-col gap-3.5', isCentered && 'items-center')}>
                  {eyebrow && <Eyebrow tone={isInverse ? 'inverse' : 'muted'}>{eyebrow}</Eyebrow>}

                  {title && (
                    <h2
                      className={sectionBlockTitleVariants({
                        tone: isInverse ? 'inverse' : 'default',
                        align,
                      })}
                    >
                      {title}
                      {muted && (
                        <>
                          {' '}
                          <span
                            className={sectionBlockMutedVariants({
                              tone: isInverse ? 'inverse' : 'default',
                            })}
                          >
                            {muted}
                          </span>
                        </>
                      )}
                    </h2>
                  )}

                  {subtitle && (
                    <p
                      className={sectionBlockSubtitleVariants({
                        tone: isInverse ? 'inverse' : 'default',
                        align,
                      })}
                    >
                      {subtitle}
                    </p>
                  )}
                </div>
                {action}
              </div>
            )}

            {children && <div className={cn(hasHead && sectionBlockBodyVariants())}>{children}</div>}
          </div>
        </div>
      </Container>
    </section>
  )
}
