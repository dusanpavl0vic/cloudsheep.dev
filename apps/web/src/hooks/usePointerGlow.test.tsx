import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { glowPanelProps, usePointerGlow } from './usePointerGlow'

/** jsdom nema `matchMedia`; hook ga koristi za `prefers-reduced-motion`. */
function stubMatchMedia(reduced: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: reduced,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    })),
  )
}

const Panels = () => {
  const ref = usePointerGlow<HTMLDivElement>()

  return (
    <div ref={ref} data-testid="grid">
      <article {...glowPanelProps} data-testid="a">
        <span data-testid="inner">a</span>
      </article>
      <article {...glowPanelProps} data-testid="b">
        b
      </article>
    </div>
  )
}

const move = (node: Element, x: number, y: number) => {
  node.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }))
  node.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: x, clientY: y }))
}

describe('usePointerGlow', () => {
  it('piše koordinate na panel pod kursorom, ne na ostale', () => {
    stubMatchMedia(false)
    const { getByTestId } = render(<Panels />)

    move(getByTestId('a'), 40, 60)

    expect(getByTestId('a').style.getPropertyValue('--gx')).toBe('40px')
    expect(getByTestId('a').style.getPropertyValue('--gy')).toBe('60px')
    expect(getByTestId('b').style.getPropertyValue('--gx')).toBe('')
  })

  /* Događaj puca na unutrašnjem elementu; panel se nalazi kroz `closest()`. */
  it('nalazi panel i kad događaj dođe iz njegovog deteta', () => {
    stubMatchMedia(false)
    const { getByTestId } = render(<Panels />)

    move(getByTestId('inner'), 12, 14)

    expect(getByTestId('a').style.getPropertyValue('--gx')).toBe('12px')
  })

  /*
   * Prelaz na drugi panel mora da OČISTI prethodni. Bez toga ostane upaljen i posle nego
   * što je kursor otišao, jer CSS gasi sloj prelivom a promenljive ostaju upisane.
   */
  it('gasi prethodni panel pri prelazu na sledeći', () => {
    stubMatchMedia(false)
    const { getByTestId } = render(<Panels />)

    move(getByTestId('a'), 40, 60)
    move(getByTestId('b'), 10, 20)

    expect(getByTestId('a').style.getPropertyValue('--gx')).toBe('')
    expect(getByTestId('b').style.getPropertyValue('--gx')).toBe('10px')
  })

  it('sa ugašenim pokretom ne kači ništa', () => {
    stubMatchMedia(true)
    const { getByTestId } = render(<Panels />)

    move(getByTestId('a'), 40, 60)

    expect(getByTestId('a').style.getPropertyValue('--gx')).toBe('')
  })
})
