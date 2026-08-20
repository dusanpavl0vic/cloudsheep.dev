import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DisciplineCard } from './DisciplineCard'

const PROPS = {
  no: '01',
  slug: '/ design',
  title: 'Product Design',
  description: 'UX tokovi i sistemi.',
  tags: ['ux/ui', 'prototyping'] as const,
}

describe('DisciplineCard', () => {
  it('sadržaj je u pristupačnom stablu', () => {
    render(<DisciplineCard {...PROPS} />)

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Product Design')
    expect(screen.getByText('UX tokovi i sistemi.')).toBeInTheDocument()
    expect(screen.getByText('ux/ui')).toBeInTheDocument()
  })

  /*
   * Svetlo, nit, ugaonici i duh-numeral su ukras: pet slojeva, nijedan u redu čitanja. Broj
   * ne nosi informaciju koja već nije u redosledu kartica, a ostala četiri su čist stil.
   */
  it('dekoracija je van pristupačnog stabla', () => {
    const { container } = render(<DisciplineCard {...PROPS} />)

    expect(container.querySelectorAll('article > span[aria-hidden="true"]')).toHaveLength(5)
  })

  /*
   * Broj se crta kroz `content: attr(data-no)`, a ne kao tekst — inače axe obara
   * `color-contrast` na svakoj kartici (1.1 prema podlozi, pravilo traži 3:1), jer meri šta
   * oko vidi, a ne šta čitač ekrana čita.
   *
   * jsdom ne razrešava `::before`, pa je atribut jedino što se ovde može proveriti. Da neko
   * vrati `{no}` u JSX, ovaj test i dalje prolazi — ali e2e axe provera na `/` pada, i to je
   * mesto gde je regresija i uhvaćena prvi put.
   */
  it('broj putuje kroz atribut, ne kao tekstualni čvor', () => {
    const { container } = render(<DisciplineCard {...PROPS} />)

    expect(container.querySelector('span[data-no="01"]')).not.toBeNull()
    expect(screen.queryByText('01')).not.toBeInTheDocument()
  })

  /*
   * Bez `data-glow` atributa `usePointerGlow` ne nalazi panel kroz `closest()`, pa svetlo
   * tiho prestane da radi — a to se ne vidi ni u jednom drugom testu, jer jsdom ne crta.
   */
  it('nosi kačku na koju se svetlo veže', () => {
    const { container } = render(<DisciplineCard {...PROPS} />)

    expect(container.querySelector('article[data-glow]')).not.toBeNull()
  })
})
