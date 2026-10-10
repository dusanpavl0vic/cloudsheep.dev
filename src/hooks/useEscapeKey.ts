'use client'

import { useEffect } from 'react'

/** Esc zatvara (modal, meni, popover). */
export const useEscapeKey = (onEscape: () => void, enabled = true) => {
  // effect: keydown na document
  useEffect(() => {
    if (!enabled) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscape()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
    }
  }, [onEscape, enabled])
}
