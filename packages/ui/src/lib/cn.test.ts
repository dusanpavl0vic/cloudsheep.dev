import { describe, expect, it } from 'vitest'

import { cn } from './cn'

describe('cn', () => {
  it('spaja klase', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('preskače falsy vrednosti', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b')
  })

  it('podržava uslovne objekte', () => {
    expect(cn('a', { b: true, c: false })).toBe('a b')
  })

  it('poslednja Tailwind klasa pobeđuje — ovo je ceo razlog za tailwind-merge', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('razlikuje grupe koje se ne sudaraju', () => {
    expect(cn('px-2', 'py-4')).toBe('px-2 py-4')
  })

  it('className iz propsa pregazi podrazumevani stil', () => {
    // Ovo je ugovor svake komponente: cn(variants(), className)
    expect(cn('bg-primary text-sm', 'bg-muted')).toBe('text-sm bg-muted')
  })

  it('prazan poziv daje prazan string', () => {
    expect(cn()).toBe('')
  })

  it('podržava nizove', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c')
  })
})
