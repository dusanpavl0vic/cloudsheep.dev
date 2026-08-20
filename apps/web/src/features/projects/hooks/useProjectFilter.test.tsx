import { renderHook } from '@testing-library/react'
import { act } from 'react'
import type { PropsWithChildren } from 'react'
import { MemoryRouter, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'

import { useProjectFilter } from './useProjectFilter'
import type { Project } from '../types'

const project = (slug: string, category: Project['category']): Project => ({
  id: slug,
  slug,
  category,
  year: 2025,
  isFeatured: false,
  mediaSide: 'start',
  galleryLayout: 'grid',
  technologies: [],
  images: [],
  liveUrl: null,
  repoUrl: null,
  title: { sr: slug, en: slug },
  cat: { sr: '', en: '' },
  desc: { sr: '', en: '' },
  caption: { sr: '', en: '' },
})

const projects = [
  project('a', 'frontend'),
  project('b', 'backend'),
  project('c', 'frontend'),
  project('d', 'fullStack'),
]

const wrapper = (initial: string) =>
  function Wrapper({ children }: PropsWithChildren) {
    return <MemoryRouter initialEntries={[initial]}>{children}</MemoryRouter>
  }

/** Vraća i filter i trenutni URL, da se može tvrditi da je stanje ZAISTA u adresi. */
const setup = (initial = '/projects') =>
  renderHook(() => ({ filter: useProjectFilter(projects), location: useLocation() }), {
    wrapper: wrapper(initial),
  })

describe('useProjectFilter', () => {
  it('bez parametra prikazuje sve', () => {
    const { result } = setup()

    expect(result.current.filter.active).toBe('all')
    expect(result.current.filter.visible).toHaveLength(4)
  })

  it('čita kategoriju iz URL-a — filtriran pogled se može poslati linkom', () => {
    const { result } = setup('/projects?category=frontend')

    expect(result.current.filter.active).toBe('frontend')
    expect(result.current.filter.visible.map((p) => p.slug)).toEqual(['a', 'c'])
  })

  it('promena filtera upisuje kategoriju u URL', () => {
    const { result } = setup()

    act(() => {
      result.current.filter.setCategory('backend')
    })

    expect(result.current.location.search).toBe('?category=backend')
    expect(result.current.filter.visible.map((p) => p.slug)).toEqual(['b'])
  })

  // Čist link je podrazumevano stanje — `?category=all` je šum u adresi
  it('povratak na „sve" briše parametar iz URL-a', () => {
    const { result } = setup('/projects?category=backend')

    act(() => {
      result.current.filter.setCategory('all')
    })

    expect(result.current.location.search).toBe('')
    expect(result.current.filter.visible).toHaveLength(4)
  })

  // Ručno pokvaren URL ne sme da isprazni stranicu
  it('nepoznata kategorija u URL-u se ponaša kao „sve"', () => {
    const { result } = setup('/projects?category=izmisljeno')

    expect(result.current.filter.active).toBe('all')
    expect(result.current.filter.visible).toHaveLength(4)
  })

  it('kategorija bez ijednog projekta daje praznu listu, ne sve', () => {
    const { result } = setup('/projects?category=openSource')

    expect(result.current.filter.visible).toHaveLength(0)
  })
})
