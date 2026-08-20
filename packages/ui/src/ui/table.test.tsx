import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

const example = (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Naziv</TableHead>
        <TableHead>Godina</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Atlas</TableCell>
        <TableCell>2025</TableCell>
      </TableRow>
    </TableBody>
  </Table>
)

describe('Table', () => {
  it('renderuje se kao tabela sa zaglavljem kolona', () => {
    render(example)

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Naziv' })).toBeInTheDocument()
  })

  // `scope="col"` je razlog zašto ovo ostaje <table>, a ne mreža <div>-ova:
  // screen reader uz svaku ćeliju pročita i naziv kolone.
  it('zaglavlja nose scope="col"', () => {
    render(example)

    expect(screen.getByRole('columnheader', { name: 'Godina' })).toHaveAttribute('scope', 'col')
  })

  it('ćelije su u redu tela tabele', () => {
    render(example)

    expect(screen.getByRole('cell', { name: 'Atlas' })).toBeInTheDocument()
  })

  it('nema axe povreda', async () => {
    const { container } = render(example)

    expect(await axe(container)).toHaveNoViolations()
  })
})
