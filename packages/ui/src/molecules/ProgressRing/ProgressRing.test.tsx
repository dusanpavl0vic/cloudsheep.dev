import { act, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ProgressRing } from './ProgressRing'

type Callback = (entries: { isIntersecting: boolean }[]) => void

function mockObserver() {
  const instances: { callback: Callback }[] = []

  class FakeObserver {
    callback: Callback
    constructor(callback: Callback) {
      this.callback = callback
      instances.push(this)
    }
    observe() {
      /* no-op */
    }
    disconnect() {
      /* no-op */
    }
    unobserve() {
      /* no-op */
    }
  }

  vi.stubGlobal('IntersectionObserver', FakeObserver)
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: false,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    })),
  )

  return {
    enter() {
      instances.at(-1)?.callback([{ isIntersecting: true }])
    },
  }
}

const offsetOf = (container: HTMLElement) =>
  container.querySelectorAll('circle')[1]?.getAttribute('stroke-dashoffset')

describe('ProgressRing', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('brojač kreće od nule i odbrojava tek na ulasku u viewport', () => {
    mockObserver()
    render(<ProgressRing value={95} ariaLabel="Dostupnost" />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('poštuje broj decimala', () => {
    mockObserver()
    render(<ProgressRing value={99.95} decimals={2} ariaLabel="Dostupnost" />)
    // Pre ulaska u viewport brojač stoji na nuli
    expect(screen.getByText('0.00%')).toBeInTheDocument()
  })

  it('prihvata sopstveni sufiks', () => {
    mockObserver()
    render(<ProgressRing value={40} suffix=" GB" ariaLabel="Prostor" />)
    expect(screen.getByText('0 GB')).toBeInTheDocument()
  })

  it('domain mapira vrednost u vidljiv luk — 99.95%% na skali 0-100 bio bi nevidljiv', () => {
    const observer = mockObserver()

    const { container: full } = render(
      <ProgressRing value={99.95} decimals={2} ariaLabel="A" />,
    )
    act(() => {
      observer.enter()
    })
    const fullScaleOffset = Number(offsetOf(full))

    const observer2 = mockObserver()
    const { container: scaled } = render(
      <ProgressRing value={99.95} domain={[99, 100]} decimals={2} ariaLabel="B" />,
    )
    act(() => {
      observer2.enter()
    })
    const scaledOffset = Number(offsetOf(scaled))

    // Na punoj skali procep je ispod pola piksela; na suženom opsegu je merljiv
    expect(fullScaleOffset).toBeLessThan(1)
    expect(scaledOffset).toBeGreaterThan(15)
  })

  it('kreće prazan i puni se tek na ulazak u viewport', () => {
    const observer = mockObserver()
    const { container } = render(<ProgressRing value={75} ariaLabel="Dostupnost" />)

    const empty = offsetOf(container)

    // act je nužan: callback observera menja state van React event petlje
    act(() => {
      observer.enter()
    })

    expect(offsetOf(container)).not.toBe(empty)
  })

  it('ima pristupačno ime — SVG sam po sebi ne kaže šta meri', () => {
    mockObserver()
    render(<ProgressRing value={50} ariaLabel="Dostupnost servisa" />)
    expect(screen.getByRole('img', { name: 'Dostupnost servisa' })).toBeInTheDocument()
  })

  it.each([
    [-10, 0],
    [150, 1],
  ])('ograničava luk za vrednost %i van opsega', (value, expectedRatio) => {
    const observer = mockObserver()
    const { container } = render(<ProgressRing value={value} ariaLabel="X" />)

    act(() => {
      observer.enter()
    })

    const circumference = 2 * Math.PI * ((112 - 8) / 2) // podrazumevani size='md'
    const offset = Number(offsetOf(container))
    expect(offset).toBeCloseTo(circumference * (1 - expectedRatio), 0)
  })

  it('sa prefers-reduced-motion crta punu vrednost odmah, bez čekanja na viewport', () => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {
          /* no-op */
        }
        disconnect() {
          /* no-op */
        }
        unobserve() {
          /* no-op */
        }
      },
    )
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: true,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      })),
    )

    const { container } = render(<ProgressRing value={100} ariaLabel="X" />)

    expect(offsetOf(container)).toBe('0')
    // Brojač takođe preskače animaciju
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('nema axe povreda', async () => {
    mockObserver()
    const { container } = render(<ProgressRing value={95} ariaLabel="Dostupnost" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
