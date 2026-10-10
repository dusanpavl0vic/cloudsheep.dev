'use client'

import { useEffect } from 'react'

import { EFFECT_ATTRS, REVEAL } from '@/constants/effects'
import { EASE_OUT } from '@/constants/layout'

const SEEN = 'data-revealed'

/**
 * Elementi sa `data-reveal` izranjaju kad uđu u ekran. Sakrivaju se TEK ovde, iz JS-a, i samo
 * ispod fold-a — bez JS-a (i za Google) sadržaj je odmah vidljiv.
 */
export const useRevealOnScroll = (enabled: boolean) => {
  // effect: IntersectionObserver + MutationObserver nad DOM-om — nove stranice i sekcije
  useEffect(() => {
    if (!enabled) return

    /** Sakriveni a još neotkriveni — cleanup ih vraća (Strict Mode, promena `enabled`). */
    const pending = new Set<HTMLElement>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          el.style.opacity = '1'
          el.style.transform = 'none'
          el.style.filter = 'none'
          pending.delete(el)
          observer.unobserve(el)
        }
      },
      { threshold: REVEAL.threshold, rootMargin: REVEAL.rootMargin },
    )

    const scan = () => {
      let index = 0
      document.querySelectorAll<HTMLElement>(`[${EFFECT_ATTRS.reveal}]:not([${SEEN}])`).forEach((el) => {
        el.setAttribute(SEEN, '')
        if (el.getBoundingClientRect().top < window.innerHeight * REVEAL.skipAboveFold) return
        const delay = (index++ % 4) * REVEAL.stagger
        const transition = ['opacity', 'transform', 'filter']
          .map((prop) => `${prop} ${String(REVEAL.durationS)}s ${EASE_OUT} ${String(delay)}s`)
          .join(', ')
        Object.assign(el.style, { opacity: '0', transform: 'translateY(40px)', filter: 'blur(6px)', transition })
        pending.add(el)
        observer.observe(el)
      })
    }

    let frame = 0
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(scan)
    })
    mutations.observe(document.body, { childList: true, subtree: true })
    scan()

    return () => {
      cancelAnimationFrame(frame)
      mutations.disconnect()
      observer.disconnect()
      pending.forEach((el) => {
        el.removeAttribute(SEEN)
        Object.assign(el.style, { opacity: '', transform: '', filter: '', transition: '' })
      })
    }
  }, [enabled])
}
