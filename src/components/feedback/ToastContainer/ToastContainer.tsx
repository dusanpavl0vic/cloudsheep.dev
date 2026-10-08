'use client'

import { useToastQueue } from '@/hooks/useToast'

import { Root } from './ToastContainer.styles'

/** Poruke u uglu ekrana. `aria-live` — čitač ekrana ih najavi bez pomeranja fokusa. */
const ToastContainer = () => {
  const { toasts } = useToastQueue()

  return (
    <Root aria-live="polite" role="status">
      {toasts.map((toast) => (
        <p key={toast.id}>{toast.message}</p>
      ))}
    </Root>
  )
}

export default ToastContainer
