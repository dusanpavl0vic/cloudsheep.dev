import { describe, expect, it } from 'vitest'

import {
  allModalsClosed,
  modalClosed,
  modalOpened,
  modalReducer,
  selectHasOpenModal,
  selectModalStack,
  selectTopModal,
} from './modal.slice'
import type { ModalState } from './modal.types'

const empty: ModalState = { stack: [] }

describe('modal.slice', () => {
  it('kreće od praznog stack-a', () => {
    expect(modalReducer(undefined, { type: 'init' })).toEqual(empty)
  })

  it('modalOpened dodaje unos', () => {
    const state = modalReducer(empty, modalOpened('confirm', { id: '1' }))

    expect(state.stack).toHaveLength(1)
    expect(state.stack[0]?.id).toBe('confirm')
    expect(state.stack[0]?.props).toEqual({ id: '1' })
    expect(state.stack[0]?.key).toBeTruthy()
  })

  it('svako otvaranje dobija jedinstven ključ — isti modal može biti otvoren dvaput', () => {
    let state = modalReducer(empty, modalOpened('confirm', { id: '1' }))
    state = modalReducer(state, modalOpened('confirm', { id: '2' }))

    expect(state.stack).toHaveLength(2)
    expect(state.stack[0]?.key).not.toBe(state.stack[1]?.key)
  })

  it('slaže modale u stack — confirm preko forme', () => {
    let state = modalReducer(empty, modalOpened('form', {}))
    state = modalReducer(state, modalOpened('confirm', {}))

    expect(state.stack.map((entry) => entry.id)).toEqual(['form', 'confirm'])
  })

  it('prenosi meta kad je dat', () => {
    const state = modalReducer(empty, modalOpened('confirm', {}, { dismissible: false, size: 'sm' }))
    expect(state.stack[0]?.meta).toEqual({ dismissible: false, size: 'sm' })
  })

  it('izostavlja meta kad nije dat — exactOptionalPropertyTypes', () => {
    const state = modalReducer(empty, modalOpened('confirm', {}))
    expect(state.stack[0]).not.toHaveProperty('meta')
  })

  it('modalClosed uklanja samo traženi unos', () => {
    let state = modalReducer(empty, modalOpened('a', {}))
    state = modalReducer(state, modalOpened('b', {}))
    const firstKey = state.stack[0]?.key ?? ''

    state = modalReducer(state, modalClosed(firstKey))

    expect(state.stack).toHaveLength(1)
    expect(state.stack[0]?.id).toBe('b')
  })

  it('modalClosed za nepoznat ključ ne menja stanje', () => {
    const state = modalReducer(empty, modalOpened('a', {}))
    expect(modalReducer(state, modalClosed('nepostojeci')).stack).toHaveLength(1)
  })

  it('allModalsClosed prazni stack', () => {
    let state = modalReducer(empty, modalOpened('a', {}))
    state = modalReducer(state, modalOpened('b', {}))

    expect(modalReducer(state, allModalsClosed()).stack).toEqual([])
  })
})

describe('selektori', () => {
  const withStack = (ids: string[]): { modal: ModalState } => ({
    modal: { stack: ids.map((id, index) => ({ key: `k${String(index)}`, id, props: {} })) },
  })

  it('selectModalStack vraća stack', () => {
    expect(selectModalStack(withStack(['a', 'b']))).toHaveLength(2)
  })

  it('selectTopModal vraća poslednji', () => {
    expect(selectTopModal(withStack(['a', 'b']))?.id).toBe('b')
  })

  it('selectTopModal vraća null za prazan stack', () => {
    expect(selectTopModal(withStack([]))).toBeNull()
  })

  it('selectHasOpenModal', () => {
    expect(selectHasOpenModal(withStack(['a']))).toBe(true)
    expect(selectHasOpenModal(withStack([]))).toBe(false)
  })
})
