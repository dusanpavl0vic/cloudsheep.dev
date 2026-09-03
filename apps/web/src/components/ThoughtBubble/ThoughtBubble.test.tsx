import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ThoughtBubble } from './ThoughtBubble'

describe('ThoughtBubble', () => {
  it('prikazuje sadržaj koji mu je dat', () => {
    render(<ThoughtBubble>misao</ThoughtBubble>)
    expect(screen.getByText('misao')).toBeInTheDocument()
  })

  it('rep je van pristupačnog stabla — tri kružića su crtež, ne sadržaj', () => {
    const { container } = render(<ThoughtBubble>misao</ThoughtBubble>)

    const tail = container.querySelector('[aria-hidden]')
    expect(tail).not.toBeNull()
    expect(tail?.children).toHaveLength(3)
  })

  /**
   * Rep mora biti BRAT plohe, ne dete: kao dete bi nasledio `opacity: 0` sa ulazne animacije
   * roditelja, pa bi kružići iskočili nevidljivi — a red (prvo kružići, pa oblačić) je cela
   * poenta oblačića.
   */
  it('rep nije unutar plohe', () => {
    const { container } = render(<ThoughtBubble>misao</ThoughtBubble>)

    const tail = container.querySelector('[aria-hidden]')
    expect(tail?.contains(screen.getByText('misao'))).toBe(false)
  })
})
