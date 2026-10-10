'use client'

import { useEffect, useReducer } from 'react'

import { useReducedMotion } from './useReducedMotion'

interface TyperState {
  index: number
  text: string
  deleting: boolean
}

const TYPE_MS = 46
const DELETE_MS = 20
const HOLD_MS = 1800
const GAP_MS = 250

/**
 * Terminal koji kuca pa briše fraze (dizajn: `whoami → one-person studio`). Uz
 * `prefers-reduced-motion` stoji prva fraza, bez kucanja.
 */
export const useTyper = (phrases: readonly string[]) => {
  const [state, next] = useReducer(
    (current: TyperState): TyperState => {
      const full = phrases[current.index % phrases.length] ?? ''
      if (!current.deleting && current.text === full) return { ...current, deleting: true }
      if (current.deleting && current.text === '') return { index: current.index + 1, text: '', deleting: false }
      return {
        ...current,
        text: current.deleting ? full.slice(0, current.text.length - 1) : full.slice(0, current.text.length + 1),
      }
    },
    { index: 0, text: '', deleting: false },
  )

  const full = phrases[state.index % phrases.length] ?? ''
  const reduced = useReducedMotion()

  // effect: tajmer koji pokreće sledeći korak kucanja
  useEffect(() => {
    if (reduced) return
    const delay =
      !state.deleting && state.text === full ? HOLD_MS : state.deleting && state.text === '' ? GAP_MS : state.deleting ? DELETE_MS : TYPE_MS
    const timer = setTimeout(next, delay)
    return () => {
      clearTimeout(timer)
    }
  }, [state, full, reduced])

  return reduced ? (phrases[0] ?? '') : state.text
}
