'use client'

import { useSyncExternalStore } from 'react'

/** Da li media query važi. Na serveru `false` — raspored je mobile-first. */
export const useMediaQuery = (query: string) =>
  useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', onChange)
      return () => {
        media.removeEventListener('change', onChange)
      }
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
