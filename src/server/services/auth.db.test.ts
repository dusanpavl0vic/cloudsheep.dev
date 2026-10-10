import bcrypt from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { prisma } from '../db'
import { login, logout, refresh } from './auth'

beforeEach(async () => {
  await prisma.user.create({
    data: {
      email: 'admin@primer.rs',
      name: 'Admin',
      passwordHash: await bcrypt.hash('ispravna-lozinka', 4),
    },
  })
})

describe('auth', () => {
  it('ista greška za pogrešnu lozinku i nepostojeći nalog', async () => {
    await expect(login('admin@primer.rs', 'pogresna-lozinka', false)).rejects.toMatchObject({
      status: 401,
      messageKey: 'auth.errors.invalidCredentials',
    })
    await expect(login('nema@primer.rs', 'ispravna-lozinka', false)).rejects.toMatchObject({
      status: 401,
      messageKey: 'auth.errors.invalidCredentials',
    })
  })

  it('refresh rotira token — stari više ne radi', async () => {
    const session = await login('admin@primer.rs', 'ispravna-lozinka', false)
    const rotated = await refresh(session.refreshToken)

    expect(rotated?.accessToken).toBeTruthy()
    expect(await refresh(session.refreshToken)).toBeNull()
  })

  it('odjava briše sesiju, i sa nevažećim tokenom ne baca grešku', async () => {
    const session = await login('admin@primer.rs', 'ispravna-lozinka', true)
    await logout(session.refreshToken)
    await logout('nepostojeci-token')
    expect(await prisma.refreshToken.count()).toBe(0)
  })
})
