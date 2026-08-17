import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useCountUp } from './useCountUp'

/**
 * `requestAnimationFrame` se vozi ručno umesto da se čeka pravi kadar: test tako kontroliše
 * vreme i ne zavisi od brzine mašine. `performance.now` mora da prati isti sat, inače hook
 * računa napredak prema stvarnom vremenu i animacija „preskoči" na kraj.
 */
let now = 0
let queue: FrameRequestCallback[] = []

/** Odvrti jedan kadar sa zadatim pomakom vremena. */
const advance = (ms: number) => {
  now += ms
  const due = queue
  queue = []
  act(() => {
    for (const cb of due) cb(now)
  })
}

beforeEach(() => {
  now = 0
  queue = []
  // Menja se SAMO `now`, na pravom objektu. Prva verzija je zamenila ceo `performance`
  // objektom `{ now }`, pa bi svako `performance.mark()` — a to zovu i React i alati —
  // puklo; otud jedan pad koji se posle nije reprodukovao. `spyOn` čuva prototip, što
  // spread ne bi.
  vi.spyOn(performance, 'now').mockImplementation(() => now)
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    queue.push(cb)
    return queue.length
  })
  vi.stubGlobal('cancelAnimationFrame', () => {
    queue = []
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('useCountUp', () => {
  it('kreće od nule', () => {
    const { result } = renderHook(() => useCountUp(100))
    expect(result.current).toBe(0)
  })

  it('stiže tačno na ciljnu vrednost', () => {
    const { result } = renderHook(() => useCountUp(100, { duration: 1000 }))

    advance(1000)
    expect(result.current).toBe(100)
  })

  it('raste tokom animacije, ne skače na kraju', () => {
    const { result } = renderHook(() => useCountUp(100, { duration: 1000 }))

    advance(300)
    const midway = result.current

    expect(midway).toBeGreaterThan(0)
    expect(midway).toBeLessThan(100)
  })

  it('`immediate` preskače animaciju — to je put za prefers-reduced-motion', () => {
    const { result } = renderHook(() => useCountUp(42, { immediate: true }))

    // Bez ijednog kadra: vrednost se vraća tokom rendera, ne kroz setState
    expect(result.current).toBe(42)
    expect(queue).toHaveLength(0)
  })

  it('dok `active` nije tačno, stoji na nuli i ne traži kadrove', () => {
    const { result } = renderHook(() => useCountUp(42, { active: false }))

    expect(result.current).toBe(0)
    expect(queue).toHaveLength(0)
  })

  it('kreće kad `active` postane tačno', () => {
    const { result, rerender } = renderHook(
      ({ active }) => useCountUp(50, { active, duration: 1000 }),
      {
        initialProps: { active: false },
      },
    )

    expect(result.current).toBe(0)

    rerender({ active: true })
    advance(1000)

    expect(result.current).toBe(50)
  })

  it('poštuje broj decimala', () => {
    const { result } = renderHook(() => useCountUp(99.95, { duration: 1000, decimals: 2 }))

    advance(1000)
    expect(result.current).toBe(99.95)
  })

  it('zaokružuje na zadate decimale i usput — ispis ne sme da trepće', () => {
    const { result } = renderHook(() => useCountUp(99.95, { duration: 1000, decimals: 1 }))

    advance(300)
    // Jedna decimala znači najviše jedno mesto i u međukoracima
    expect(result.current).toBe(Math.round(result.current * 10) / 10)
  })

  it('otkazuje kadar pri unmount-u — inače setState pada na odmontiranoj komponenti', () => {
    const { unmount } = renderHook(() => useCountUp(100, { duration: 1000 }))

    expect(queue.length).toBeGreaterThan(0)
    unmount()
    expect(queue).toHaveLength(0)
  })

  it('kreće ispočetka kad se cilj promeni', () => {
    const { result, rerender } = renderHook(
      ({ target }) => useCountUp(target, { duration: 1000 }),
      {
        initialProps: { target: 100 },
      },
    )

    advance(1000)
    expect(result.current).toBe(100)

    rerender({ target: 200 })
    advance(1000)
    expect(result.current).toBe(200)
  })
})
