'use client'

import { useEffect, useState } from 'react'

import { ACTIVE_SECTION_OFFSET } from '@/constants/navigation'
import type { HomeSection } from '@/constants/routes'

/**
 * Koja sekcija početne je trenutno pod headerom — za istaknutu stavku navigacije.
 * Van početne (`enabled: false`) uvek `null`.
 */
export const useActiveSection = (sections: readonly HomeSection[], enabled: boolean) => {
  const [active, setActive] = useState<HomeSection | null>(null)

  // effect: scroll na window → koja je sekcija iznad linije ispod headera
  useEffect(() => {
    if (!enabled) return

    let frame = 0
    const update = () => {
      let current: HomeSection | null = null
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < ACTIVE_SECTION_OFFSET) current = id
      }
      setActive(current)
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [sections, enabled])

  return enabled ? active : null
}
