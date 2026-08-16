import { configureStore } from '@reduxjs/toolkit'
import { act, renderHook } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { beforeEach, describe, expect, it } from 'vitest'

import { modalReducer } from './modal.slice'
import { pendingResolverCount, resetResolvers } from './resolvers'
import { useModal } from './useModal'

// Test registruje sopstvene modale u globalnu mapu tipova
declare module './modal.types' {
  interface ModalPropsMap {
    'test.confirm': { entityName: string }
    'test.form': Record<string, never>
  }
}

function setup() {
  const store = configureStore({ reducer: { modal: modalReducer } })
  const wrapper = ({ children }: PropsWithChildren) => <Provider store={store}>{children}</Provider>
  return { store, ...renderHook(() => useModal(), { wrapper }) }
}

describe('useModal', () => {
  beforeEach(() => { resetResolvers() })

  it('open dodaje modal u stack', () => {
    const { result } = setup()

    act(() => { void result.current.open('test.confirm', { entityName: 'Projekat' }) })

    expect(result.current.stack).toHaveLength(1)
    expect(result.current.stack[0]?.id).toBe('test.confirm')
  })

  it('isOpen prijavljuje otvoren modal', () => {
    const { result } = setup()

    expect(result.current.isOpen('test.confirm')).toBe(false)
    act(() => { void result.current.open('test.confirm', { entityName: 'X' }) })
    expect(result.current.isOpen('test.confirm')).toBe(true)
  })

  it('close razrešava promise rezultatom — ovo zamenjuje useEffect koji sluša rezultat', async () => {
    const { result } = setup()

    let promise!: Promise<boolean | undefined>
    act(() => {
      promise = result.current.open<'test.confirm', boolean>('test.confirm', { entityName: 'X' })
    })

    const key = result.current.stack[0]?.key ?? ''
    act(() => { result.current.close(key, true) })

    await expect(promise).resolves.toBe(true)
    expect(result.current.stack).toHaveLength(0)
  })

  it('zatvaranje bez rezultata daje undefined — ESC ili klik van', async () => {
    const { result } = setup()

    let promise!: Promise<boolean | undefined>
    act(() => {
      promise = result.current.open<'test.confirm', boolean>('test.confirm', { entityName: 'X' })
    })

    act(() => { result.current.close(result.current.stack[0]?.key ?? '') })
    await expect(promise).resolves.toBeUndefined()
  })

  it('podržava stack — confirm preko otvorene forme', async () => {
    const { result } = setup()

    let formPromise!: Promise<unknown>
    let confirmPromise!: Promise<unknown>

    act(() => { formPromise = result.current.open('test.form', {}) })
    act(() => { confirmPromise = result.current.open('test.confirm', { entityName: 'X' }) })

    expect(result.current.stack.map((entry) => entry.id)).toEqual(['test.form', 'test.confirm'])

    // Zatvori samo gornji — forma ispod ostaje otvorena
    act(() => { result.current.close(result.current.stack[1]?.key ?? '', 'potvrđeno') })

    await expect(confirmPromise).resolves.toBe('potvrđeno')
    expect(result.current.stack).toHaveLength(1)
    expect(result.current.stack[0]?.id).toBe('test.form')

    act(() => { result.current.close(result.current.stack[0]?.key ?? '', 'sačuvano') })
    await expect(formPromise).resolves.toBe('sačuvano')
  })

  it('closeAll razrešava SVE promise-e — inače bi await visio zauvek', async () => {
    const { result } = setup()

    let first!: Promise<unknown>
    let second!: Promise<unknown>
    act(() => { first = result.current.open('test.form', {}) })
    act(() => { second = result.current.open('test.confirm', { entityName: 'X' }) })

    expect(pendingResolverCount()).toBe(2)

    act(() => { result.current.closeAll() })

    await expect(first).resolves.toBeUndefined()
    await expect(second).resolves.toBeUndefined()
    expect(result.current.stack).toHaveLength(0)
    expect(pendingResolverCount()).toBe(0)
  })

  it('ne ostavlja nerazrešene resolvere posle zatvaranja — provera curenja', async () => {
    const { result } = setup()

    let promise!: Promise<unknown>
    act(() => { promise = result.current.open('test.confirm', { entityName: 'X' }) })
    expect(pendingResolverCount()).toBe(1)

    act(() => { result.current.close(result.current.stack[0]?.key ?? '', true) })
    await promise

    expect(pendingResolverCount()).toBe(0)
  })

  it('dvostruko zatvaranje istog ključa je bezopasno', async () => {
    const { result } = setup()

    let promise!: Promise<unknown>
    act(() => { promise = result.current.open('test.confirm', { entityName: 'X' }) })
    const key = result.current.stack[0]?.key ?? ''

    act(() => { result.current.close(key, true) })
    act(() => { result.current.close(key, false) })

    await expect(promise).resolves.toBe(true)
  })

  it('isti modal otvoren dvaput ima nezavisne rezultate', async () => {
    const { result } = setup()

    let first!: Promise<unknown>
    let second!: Promise<unknown>
    act(() => { first = result.current.open('test.confirm', { entityName: 'A' }) })
    act(() => { second = result.current.open('test.confirm', { entityName: 'B' }) })

    act(() => { result.current.close(result.current.stack[0]?.key ?? '', 'prvi') })
    act(() => { result.current.close(result.current.stack[0]?.key ?? '', 'drugi') })

    await expect(first).resolves.toBe('prvi')
    await expect(second).resolves.toBe('drugi')
  })
})
