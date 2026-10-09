// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useCarousel } from './useCarousel'

describe('useCarousel', () => {
  it('kruži unapred i unazad', () => {
    const { result } = renderHook(() => useCarousel(3))
    act(() => {
      result.current.prev()
    })
    expect(result.current.active).toBe(2)
    act(() => {
      result.current.next()
    })
    expect(result.current.active).toBe(0)
  })

  it('pomeraj ide najkraćim putem oko kruga', () => {
    const { result } = renderHook(() => useCarousel(4))
    expect([0, 1, 2, 3].map((index) => result.current.offsetOf(index))).toEqual([0, 1, 2, -1])
  })

  it('početni indeks van opsega se svodi na poslednji', () => {
    const { result } = renderHook(() => useCarousel(2, 5))
    expect(result.current.active).toBe(1)
  })
})
