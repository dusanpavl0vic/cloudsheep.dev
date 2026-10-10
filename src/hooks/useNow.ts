'use client'

import { useSyncExternalStore } from 'react'

/** Trenutno vreme, osveženo na zadati interval. Na serveru `null` — sat se ne renderuje dva puta različito. */
export const useNow = (intervalMs: number) =>
  useSyncExternalStore(
    (onChange) => {
      const id = setInterval(onChange, intervalMs)
      return () => {
        clearInterval(id)
      }
    },
    () => Math.floor(Date.now() / intervalMs),
    () => null,
  )
