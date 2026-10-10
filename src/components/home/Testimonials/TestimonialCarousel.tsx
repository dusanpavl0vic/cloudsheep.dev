'use client'

import CarouselControls from '@/components/navigation/CarouselControls'
import { useCarousel } from '@/hooks/useCarousel'
import type { Testimonial } from '@/types/testimonial'

import { Author, Avatar, Eyebrow, Mark, Name, Panel, Quote, Role, Row, Who } from './Testimonials.styles'

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  labels: { eyebrow: string; previous: string; next: string; show: string[] }
}

const position = (index: number, count: number) =>
  `${String(index + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`

/** Jedan utisak u staklenom panelu; strelice gore, tačke dole. Promena se najavljuje čitaču ekrana. */
const TestimonialCarousel = ({ testimonials, labels }: TestimonialCarouselProps) => {
  const { active, goTo, next, prev } = useCarousel(testimonials.length)
  const current = testimonials[active]
  if (!current) return null

  const controls = {
    count: testimonials.length,
    active,
    onPrev: prev,
    onNext: next,
    onPick: goTo,
    prevLabel: labels.previous,
    nextLabel: labels.next,
    dotLabel: (index: number) => labels.show[index] ?? '',
  }

  return (
    <Panel>
      <Mark aria-hidden="true">”</Mark>
      <Row>
        <Eyebrow>{`[ ${labels.eyebrow} ] · ${position(active, testimonials.length)}`}</Eyebrow>
        <CarouselControls {...controls} parts="arrows" />
      </Row>
      <div aria-live="polite">
        <Quote key={current.id}>{`“${current.quote}”`}</Quote>
      </div>
      <Row>
        <Author>
          {current.avatar && <Avatar src={current.avatar.url} alt="" width={48} height={48} loading="lazy" />}
          <Who>
            <Name>{current.authorName}</Name>
            <Role>{[current.authorRole, current.company].filter(Boolean).join(' · ')}</Role>
          </Who>
        </Author>
        <CarouselControls {...controls} parts="dots" />
      </Row>
    </Panel>
  )
}

export default TestimonialCarousel
