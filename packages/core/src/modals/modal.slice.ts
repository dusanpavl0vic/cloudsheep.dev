import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'

import type { ModalEntry, ModalMeta, ModalState } from './modal.types'

const initialState: ModalState = { stack: [] }

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    modalOpened: {
      reducer(state, action: PayloadAction<ModalEntry>) {
        state.stack.push(action.payload)
      },
      // `prepare` generiše ključ — reducer mora ostati čist, a nanoid nije determinističan
      prepare(id: string, props: unknown, meta?: ModalMeta) {
        return {
          payload: { key: nanoid(), id, props, ...(meta === undefined ? {} : { meta }) },
        }
      },
    },

    modalClosed(state, action: PayloadAction<string>) {
      state.stack = state.stack.filter((entry) => entry.key !== action.payload)
    },

    allModalsClosed(state) {
      state.stack = []
    },
  },
  selectors: {
    selectModalStack: (state) => state.stack,
    selectTopModal: (state) => state.stack.at(-1) ?? null,
    selectHasOpenModal: (state) => state.stack.length > 0,
  },
})

export const { modalOpened, modalClosed, allModalsClosed } = modalSlice.actions
export const { selectModalStack, selectTopModal, selectHasOpenModal } = modalSlice.selectors
export const modalReducer = modalSlice.reducer
export const MODAL_SLICE_NAME = modalSlice.name
