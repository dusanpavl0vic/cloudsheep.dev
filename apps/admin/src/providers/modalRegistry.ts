import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any -- registry drži komponente
   sa različitim propsima; tipsku vezu id↔props čuva ModalPropsMap, ne ovaj Record */
import type { ModalId } from '@app/core'

/**
 * Registry modala.
 *
 * Svaki unos mora imati i tip propsa u `ModalPropsMap` ispod — TypeScript traži oba,
 * pa je nemoguće registrovati modal bez tipa (docs/06-modals.md).
 */
export const modalRegistry = {
  'auth.login': lazy(() => import('@/features/auth/modals/LoginModal')),
  // `satisfies` proverava da su POKRIVENI svi ModalId ključevi — to je poenta.
  // Props tip svake komponente ostaje njen sopstveni; ugovor propsa čuva ModalPropsMap.
} satisfies Record<ModalId, LazyExoticComponent<ComponentType<any>>>

declare module '@app/core' {
  interface ModalPropsMap {
    'auth.login': { redirectTo?: string }
  }
}
