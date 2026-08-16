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
})
