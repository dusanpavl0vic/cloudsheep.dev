import { createSlice } from '@reduxjs/toolkit'
import { describe, expect, it } from 'vitest'

import { createStore } from './createStore'

const counter = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    incremented: (state) => {
      state.value += 1
    },
  },
})

const extra = createSlice({
  name: 'extra',
  initialState: { loaded: true },
  reducers: {},
})

describe('createStore', () => {
  it('registruje prosleđene reducere', () => {
    const store = createStore({ reducers: { counter: counter.reducer } })
    expect(store.getState()).toHaveProperty('counter')
  })

  it('modal reducer je uvek prisutan — engine mora raditi u svakoj app-i', () => {
    const store = createStore({ reducers: {} })
    const state = store.getState() as { modal: { stack: unknown[] } }

    expect(state).toHaveProperty('modal')
    expect(state.modal).toEqual({ stack: [] })
  })

  it('akcije rade', () => {
    const store = createStore({ reducers: { counter: counter.reducer } })
    store.dispatch(counter.actions.incremented())
    expect((store.getState() as { counter: { value: number } }).counter.value).toBe(1)
  })

  it('prihvata preloadedState', () => {
    const store = createStore({
      reducers: { counter: counter.reducer },
      preloadedState: { counter: { value: 42 } },
    })
    expect((store.getState() as { counter: { value: number } }).counter.value).toBe(42)
  })

  it('injectReducer dodaje reducer u letu', () => {
    const store = createStore({ reducers: { counter: counter.reducer } })

    expect(store.getState()).not.toHaveProperty('extra')
    store.injectReducer('extra', extra.reducer)
    expect(store.getState()).toHaveProperty('extra')
  })

  it('injectReducer čuva postojeće stanje', () => {
    const store = createStore({ reducers: { counter: counter.reducer } })
    store.dispatch(counter.actions.incremented())

    store.injectReducer('extra', extra.reducer)

    expect((store.getState() as { counter: { value: number } }).counter.value).toBe(1)
  })

  it('ponovljeni injectReducer je no-op', () => {
    const store = createStore({ reducers: {} })

    store.injectReducer('extra', extra.reducer)
    store.injectReducer('extra', extra.reducer)

    expect(store.hasReducer('extra')).toBe(true)
  })

  it('injectReducer ne pregazi statički reducer', () => {
    const store = createStore({ reducers: { counter: counter.reducer } })
    store.dispatch(counter.actions.incremented())

    store.injectReducer('counter', extra.reducer)

    expect((store.getState() as { counter: { value: number } }).counter.value).toBe(1)
  })

  it('hasReducer prepoznaje statičke i lazy reducere', () => {
    const store = createStore({ reducers: { counter: counter.reducer } })

    expect(store.hasReducer('counter')).toBe(true)
    expect(store.hasReducer('modal')).toBe(true)
    expect(store.hasReducer('extra')).toBe(false)

    store.injectReducer('extra', extra.reducer)
    expect(store.hasReducer('extra')).toBe(true)
  })

  it('prihvata dodatni middleware', () => {
    const seen: string[] = []
    const spy =
      () =>
      (next: (action: unknown) => unknown) =>
      (action: unknown) => {
        seen.push((action as { type: string }).type)
        return next(action)
      }

    const store = createStore({ reducers: { counter: counter.reducer }, middleware: [spy] })
    store.dispatch(counter.actions.incremented())

    expect(seen).toContain('counter/incremented')
  })
})
