import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { Card, CardContent, CardHeader, CardTitle } from './card'

describe('Card', () => {
  it('renderuje kompoziciju delova', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Naslov</CardTitle>
        </CardHeader>
        <CardContent>Sadržaj</CardContent>
      </Card>,
    )

    expect(screen.getByText('Naslov')).toBeInTheDocument()
    expect(screen.getByText('Sadržaj')).toBeInTheDocument()
  })

  it('svaki deo prima className', () => {
    render(
      <Card className="c">
        <CardHeader className="h">
          <CardTitle className="t">T</CardTitle>
        </CardHeader>
        <CardContent className="ct">S</CardContent>
      </Card>,
    )

    expect(screen.getByText('T')).toHaveClass('t')
    expect(screen.getByText('S')).toHaveClass('ct')
  })

  it('nema axe povreda', async () => {
    const { container } = render(
      <Card>
        <CardContent>Sadržaj</CardContent>
      </Card>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
