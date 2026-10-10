'use client'

import type { ModalName } from '@/constants/modals'
import { closeModal, openModal, selectModal } from '@/store/slices/ui'
import type { ModalProps } from '@/store/slices/ui'

import { useAppDispatch, useAppSelector } from './useStore'

/**
 * Stanje i akcije jednog modala iz `ui.modals` (docs/06-modals.md).
 * Event iz klika se ne prosleđuje: `onClick={() => modal.open()}`, nikad `onClick={modal.open}`.
 */
export const useModal = <P extends ModalProps = ModalProps>(name: ModalName) => {
  const dispatch = useAppDispatch()
  const modal = useAppSelector(selectModal(name))

  const open = (props?: P) => dispatch(openModal({ name, ...(props ? { props } : {}) }))
  const close = () => dispatch(closeModal(name))

  return {
    isOpen: Boolean(modal),
    props: (modal?.props ?? {}) as Partial<P>,
    open,
    close,
    toggle: () => (modal ? close() : open()),
  }
}
