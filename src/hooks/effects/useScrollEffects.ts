'use client'

import { useEffect } from 'react'

import { EFFECT_ATTRS } from '@/constants/effects'

import { applyPin } from './applyPin'

/**
 * Efekti vezani za skrol: hero sadržaj bledi i spušta se, proces se smenjuje u zakačenoj
 * sekciji, reč u podnožju izranja.
 * Stil se piše direktno na element (rAF), bez React stanja — skrol ne rerenderuje ništa.
 */
export const useScrollEffects = (enabled: boolean) => {
  // effect: scroll na window — transform/opacity na elementima sa data atributima
  useEffect(() => {
    if (!enabled) return

    let queued = false
    const apply = () => {
      queued = false
      const y = window.scrollY
      const vh = window.innerHeight

      const content = document.querySelector<HTMLElement>(`[${EFFECT_ATTRS.heroContent}]`)
      if (content && y < vh * 1.2) {
        content.style.transform = `translateY(${String(y * 0.28)}px)`
        content.style.opacity = String(Math.max(0, 1 - y / (vh * 0.75)))
      }

      const pin = document.querySelector<HTMLElement>(`[${EFFECT_ATTRS.pin}]`)
      if (pin) applyPin(pin)

      const word = document.querySelector<HTMLElement>(`[${EFFECT_ATTRS.footword}]`)
      if (word) {
        const rect = word.getBoundingClientRect()
        const progress = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh * 0.3)))
        word.style.transform = `translateY(${String((1 - progress) * 40)}%)`
      }
    }

    const onScroll = () => {
      if (!queued) {
        queued = true
        requestAnimationFrame(apply)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    apply()
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [enabled])
}
