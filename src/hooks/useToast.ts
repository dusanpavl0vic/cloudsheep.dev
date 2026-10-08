'use client'

import { hideToast, selectToasts, showToast, type ToastVariant } from '@/store/slices/ui'

import { useAppDispatch, useAppSelector } from './useStore'

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
