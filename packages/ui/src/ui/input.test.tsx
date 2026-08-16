import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Input } from './input'

describe('Input', () => {
  it('prihvata unos', async () => {
    const user = userEvent.setup()
    render(<Input aria-label="Ime" />)

    await user.type(screen.getByRole('textbox'), 'Marko')
    expect(screen.getByRole('textbox')).toHaveValue('Marko')
  })

  it('poziva onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Input aria-label="Ime" onChange={onChange} />)
    await user.type(screen.getByRole('textbox'), 'a')

    expect(onChange).toHaveBeenCalled()
  })

  it('prosleđuje type', () => {
    render(<Input type="email" aria-label="E-pošta" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
  })

  it('podržava disabled', async () => {
    const user = userEvent.setup()
    render(<Input aria-label="Ime" disabled />)

    await user.type(screen.getByRole('textbox'), 'x')
    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('prosleđuje aria-invalid za stanje greške', () => {
    render(<Input aria-label="Ime" aria-invalid />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })
})
