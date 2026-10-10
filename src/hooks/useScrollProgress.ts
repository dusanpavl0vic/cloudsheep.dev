'use client'

import { useEffect, type RefObject } from 'react'

/**
 * Koliko je stranica pročitana (0–1), upisano kao `width` elementa — bez React stanja, pa skrol
 * ne rerenderuje header.
 */
export const useScrollProgress = (ref: RefObject<HTMLElement | null>) => {
  // effect: scroll na window → širina trake napretka
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (ref.current) ref.current.style.width = `${String(max > 0 ? (window.scrollY / max) * 100 : 0)}%`
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ref])
}
