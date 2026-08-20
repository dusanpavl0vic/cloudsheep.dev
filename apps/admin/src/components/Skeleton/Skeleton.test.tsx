import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SkeletonForm, SkeletonList } from './Skeleton'

describe('SkeletonList', () => {
  /*
   * Ugovor koji je nasleđen od `Spinner`-a: tačno jedna `role="status"` oblast sa labelom.
   * Integracioni test projekata (`getByRole('status')` sa `projects.loading`) se drži baš
   * za to, pa zamena vrteške skeletonom ne sme da ga obori.
   */
  it('objavljuje šta se učitava kroz jednu role="status" oblast', () => {
    render(<SkeletonList rows={3} label="Učitavanje projekata" />)

    expect(screen.getByRole('status')).toHaveTextContent('Učitavanje projekata')
  })

  it('sami blokovi su van pristupačnog stabla', () => {
    const { container } = render(<SkeletonList rows={3} label="Učitavanje" />)

    // Da blokovi nisu skriveni, čitač ekrana bi pročitao desetak praznih elemenata
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(3)
  })

  it('renderuje traženi broj redova', () => {
    const { container } = render(<SkeletonList rows={4} label="Učitavanje" />)

    expect(container.querySelectorAll('[aria-busy] > div')).toHaveLength(4)
  })
})

describe('SkeletonForm', () => {
  it('renderuje traženi broj polja i objavljuje labelu', () => {
    const { container } = render(<SkeletonForm fields={5} label="Učitavanje profila" />)

    expect(screen.getByRole('status')).toHaveTextContent('Učitavanje profila')
    expect(container.querySelectorAll('[aria-busy] > div')).toHaveLength(5)
  })
})
