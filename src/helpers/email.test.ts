import { describe, expect, it } from 'vitest'

import { emailDomain, hasEmailShape, normalizeEmail, suggestEmail } from './email'

describe('email helperi', () => {
  it('normalizuje razmake i velika slova u domenu, ne i u lokalnom delu', () => {
    expect(normalizeEmail('  Marko.P@GMAIL.com ')).toBe('Marko.P@gmail.com')
    expect(emailDomain('a@Sub.Example.RS')).toBe('sub.example.rs')
  })

  it('prepoznaje oblik adrese', () => {
    expect(hasEmailShape('marko@cloudsheep.dev')).toBe(true)
    expect(hasEmailShape('marko@localhost')).toBe(false)
    expect(hasEmailShape('marko@@gmail.com')).toBe(false)
    expect(hasEmailShape('marko @gmail.com')).toBe(false)
    expect(hasEmailShape('marko@gmail.c')).toBe(false)
  })

  it('predlaže ispravku za grešku u kucanju poznatog provajdera', () => {
    expect(suggestEmail('marko@gmial.com')).toBe('marko@gmail.com')
    expect(suggestEmail('marko@gmail.co')).toBe('marko@gmail.com')
    expect(suggestEmail('marko@hotmial.com')).toBe('marko@hotmail.com')
    expect(suggestEmail('marko@yaho.com')).toBe('marko@yahoo.com')
  })

  it('ne predlaže ništa za poznat ili udaljen domen', () => {
    expect(suggestEmail('marko@gmail.com')).toBeNull()
    expect(suggestEmail('marko@mail.com')).toBeNull()
    expect(suggestEmail('marko@cloudsheep.dev')).toBeNull()
    expect(suggestEmail('nije-adresa')).toBeNull()
    // kratki domeni su preblizu jedni drugima — bez predloga
    expect(suggestEmail('ana@mc.com')).toBeNull()
    expect(suggestEmail('ana@gmx.at')).toBeNull()
  })
})
