'use client'

import { useEffect } from 'react'

import { EFFECT_ATTRS } from '@/constants/effects'
import { MEDIA_QUERY } from '@/constants/theme'

import { applyPin, resetPin } from './applyPin'

const clear = (el: HTMLElement | null) => {
  if (el) Object.assign(el.style, { transform: '', opacity: '' })
}

/**
 * Efekti vezani za skrol: hero sadržaj bledi i spušta se, proces se smenjuje u zakačenoj
 * sekciji (samo na desktopu — ispod njega su karte obična lista), reč u podnožju izranja.
 * Stil se piše direktno na element (rAF), bez React stanja — skrol ne rerenderuje ništa.
 * Cleanup briše sve upisano: posle gašenja efekata sadržaj mora ostati vidljiv.
 */
export const useScrollEffects = (enabled: boolean) => {
  // effect: scroll na window — transform/opacity na elementima sa data atributima
  useEffect(() => {
    if (!enabled) return

    const desktop = window.matchMedia(MEDIA_QUERY.desktop)
    let pinned = false
    let queued = false
    let frame = 0
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
      if (pin && desktop.matches) {
        applyPin(pin)
        pinned = true
      } else if (pin && pinned) {
        resetPin(pin)
        pinned = false
      }

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
        frame = requestAnimationFrame(apply)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    desktop.addEventListener('change', onScroll)
    apply()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      desktop.removeEventListener('change', onScroll)
      const pin = document.querySelector<HTMLElement>(`[${EFFECT_ATTRS.pin}]`)
      if (pin) resetPin(pin)
      clear(document.querySelector<HTMLElement>(`[${EFFECT_ATTRS.heroContent}]`))
      clear(document.querySelector<HTMLElement>(`[${EFFECT_ATTRS.footword}]`))
    }
  }, [enabled])
}
