'use client'

import { useToastQueue } from '@/hooks/useToast'

import { Root } from './ToastContainer.styles'
import ToastItem from './ToastItem'

/** Poruke u uglu ekrana. `aria-live` — čitač ekrana ih najavi bez pomeranja fokusa. */
const ToastContainer = () => {
  const { toasts, hide } = useToastQueue()

  return (
    <Root aria-live="polite" role="status">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => {
            hide(toast.id)
          }}
        />
      ))}
    </Root>
  )
}

export default ToastContainer
