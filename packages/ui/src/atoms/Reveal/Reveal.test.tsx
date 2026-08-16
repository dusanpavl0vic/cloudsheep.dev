import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Reveal } from './Reveal'

type Callback = (entries: { isIntersecting: boolean; target: Element }[]) => void

function mockObserver() {
  const instances: { callback: Callback; observed: Element[] }[] = []

  class FakeObserver {
    callback: Callback
    observed: Element[] = []
    constructor(callback: Callback) {
      this.callback = callback
      instances.push(this)
    }
    observe(el: Element) { this.observed.push(el) }
    disconnect() { /* no-op */ }
    unobserve() { /* no-op */ }
  }

  vi.stubGlobal('IntersectionObserver', FakeObserver)
  return {
    enter() {
      const last = instances.at(-1)
      const target = last?.observed[0]
      if (last && target) last.callback([{ isIntersecting: true, target }])
    },
    get count() { return instances.length },
  }
}

describe('Reveal', () => {
  afterEach(() => { vi.unstubAllGlobals() })

  it('renderuje decu odmah — sadržaj postoji i pre animacije', () => {
    mockObserver()
    render(<Reveal>Sadržaj</Reveal>)
    expect(screen.getByText('Sadržaj')).toBeInTheDocument()
  })

  it('podrazumevano je <div>, `as` ga menja', () => {
    mockObserver()
    const { container, rerender } = render(<Reveal>X</Reveal>)
    expect(container.firstElementChild?.tagName).toBe('DIV')

    rerender(<Reveal as="section">X</Reveal>)
    expect(container.firstElementChild?.tagName).toBe('SECTION')
  })

  it('posmatra element preko IntersectionObserver-a', () => {
    const observer = mockObserver()
    render(<Reveal>X</Reveal>)
    expect(observer.count).toBe(1)
  })

  it('ulazak u viewport menja klasu na čvoru — bez rerendera po skrolu', () => {
    const observer = mockObserver()
    const { container } = render(<Reveal>X</Reveal>)

    const before = container.firstElementChild?.className
    observer.enter()
    expect(container.firstElementChild?.className).not.toBe(before)
  })

  it('direction menja početni stil', () => {
    mockObserver()
    const { container, rerender } = render(<Reveal direction="up">X</Reveal>)
    const before = container.firstElementChild?.className

    rerender(<Reveal direction="left">X</Reveal>)
    expect(container.firstElementChild?.className).not.toBe(before)
  })

  it('ne pada kad IntersectionObserver ne postoji', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    expect(() => render(<Reveal>X</Reveal>)).not.toThrow()
  })
})
