import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import { Dialog } from './dialog'

const noop = () => undefined

describe('Dialog', () => {
  it('zatvoren dijalog nije u pristupačnom stablu', () => {
    render(
      <Dialog open={false} onClose={noop} title="Brisanje">
        Sadržaj
      </Dialog>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('otvoren dijalog ima role="dialog" i naslov kao pristupačno ime', () => {
    render(
      <Dialog open onClose={noop} title="Brisanje projekta">
        Sadržaj
      </Dialog>,
    )

    expect(screen.getByRole('dialog', { name: 'Brisanje projekta' })).toBeInTheDocument()
  })

  it('native `close` događaj javlja gore — pokriva i Esc', () => {
    const onClose = vi.fn()
    render(
      <Dialog open onClose={onClose} title="Brisanje">
        Sadržaj
      </Dialog>,
    )

    screen.getByRole('dialog').dispatchEvent(new Event('close'))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('klik po pozadini zatvara', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Dialog open onClose={onClose} title="Brisanje">
        Sadržaj
      </Dialog>,
    )

    // Cilj klika je sam <dialog>: sadržaj stoji u detetu, pa klik po njemu ne prolazi ovuda
    await user.click(screen.getByRole('dialog'))

    expect(onClose).toHaveBeenCalled()
  })

  it('`dismissible={false}` ne zatvara na klik po pozadini', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Dialog open dismissible={false} onClose={onClose} title="Brisanje">
        Sadržaj
      </Dialog>,
    )

    await user.click(screen.getByRole('dialog'))

    expect(onClose).not.toHaveBeenCalled()
  })

  it('podnožje se ne renderuje kad ga nema', () => {
    const { rerender } = render(
      <Dialog open onClose={noop} title="Brisanje">
        Sadržaj
      </Dialog>,
    )
    expect(screen.queryByRole('button', { name: 'Potvrdi' })).not.toBeInTheDocument()

    rerender(
      <Dialog open onClose={noop} title="Brisanje" footer={<button type="button">Potvrdi</button>}>
        Sadržaj
      </Dialog>,
    )
    expect(screen.getByRole('button', { name: 'Potvrdi' })).toBeInTheDocument()
  })

  it('ponovni render dok je otvoren ne pada — `showModal()` se ne zove dvaput', () => {
    const { rerender } = render(
      <Dialog open onClose={noop} title="Brisanje">
        Sadržaj
      </Dialog>,
    )

    expect(() => {
      rerender(
        <Dialog open onClose={noop} title="Brisanje">
          Drugi sadržaj
        </Dialog>,
      )
    }).not.toThrow()
  })

  /*
   * Centriranje je regresija koja se lako vrati: pretraživač ga daje kroz `margin: auto`,
   * a Tailwind preflight ga poništava sa `margin: 0` na svim elementima.
   */
  it('ima `m-auto` — bez njega se lepi za gornji levi ugao', () => {
    render(
      <Dialog open onClose={noop} title="Brisanje">
        Sadržaj
      </Dialog>,
    )

    expect(screen.getByRole('dialog').className).toContain('m-auto')
  })

  it('nema axe povreda', async () => {
    const { container } = render(
      <Dialog open onClose={noop} title="Brisanje" footer={<button type="button">Potvrdi</button>}>
        Sadržaj
      </Dialog>,
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})
