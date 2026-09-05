import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useNativeDialog } from './useNativeDialog'

const ABOVE = '(min-width: 1024px)'

/**
 * jsdom nema top-layer, pa `<dialog>` nema ni `showModal()` ni `close()`. Zamenjeni su
 * najmanjim ponašanjem od kog hook zavisi: `open` atribut i native `close` događaj.
 * Isti polifil stoji u `apps/web/vitest.setup.ts` — ovaj paket nema setup fajl.
 */
if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function close() {
    if (!this.open) return
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
}

type Listener = () => void

/** Zamena za matchMedia sa ručnom kontrolom nad promenom — kao u `useMediaQuery.test.ts`. */
function mockMatchMedia(initial: boolean) {
  const listeners = new Set<Listener>()
  let matches = initial

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      get matches() {
        return matches
      },
      addEventListener: (_: string, fn: Listener) => listeners.add(fn),
      removeEventListener: (_: string, fn: Listener) => listeners.delete(fn),
    })),
  )

  return {
    setMatches(next: boolean) {
      matches = next
      listeners.forEach((fn) => {
        fn()
      })
    },
  }
}

function Harness() {
  const { ref, open, show, close } = useNativeDialog(ABOVE)

  return (
    <>
      <button type="button" onClick={show}>
        otvori
      </button>
      <button type="button" onClick={close}>
        zatvori
      </button>
      <span data-testid="stanje">{open ? 'otvoren' : 'zatvoren'}</span>
      <dialog ref={ref} data-testid="dijalog">
        <p data-testid="sadrzaj">sadržaj</p>
      </dialog>
    </>
  )
}

const stanje = () => screen.getByTestId('stanje').textContent
const dijalog = () => screen.getByTestId<HTMLDialogElement>('dijalog')
const otvori = () => {
  fireEvent.click(screen.getByText('otvori'))
}

describe('useNativeDialog', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('počinje zatvoren', () => {
    mockMatchMedia(false)
    render(<Harness />)

    expect(stanje()).toBe('zatvoren')
    expect(dijalog().open).toBe(false)
  })

  it('`show` otvara i dijalog i stanje', () => {
    mockMatchMedia(false)
    render(<Harness />)

    otvori()
    expect(dijalog().open).toBe(true)
    expect(stanje()).toBe('otvoren')
  })

  it('`close` zatvara platformu, a stanje se menja tek na njen događaj', () => {
    mockMatchMedia(false)
    render(<Harness />)

    otvori()
    fireEvent.click(screen.getByText('zatvori'))

    expect(dijalog().open).toBe(false)
    expect(stanje()).toBe('zatvoren')
  })

  it('native `close` (npr. Esc) spušta stanje bez našeg dugmeta', () => {
    mockMatchMedia(false)
    render(<Harness />)

    otvori()
    act(() => {
      dijalog().close()
    })

    expect(stanje()).toBe('zatvoren')
  })

  it('klik na samu pozadinu zatvara', () => {
    mockMatchMedia(false)
    render(<Harness />)

    otvori()
    fireEvent.click(dijalog())

    expect(stanje()).toBe('zatvoren')
  })

  it('klik na sadržaj NE zatvara — cilj događaja nije sam dijalog', () => {
    mockMatchMedia(false)
    render(<Harness />)

    otvori()
    fireEvent.click(screen.getByTestId('sadrzaj'))

    expect(stanje()).toBe('otvoren')
  })

  it('prelazak u desktop širinu zatvara otvoren panel', () => {
    const media = mockMatchMedia(false)
    render(<Harness />)

    otvori()
    act(() => {
      media.setMatches(true)
    })

    expect(dijalog().open).toBe(false)
    expect(stanje()).toBe('zatvoren')
  })

  it('odjavljuje slušaoce pri unmount-u', () => {
    mockMatchMedia(false)
    const { unmount } = render(<Harness />)

    const spy = vi.spyOn(dijalog(), 'removeEventListener')
    unmount()

    expect(spy.mock.calls.map(([event]) => event)).toEqual(['close', 'click'])
  })
})
