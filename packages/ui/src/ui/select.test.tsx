import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import { Checkbox } from './checkbox'
import { Select } from './select'
import { FormField } from '../molecules/FormField'

describe('Select', () => {
  it('renderuje se kao combobox sa opcijama', () => {
    render(
      <FormField label="Kategorija">
        {(field) => (
          <Select {...field} defaultValue="frontend">
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
          </Select>
        )}
      </FormField>,
    )

    expect(screen.getByLabelText('Kategorija')).toHaveValue('frontend')
  })

  it('menja vrednost tastaturom i mišem', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <FormField label="Kategorija">
        {(field) => (
          <Select {...field} defaultValue="frontend" onChange={onChange}>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
          </Select>
        )}
      </FormField>,
    )

    await user.selectOptions(screen.getByLabelText('Kategorija'), 'backend')

    expect(screen.getByLabelText('Kategorija')).toHaveValue('backend')
    expect(onChange).toHaveBeenCalled()
  })

  it('nema axe povreda', async () => {
    const { container } = render(
      <FormField label="Kategorija">
        {(field) => (
          <Select {...field}>
            <option value="frontend">Frontend</option>
          </Select>
        )}
      </FormField>,
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Checkbox', () => {
  it('uključuje se i isključuje', async () => {
    const user = userEvent.setup()

    render(<FormField label="Objavljen">{(field) => <Checkbox {...field} />}</FormField>)

    const box = screen.getByLabelText('Objavljen')
    expect(box).not.toBeChecked()

    await user.click(box)
    expect(box).toBeChecked()
  })

  it('`type` se ne može promeniti — nije podešavanje nego greška', () => {
    render(<FormField label="Objavljen">{(field) => <Checkbox {...field} />}</FormField>)

    expect(screen.getByLabelText('Objavljen')).toHaveAttribute('type', 'checkbox')
  })

  it('nema axe povreda', async () => {
    const { container } = render(
      <FormField label="Objavljen">{(field) => <Checkbox {...field} />}</FormField>,
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})
