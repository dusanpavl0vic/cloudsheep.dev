import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Textarea } from './textarea'

describe('Textarea', () => {
  it('prihvata višelinijski unos', async () => {
    const user = userEvent.setup()
    render(<Textarea aria-label="Poruka" />)

    await user.type(screen.getByRole('textbox'), 'prvi red{enter}drugi red')
    expect(screen.getByRole('textbox')).toHaveValue('prvi red\ndrugi red')
  })

  it('prosleđuje rows', () => {
    render(<Textarea aria-label="Poruka" rows={8} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '8')
  })

  it('spaja className', () => {
    render(<Textarea aria-label="Poruka" className="min-h-40" />)
    expect(screen.getByRole('textbox')).toHaveClass('min-h-40')
  })
})
