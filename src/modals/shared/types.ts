import type { ModalProps } from '@/store/slices/ui'

/** Svaki overlay modal dobija `onClose` i svoje props-e iz `ui.modals`. */
export interface OverlayModalProps<P extends ModalProps = ModalProps> {
  onClose: () => void
  props: Partial<P>
}
