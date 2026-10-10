'use client'

import { useRef } from 'react'
import { createPortal } from 'react-dom'

import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'

import { Backdrop, Dialog } from './Overlay.styles'
import type { OverlayProps } from './Overlay.types'

/**
 * Osnova svakog overlay modala (šablon §5): pozadina, Esc, zaključan skrol, fokus u dijalogu.
 * Klik na pozadinu zatvara; klik u sadržaj ne.
 */
const Overlay = ({ children, onClose, label, placement = 'center', className }: OverlayProps) => {
  const dialog = useRef<HTMLDivElement>(null)

  useEscapeKey(onClose)
  useLockBodyScroll(true)
  useFocusTrap(dialog, true)

  return createPortal(
    <Backdrop
      $placement={placement}
      className={className}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <Dialog ref={dialog} role="dialog" aria-modal="true" aria-label={label} $placement={placement}>
        {children}
      </Dialog>
    </Backdrop>,
    document.body,
  )
}

export default Overlay
