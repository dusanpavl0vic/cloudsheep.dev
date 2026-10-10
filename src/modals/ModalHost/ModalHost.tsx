'use client'

import { usePathname } from 'next/navigation'
import { Suspense, useEffect, type ComponentType } from 'react'

import type { ModalName } from '@/constants/modals'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { closeAllModals, closeModal, selectOpenOverlays } from '@/store/slices/ui'

import type { OverlayModalProps } from '../shared/types'

export type ModalRegistry = Partial<Record<ModalName, ComponentType<OverlayModalProps>>>

/**
 * Renderuje otvorene overlay modale iz Redux-a koje poznaje `registry`. Javni sajt i admin
 * imaju odvojene registre: admin modali (i sve što povlače — RTK Query, forme) ne smeju u
 * JS javnih stranica (ADR 0014). Promena rute zatvara sve.
 */
const ModalHost = ({ registry }: { registry: ModalRegistry }) => {
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
        const Modal = registry[name]
        return Modal ? <Modal key={name} props={props} onClose={() => dispatch(closeModal(name))} /> : null
      })}
    </Suspense>
  )
}

export default ModalHost
