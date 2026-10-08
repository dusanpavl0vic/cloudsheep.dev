'use client'

import { useEffect } from 'react'

import { EFFECT_ATTRS } from '@/constants/effects'

/**
 * Sjaj koji prati kursor na karticama (`data-glow` → `--gx`/`--gy`) i u hero-u (`--mx`/`--my`),
 * plus parallax oblaka misli (`data-depth`). Jedan `mousemove` za ceo sajt, sa rAF prigušenjem.
 */
export const usePointerEffects = (enabled: boolean) => {
  // effect: mousemove na window — CSS promenljive na elementima, bez React rendera
  useEffect(() => {
    if (!enabled) return

    let lastGlow: HTMLElement | null = null
    let pointer = { x: 0, y: 0 }
    let queued = false

    const updateHero = () => {
      queued = false
      const hero = document.querySelector<HTMLElement>(`[${EFFECT_ATTRS.hero}]`)
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      if (rect.bottom < 0) return

      hero.querySelector<HTMLElement>(`[${EFFECT_ATTRS.heroGlow}]`)?.style.setProperty('--mx', `${String(pointer.x - rect.left)}px`)
      hero.querySelector<HTMLElement>(`[${EFFECT_ATTRS.heroGlow}]`)?.style.setProperty('--my', `${String(pointer.y - rect.top)}px`)

      const cx = (pointer.x - rect.left) / rect.width - 0.5
      const cy = (pointer.y - rect.top) / rect.height - 0.5
      hero.querySelectorAll<HTMLElement>(`[${EFFECT_ATTRS.depth}]`).forEach((el) => {
        const depth = Number(el.getAttribute(EFFECT_ATTRS.depth))
        el.style.transform = `translate(${String(cx * depth)}px, ${String(cy * depth)}px)`
      })
    }

    const onMove = (event: MouseEvent) => {
      pointer = { x: event.clientX, y: event.clientY }

      const glow = event.target instanceof Element ? event.target.closest<HTMLElement>(`[${EFFECT_ATTRS.glow}]`) : null
      if (lastGlow && lastGlow !== glow) {
        lastGlow.style.setProperty('--gx', '-400px')
        lastGlow.style.setProperty('--gy', '-400px')
      }
      if (glow) {
        const rect = glow.getBoundingClientRect()
        glow.style.setProperty('--gx', `${String(event.clientX - rect.left)}px`)
        glow.style.setProperty('--gy', `${String(event.clientY - rect.top)}px`)
      }
      lastGlow = glow

      if (!queued) {
        queued = true
        requestAnimationFrame(updateHero)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
    }
  }, [enabled])
}
