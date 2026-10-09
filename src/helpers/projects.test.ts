import { describe, expect, it } from 'vitest'

import type { ProjectSummary } from '@/types/project'

import { countByCategory, ordinal, pickFeatured } from './projects'

const project = (id: string, overrides: Partial<ProjectSummary> = {}): ProjectSummary => ({
  id,
  slug: id,
  category: 'fullStack',
  year: 2025,
  title: id,
  tagline: '',
  description: '',
  isFeatured: false,
  cover: null,
  metric: null,
  technologies: [],
  ...overrides,
})

describe('pickFeatured', () => {
  it('stavlja istaknute ispred ostalih i čuva redosled unutar grupa', () => {
    const list = [project('a'), project('b', { isFeatured: true }), project('c'), project('d', { isFeatured: true })]
    expect(pickFeatured(list, 3).map((p) => p.id)).toEqual(['b', 'd', 'a'])
  })

  it('bez istaknutih vraća prvih N', () => {
    expect(pickFeatured([project('a'), project('b')], 3).map((p) => p.id)).toEqual(['a', 'b'])
  })
})

describe('countByCategory', () => {
  it('broji samo postojeće kategorije', () => {
    const counts = countByCategory([project('a'), project('b', { category: 'frontend' }), project('c')])
    expect(Object.fromEntries(counts)).toEqual({ fullStack: 2, frontend: 1 })
  })
})

describe('ordinal', () => {
  it('dopunjuje nulom', () => {
    expect(ordinal(0)).toBe('/ 01')
    expect(ordinal(11)).toBe('/ 12')
  })
})
