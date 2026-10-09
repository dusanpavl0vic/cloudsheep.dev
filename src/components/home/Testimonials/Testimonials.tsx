import { useTranslations } from 'next-intl'

import VisuallyHidden from '@/components/foundations/VisuallyHidden'
import Section from '@/components/sections/Section'
import { EFFECT_ATTRS } from '@/constants/effects'
import { HOME_SECTIONS } from '@/constants/routes'
import type { Testimonial } from '@/types/testimonial'

import TestimonialCarousel from './TestimonialCarousel'

interface TestimonialsProps {
  testimonials: Testimonial[]
}

/**
 * Utisci klijenata iz admin-a. Bez objavljenih utisaka sekcija se ne prikazuje — izmišljeni
 * utisci iz dizajna nikad ne idu na pravi sajt.
 */
const Testimonials = ({ testimonials }: TestimonialsProps) => {
  const t = useTranslations('home.testimonials')
  if (testimonials.length === 0) return null

  return (
    <Section id={HOME_SECTIONS.TESTIMONIALS} labelledBy="testimonials-title" spacing="tight" width={1100}>
      <div {...{ [EFFECT_ATTRS.reveal]: '' }}>
        <VisuallyHidden as="h2" id="testimonials-title">{`${t('title')} ${t('muted')}`}</VisuallyHidden>
        <TestimonialCarousel
          testimonials={testimonials}
          labels={{
            eyebrow: t('eyebrow'),
            previous: t('previous'),
            next: t('next'),
            show: testimonials.map((_, index) => t('show', { index: index + 1 })),
          }}
        />
      </div>
    </Section>
  )
}

export default Testimonials
