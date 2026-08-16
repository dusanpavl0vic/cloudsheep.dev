import { describe, expect, it } from 'vitest'

import { loginSchema } from './login.schema'

const valid = { email: 'a@b.rs', password: 'lozinka123', rememberMe: false }

describe('loginSchema', () => {
  it('prihvata ispravan unos', () => {
    expect(loginSchema.safeParse(valid).success).toBe(true)
  })

  it.each(['', 'a', 'a@', 'a@b', 'bez-monkey.rs'])('odbija neispravnu e-poštu: %s', (email) => {
    const result = loginSchema.safeParse({ ...valid, email })
    expect(result.success).toBe(false)
  })

  it('poruka za e-poštu je i18n ključ, ne tekst', () => {
    const result = loginSchema.safeParse({ ...valid, email: 'nije-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('auth.errors.emailInvalid')
    }
  })

  it('odbija prekratku lozinku', () => {
    const result = loginSchema.safeParse({ ...valid, password: 'kratka' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('auth.errors.passwordTooShort')
    }
  })

  it('prihvata lozinku od tačno 8 znakova', () => {
    expect(loginSchema.safeParse({ ...valid, password: '12345678' }).success).toBe(true)
  })

  it('rememberMe je obavezan boolean', () => {
    const withoutFlag: Record<string, unknown> = { ...valid }
    delete withoutFlag.rememberMe
    expect(loginSchema.safeParse(withoutFlag).success).toBe(false)
  })
})
