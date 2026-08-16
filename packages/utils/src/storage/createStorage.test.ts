import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { browserStorage, createStorage } from './createStorage'

const themeSchema = z.enum(['light', 'dark'])

/** Minimalni in-memory storage — brži i izolovaniji od jsdom localStorage-a. */
function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: vi.fn((k: string) => data.get(k) ?? null),
    setItem: vi.fn((k: string, v: string) => void data.set(k, v)),
    removeItem: vi.fn((k: string) => void data.delete(k)),
    data,
  }
}

describe('createStorage', () => {
  it('čuva i čita vrednost', () => {
    const storage = memoryStorage()
    const theme = createStorage('theme', themeSchema, storage)

    theme.set('dark')
    expect(storage.setItem).toHaveBeenCalledWith('theme', '"dark"')
    expect(theme.get()).toBe('dark')
  })

  it('vraća null kad ključa nema', () => {
    expect(createStorage('theme', themeSchema, memoryStorage()).get()).toBeNull()
  })

  it('vraća null za pokvaren JSON umesto da baca', () => {
    const theme = createStorage('theme', themeSchema, memoryStorage({ theme: '{nije json' }))
    expect(theme.get()).toBeNull()
  })

  it('vraća null za vrednost koja ne odgovara šemi', () => {
    const theme = createStorage('theme', themeSchema, memoryStorage({ theme: '"neonska"' }))
    expect(theme.get()).toBeNull()
  })

  it('briše vrednost', () => {
    const storage = memoryStorage({ theme: '"dark"' })
    const theme = createStorage('theme', themeSchema, storage)

    theme.remove()
    expect(storage.removeItem).toHaveBeenCalledWith('theme')
    expect(theme.get()).toBeNull()
  })

  it('ne baca kad setItem pukne — popunjena kvota ili private mod', () => {
    const storage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError')
      },
      removeItem: () => undefined,
    }
    expect(() => { createStorage('theme', themeSchema, storage).set('dark'); }).not.toThrow()
  })

  it('ne baca kad getItem pukne', () => {
    const storage = {
      getItem: () => {
        throw new Error('SecurityError')
      },
      setItem: () => undefined,
      removeItem: () => undefined,
    }
    expect(createStorage('theme', themeSchema, storage).get()).toBeNull()
  })

  it('ne baca kad removeItem pukne', () => {
    const storage = {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => {
        throw new Error('SecurityError')
      },
    }
    expect(() => { createStorage('theme', themeSchema, storage).remove(); }).not.toThrow()
  })

  it('browserStorage vraća localStorage kad postoji', () => {
    expect(browserStorage()).toBe(globalThis.localStorage)
  })

  it('browserStorage vraća null van browsera', () => {
    const original = globalThis.localStorage
    // @ts-expect-error — namerno simuliramo okruženje bez localStorage-a
    delete globalThis.localStorage
    try {
      expect(browserStorage()).toBeNull()
    } finally {
      Object.defineProperty(globalThis, 'localStorage', { value: original, configurable: true })
    }
  })

  it('radi bez storage-a uopšte — SSR ili zaključan browser', () => {
    const theme = createStorage('theme', themeSchema, null)
    expect(theme.get()).toBeNull()
    expect(() => {
      theme.set('dark')
      theme.remove()
    }).not.toThrow()
  })

  it('podržava složene objekte', () => {
    const schema = z.object({ id: z.string(), count: z.number() })
    const storage = memoryStorage()
    const box = createStorage('box', schema, storage)

    box.set({ id: 'a', count: 2 })
    expect(box.get()).toEqual({ id: 'a', count: 2 })
  })
})
