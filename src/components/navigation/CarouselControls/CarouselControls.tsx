'use client'

import Icon from '@/components/foundations/Icon'

import { Arrow, Dot, Dots, Root } from './CarouselControls.styles'
import type { CarouselControlsProps } from './CarouselControls.types'

/** Strelice i tačke ispod karusela (tim, utisci). */
const CarouselControls = ({ count, active, onPrev, onNext, onPick, prevLabel, nextLabel, dotLabel, parts = 'all', className }: CarouselControlsProps) => {
  if (count < 2) return null
  const arrows = parts !== 'dots'
  const dots = parts !== 'arrows'

  return (
    <Root className={className}>
      {arrows && (
        <Arrow type="button" onClick={onPrev} aria-label={prevLabel}>
          <Icon name="arrowLeft" size={18} />
        </Arrow>
      )}
      {dots && (
      <Dots>
        {Array.from({ length: count }, (_, index) => (
          <Dot
            key={index}
            type="button"
            $active={index === active}
            aria-label={dotLabel(index)}
            aria-current={index === active || undefined}
            onClick={() => {
              onPick(index)
            }}
          />
        ))}
      </Dots>
      )}
      {arrows && (
        <Arrow type="button" onClick={onNext} aria-label={nextLabel}>
          <Icon name="arrowRight" size={18} />
        </Arrow>
      )}
    </Root>
  )
}

export default CarouselControls
