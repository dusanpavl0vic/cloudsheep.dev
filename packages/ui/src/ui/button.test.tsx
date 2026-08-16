import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './button'

describe('Button', () => {
  it('renderuje se kao dugme sa pristupačnim imenom', () => {
    render(<Button>Pošalji</Button>)
    expect(screen.getByRole('button', { name: 'Pošalji' })).toBeInTheDocument()
  })

  it('poziva onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button onClick={onClick}>Klik</Button>)
    await user.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('ne poziva onClick kad je disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <Button disabled onClick={onClick}>
        Klik
      </Button>,
    )
    await user.click(screen.getByRole('button'))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('prosleđuje type', () => {
    render(<Button type="submit">Sačuvaj</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('className iz propsa se spaja sa varijantama', () => {
    render(<Button className="w-full">X</Button>)
    expect(screen.getByRole('button')).toHaveClass('w-full')
  })

  it('asChild renderuje prosleđeno dete umesto <button>', () => {
    render(
      <Button asChild>
        <a href="/kontakt">Kontakt</a>
      </Button>,
    )

    expect(screen.getByRole('link', { name: 'Kontakt' })).toHaveAttribute('href', '/kontakt')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('nema axe povreda', async () => {
    const { container } = render(<Button>Pošalji</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('ikonica-dugme bez teksta mora imati aria-label da bi prošlo axe', async () => {
    const { container } = render(
      <Button aria-label="Zatvori">
        <span aria-hidden="true">×</span>
      </Button>,
    )

    expect(screen.getByRole('button', { name: 'Zatvori' })).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })
})
