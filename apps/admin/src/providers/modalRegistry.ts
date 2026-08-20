import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any -- registry drži komponente
   sa različitim propsima; tipsku vezu id↔props čuva ModalPropsMap, ne ovaj Record */
import type { ModalId } from '@app/core'

/**
 * Registry modala.
 *
 * Svaki unos mora imati i tip propsa u `ModalPropsMap` ispod — `satisfies` proverava da su
 * pokriveni SVI `ModalId` ključevi, pa je nemoguće registrovati modal bez tipa
 * (docs/06-modals.md).
 *
 * Modali su `lazy`: dijalog za potvrdu brisanja ne treba nikome ko ništa ne briše.
 */
export const modalRegistry = {
  'projects.confirmDelete': lazy(() => import('@/features/projects/modals/ConfirmDeleteProject')),
  'technologies.confirmDelete': lazy(
    () => import('@/features/technologies/modals/ConfirmDeleteTechnology'),
  ),
  'team.confirmDelete': lazy(() => import('@/features/team/modals/ConfirmDeleteMember')),
} satisfies Record<ModalId, LazyExoticComponent<ComponentType<any>>>

declare module '@app/core' {
  interface ModalPropsMap {
    'projects.confirmDelete': { projectTitle: string }
    'technologies.confirmDelete': { label: string }
    'team.confirmDelete': { fullName: string }
  }
}
