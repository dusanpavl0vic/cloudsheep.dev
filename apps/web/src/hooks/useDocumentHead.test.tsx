import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { useDocumentHead } from './useDocumentHead'

const at = (path: string) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>
  )
  return renderHook(
    () => {
      useDocumentHead()
    },
    { wrapper },
  )
}

const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')
const ogUrl = () => document.head.querySelector('meta[property="og:url"]')?.getAttribute('content')
const description = () =>
  document.head.querySelector('meta[name="description"]')?.getAttribute('content')

describe('useDocumentHead', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
  })

  it('postavlja canonical na trenutnu rutu', () => {
    at('/projects')
    expect(canonical()).toBe('https://cloudsheep.dev/projects')
  })

  it('og:url prati canonical', () => {
    at('/contact')
    expect(ogUrl()).toBe('https://cloudsheep.dev/contact')
  })

  it('početna dobija kosu crtu, ne prazan string', () => {
    at('/')
    expect(canonical()).toBe('https://cloudsheep.dev/')
  })

  it('podstranica NE pokazuje na početnu — inače bi pretraživač izbacio rutu iz indeksa', () => {
    at('/uses')
    expect(canonical()).not.toBe('https://cloudsheep.dev/')
  })

  it('ne duplira oznake kad se ruta promeni', () => {
    at('/projects')
    at('/contact')

    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1)
    expect(document.head.querySelectorAll('meta[property="og:url"]')).toHaveLength(1)
  })

  it('naslov i opis se menjaju po ruti — inače sve stranice izgledaju kao ista', () => {
    at('/projects')
    expect(document.title).toBe('seo.projects.title')
    expect(description()).toBe('seo.projects.description')

    at('/contact')
    expect(document.title).toBe('seo.contact.title')
  })

  /**
   * Naslov studije slučaja dolazi iz baze i postavlja ga `ProjectPage`. Efekti dece se
   * izvršavaju PRE efekata roditelja, pa bi ovaj hook inače pregazio ono što je stranica
   * upravo upisala.
   */
  it('studiju slučaja ne dira — njen naslov postavlja stranica', () => {
    document.title = 'BookSphere — CloudSheep'
    at('/projects/booksphere')

    expect(document.title).toBe('BookSphere — CloudSheep')
    expect(canonical()).toBe('https://cloudsheep.dev/projects/booksphere')
  })
})
