import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { ModalName } from '@/constants/modals'

import type { ModalProps, Toast } from '../types'
import { initialState } from './initialState'

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /** Otvara modal; isti modal koji je već otvoren se pomera na vrh sa novim props-ima. */
    openModal: (state, { payload }: PayloadAction<{ name: ModalName; props?: ModalProps }>) => {
      state.modals = state.modals.filter((modal) => modal.name !== payload.name)
      state.modals.push({ name: payload.name, props: payload.props ?? {} })
    },
    closeModal: (state, { payload }: PayloadAction<ModalName>) => {
      state.modals = state.modals.filter((modal) => modal.name !== payload)
    },
    closeAllModals: (state) => {
      state.modals = []
    },
    showToast: (state, { payload }: PayloadAction<Toast>) => {
      state.toasts.push(payload)
    },
    hideToast: (state, { payload }: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== payload)
    },
  },
})

export default uiSlice.reducer
