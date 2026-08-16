/**
 * Registry tipova modala.
 *
 * Prazan je namerno — svaka app ga proširuje kroz `declare module '@app/core'`.
 * Posledica: registrovati modal bez tipa propsa je **greška u kompilaciji**, jer
 * `ModalId` izvodi ključeve odavde (docs/06-modals.md).
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- namerna tačka proširenja
export interface ModalPropsMap {
  // Popunjava app kroz `declare module '@app/core'`:
  // 'projects.confirm-delete': { entityId: string; entityName: string }
}

/** Ključevi registrovanih modala. Prazan dok app ne proširi ModalPropsMap. */
export type ModalId = Extract<keyof ModalPropsMap, string>

export type ModalSize = 'sm' | 'md' | 'lg' | 'full'

export interface ModalMeta {
  /** `false` blokira ESC i klik van — za destruktivne potvrde */
  dismissible?: boolean
  size?: ModalSize
}

export interface ModalEntry {
  /** Jedinstven po otvaranju — isti modal može biti otvoren dvaput sa različitim propsima */
  key: string
  id: string
  props: unknown
  meta?: ModalMeta
}

export interface ModalState {
  /** Stack, ne jedan modal — mora da radi confirm preko otvorene forme */
  stack: ModalEntry[]
}
