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

  it('prikazuje vrednost sa znakom procenta', () => {
    mockObserver()
    render(<ProgressRing value={95} ariaLabel="Dostupnost" />)
    expect(screen.getByText('95%')).toBeInTheDocument()
  })

  it('prikazuje sopstvenu labelu kad je data', () => {
    mockObserver()
    render(<ProgressRing value={99.95} label="99.95%" ariaLabel="Dostupnost" />)
    expect(screen.getByText('99.95%')).toBeInTheDocument()
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
    [-10, '0%'],
    [150, '100%'],
  ])('ograničava vrednost %i na %s', (value, expected) => {
    mockObserver()
    render(<ProgressRing value={value} ariaLabel="X" />)
    expect(screen.getByText(expected)).toBeInTheDocument()
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
  })

  it('nema axe povreda', async () => {
    mockObserver()
    const { container } = render(<ProgressRing value={95} ariaLabel="Dostupnost" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
