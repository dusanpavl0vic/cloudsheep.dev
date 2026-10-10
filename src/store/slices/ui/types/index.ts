import type { ModalName } from '@/constants/modals'

/** Props modala žive u Redux-u, pa moraju biti serijalizabilni (docs/06-modals.md §3). */
export type ModalProps = Record<string, string | number | boolean | null | undefined | string[]>

export interface OpenModal {
  name: ModalName
  props: ModalProps
}

export type ToastVariant = 'info' | 'success' | 'danger'

export interface Toast {
  id: string
  /** Već preveden tekst — slice ne zna za i18n. */
  message: string
  variant: ToastVariant
}

export interface UiState {
  /** Stek otvorenih modala; poslednji je na vrhu. */
  modals: OpenModal[]
  toasts: Toast[]
}
