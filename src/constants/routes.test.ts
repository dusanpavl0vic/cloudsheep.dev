import { describe, expect, it } from 'vitest'

import { contactHref, homeSectionHref, noteHref, projectHref, projectsHref } from './routes'

describe('route builderi', () => {
  it('popunjavaju parametar i enkoduju ga', () => {
    expect(projectHref('booksphere')).toBe('/projects/booksphere')
    expect(noteHref('a b')).toBe('/notes/a%20b')
  })

  it('preskaču prazan query', () => {
    expect(projectsHref()).toBe('/projects')
    expect(projectsHref('mobile')).toBe('/projects?category=mobile')
    expect(contactHref({ type: 'webapp', budget: '' })).toBe('/contact?type=webapp')
  })

  it('sidro sekcije početne', () => {
    expect(homeSectionHref('pricing')).toBe('/#pricing')
  })
})
