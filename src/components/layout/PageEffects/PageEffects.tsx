'use client'

import { usePointerEffects, useRevealOnScroll, useScrollEffects } from '@/hooks/effects'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Efekti iz dizajna za ceo sajt — otkrivanje pri skrolu, sjaj kursora, parallax, izranjanje reči
 * u podnožju. Ne renderuje ništa: serverske komponente traže efekat atributom (`data-reveal`…).
 * Uz `prefers-reduced-motion` se gasi sve, sadržaj ostaje.
 */
const PageEffects = () => {
  const enabled = !useReducedMotion()

  useRevealOnScroll(enabled)
  usePointerEffects(enabled)
  useScrollEffects(enabled)

  return null
}

export default PageEffects
