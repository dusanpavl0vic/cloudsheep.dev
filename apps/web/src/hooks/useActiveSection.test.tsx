import { act, renderHook } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useActiveSection } from './useActiveSection'

interface Entry {
  isIntersecting: boolean
  target: { id: string }
}
type Callback = (entries: Entry[]) => void

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

  return {
    emit(entries: Entry[]) {
      act(() => {
        instances.at(-1)?.callback(entries)
      })
    },
  }
}

const addSections = (ids: string[]) => {
  for (const id of ids) {
    const el = document.createElement('section')
    el.id = id
    document.body.append(el)
  }
}

const enter = (id: string): Entry => ({ isIntersecting: true, target: { id } })
const leave = (id: string): Entry => ({ isIntersecting: false, target: { id } })

const wrapper = ({ children }: PropsWithChildren) => <MemoryRouter>{children}</MemoryRouter>

const render = (ids: string[]) => renderHook(() => useActiveSection(ids), { wrapper })

describe('useActiveSection', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.unstubAllGlobals()
  })

  it('kreće bez aktivne sekcije', () => {
    addSections(['services'])
    mockObserver()

    expect(render(['services']).result.current).toBeNull()
  })

  it('sekcija koja uđe u zonu postaje aktivna', () => {
    addSections(['services', 'process'])
    const observer = mockObserver()
    const { result } = render(['services', 'process'])

    observer.emit([enter('services')])
    expect(result.current).toBe('services')
  })

  it('izlazak sekcije oslobađa aktivno stanje', () => {
    addSections(['services'])
    const observer = mockObserver()
    const { result } = render(['services'])

    observer.emit([enter('services')])
    observer.emit([leave('services')])

    expect(result.current).toBeNull()
  })

  it('kad su dve sekcije u zoni, pobeđuje VIŠA u dokumentu', () => {
    addSections(['services', 'process'])
    const observer = mockObserver()
    const { result } = render(['services', 'process'])

    // Redosled prijave je nebitan — presuđuje redosled u nizu, ne redosled događaja
    observer.emit([enter('process'), enter('services')])
    expect(result.current).toBe('services')
  })

  it('prelazak na sledeću sekciju menja aktivnu', () => {
    addSections(['services', 'process'])
    const observer = mockObserver()
    const { result } = render(['services', 'process'])

    observer.emit([enter('services')])
    observer.emit([enter('process')])
    expect(result.current).toBe('services')

    observer.emit([leave('services')])
    expect(result.current).toBe('process')
  })

  it('ne pada kad sekcije ne postoje u DOM-u — druge rute ih ne renderuju', () => {
    mockObserver()
    expect(render(['services']).result.current).toBeNull()
  })

  it('ne pada bez podrške za IntersectionObserver', () => {
    addSections(['services'])
    vi.stubGlobal('IntersectionObserver', undefined)

    expect(render(['services']).result.current).toBeNull()
  })
})
