'use client'

import { useSyncExternalStore } from 'react'

import { PALETTE } from '@/constants/theme'
import { setTheme, selectTheme } from '@/store/slices/preferences'

import { useAppDispatch, useAppSelector } from '../useStore'

const SYSTEM_DARK = '(prefers-color-scheme: dark)'

const subscribeSystem = (onChange: () => void) => {
  const media = window.matchMedia(SYSTEM_DARK)
  media.addEventListener('change', onChange)
  return () => {
    media.removeEventListener('change', onChange)
  }
}

/**
 * Kružni prelaz iz dizajna: nova pozadina se širi iz dugmeta, tema se menja kad prekrije ekran,
 * pa se prelaz razliva. Sve kroz Web Animations — React se ne rerenderuje.
 */
const playReveal = (origin: HTMLElement, toDark: boolean, onCovered: () => void) => {
  const rect = origin.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const radius = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy))

  const overlay = document.createElement('div')
  overlay.setAttribute('aria-hidden', 'true')
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '9999',
    pointerEvents: 'none',
    background: toDark ? PALETTE.dark.bg : PALETTE.light.bg,
  })
  document.body.appendChild(overlay)

  const grow = overlay.animate(
    [{ clipPath: `circle(0px at ${String(cx)}px ${String(cy)}px)` }, { clipPath: `circle(${String(radius)}px at ${String(cx)}px ${String(cy)}px)` }],
    { duration: 560, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' },
  )
  grow.onfinish = () => {
    onCovered()
    requestAnimationFrame(() => {
      overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, easing: 'ease-out', fill: 'forwards' }).onfinish = () => {
        overlay.remove()
      }
    })
  }
}

/** Trenutna tema (izbor iz kolačića ili sistem) i prebacivanje sa prelazom iz dizajna. */
export const useThemeToggle = () => {
  const dispatch = useAppDispatch()
  const chosen = useAppSelector(selectTheme)
  const systemDark = useSyncExternalStore(
    subscribeSystem,
    () => window.matchMedia(SYSTEM_DARK).matches,
    () => false,
  )
  const isDark = chosen ? chosen === 'dark' : systemDark

  const toggle = (origin: HTMLElement | null) => {
    const next = isDark ? 'light' : 'dark'
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!origin || reduced) {
      dispatch(setTheme(next))
      return
    }
    playReveal(origin, next === 'dark', () => dispatch(setTheme(next)))
  }

  return { isDark, toggle }
}
