'use client'

import { useEffect } from 'react'

import { TOAST_DURATION_MS } from '@/constants/layout'
import { hideToast, selectToasts, showToast, type Toast, type ToastVariant } from '@/store/slices/ui'

import { useAppDispatch, useAppSelector } from './useStore'

export type { Toast }

/** Kratka poruka u uglu ekrana. Tekst je već preveden; nestaje sam (`ToastContainer`). */
export const useToast = () => {
  const dispatch = useAppDispatch()

  return {
    show: (message: string, variant: ToastVariant = 'info') =>
      dispatch(showToast({ id: crypto.randomUUID(), message, variant })),
    hide: (id: string) => dispatch(hideToast(id)),
  }
}

/** Red poruka za `ToastContainer` — komponenta ne čita store sama (šablon §1.4). */
export const useToastQueue = () => {
  const dispatch = useAppDispatch()

  return {
    toasts: useAppSelector(selectToasts),
    hide: (id: string) => dispatch(hideToast(id)),
  }
}

/** Poruka sama nestaje posle `TOAST_DURATION_MS`. Zavisi samo od ID-ja, pa re-render ne resetuje tajmer. */
export const useToastTimer = (id: string) => {
  const dispatch = useAppDispatch()

  // effect: tajmer (spoljni sistem) — čisti se kad poruka nestane ranije (×)
  useEffect(() => {
    const timer = window.setTimeout(() => dispatch(hideToast(id)), TOAST_DURATION_MS)
    return () => {
      window.clearTimeout(timer)
    }
  }, [id, dispatch])
}
