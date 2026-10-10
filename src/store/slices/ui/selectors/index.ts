import { createSelector } from '@reduxjs/toolkit'

import { MODAL_KIND, type ModalName } from '@/constants/modals'

import type { RootState } from '../../../index'

export const selectOpenModals = (state: RootState) => state.ui.modals

export const selectToasts = (state: RootState) => state.ui.toasts

/** Selektor sa parametrom — fabrika. */
export const selectModal = (name: ModalName) => (state: RootState) =>
  state.ui.modals.find((modal) => modal.name === name)

/** Overlay modali — njih renderuje `ModalRoot`; popover renderuje komponenta sa dugmetom. */
export const selectOpenOverlays = createSelector([selectOpenModals], (modals) =>
  modals.filter(({ name }) => MODAL_KIND[name] === 'overlay'),
)
