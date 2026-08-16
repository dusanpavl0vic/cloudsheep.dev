import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { SectionBlock } from './SectionBlock'

describe('SectionBlock', () => {
  it('renderuje sadržaj', () => {
    render(<SectionBlock>Sadržaj</SectionBlock>)
    expect(screen.getByText('Sadržaj')).toBeInTheDocument()
  })

  it('prikazuje naslov i eyebrow kad su dati', () => {
    render(
      <SectionBlock eyebrow="Usluge" title="Šta radimo">
        Sadržaj
      </SectionBlock>,
    )

    expect(screen.getByText('Usluge')).toBeInTheDocument()
    expect(screen.getByText('Šta radimo')).toBeInTheDocument()
  })

  it('bez zaglavlja ne renderuje praznu traku — zato je || a ne ??', () => {
    const { container } = render(<SectionBlock>Samo sadržaj</SectionBlock>)
    expect(container.querySelector('header')).toBeNull()
  })

  it('prazan string se tretira kao odsutan naslov', () => {
    const { container } = render(<SectionBlock title="">Sadržaj</SectionBlock>)
    expect(container.querySelector('header')).toBeNull()
  })

  it('prosleđuje id — koristi se za sidrišta u navigaciji', () => {
    const { container } = render(<SectionBlock id="usluge">X</SectionBlock>)
    expect(container.querySelector('#usluge')).toBeInTheDocument()
  })

  it('nema axe povreda', async () => {
    const { container } = render(
      <SectionBlock eyebrow="Usluge" title="Šta radimo">
        Sadržaj
      </SectionBlock>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
