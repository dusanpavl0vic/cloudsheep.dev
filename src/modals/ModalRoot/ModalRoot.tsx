'use client'

import { usePathname } from 'next/navigation'
import { Suspense, useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { closeAllModals, closeModal, selectOpenOverlays } from '@/store/slices/ui'

import { OVERLAY_MODALS } from './ModalRoot.constants'

/** Renderuje otvorene overlay modale iz Redux-a. Promena rute zatvara sve. */
const ModalRoot = () => {
  const dispatch = useAppDispatch()
  const overlays = useAppSelector(selectOpenOverlays)
  const pathname = usePathname()

  // effect: ruta (spoljni sistem — URL) — modal otvoren na jednoj stranici ne sme da ostane na drugoj
  useEffect(() => {
    dispatch(closeAllModals())
  }, [pathname, dispatch])

  return (
    <Suspense fallback={null}>
      {overlays.map(({ name, props }) => {
        const Modal = OVERLAY_MODALS[name]
        return Modal ? (
          <Modal key={name} props={props} onClose={() => dispatch(closeModal(name))} />
        ) : null
      })}
    </Suspense>
  )
}

export default ModalRoot
