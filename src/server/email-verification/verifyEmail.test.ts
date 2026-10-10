import { beforeEach, describe, expect, it, vi } from 'vitest'

import { resetEmailVerificationCache, verifyEmail, type DnsResolver } from './verifyEmail'

const dnsError = (code: string) => Object.assign(new Error(code), { code })

/** Lažni DNS: po domenu kaže šta MX, A i AAAA vraćaju. */
const fakeResolver = (
  table: Record<string, { mx?: unknown; a?: unknown; aaaa?: unknown }>,
): DnsResolver => {
  const lookup = (domain: string, kind: 'mx' | 'a' | 'aaaa') => {
    const value = table[domain]?.[kind] ?? dnsError('ENOTFOUND')
    return value instanceof Error ? Promise.reject(value) : Promise.resolve(value)
  }
  return {
    resolveMx: (d) => lookup(d, 'mx') as ReturnType<DnsResolver['resolveMx']>,
    resolve4: (d) => lookup(d, 'a') as Promise<string[]>,
    resolve6: (d) => lookup(d, 'aaaa') as Promise<string[]>,
  }
}

const resolver = fakeResolver({
  'cloudsheep.dev': { mx: [{ exchange: 'mx.zoho.eu', priority: 10 }] },
  'samo-a-zapis.rs': { mx: dnsError('ENODATA'), a: ['93.184.216.34'], aaaa: dnsError('ENODATA') },
  'null-mx.com': { mx: [{ exchange: '', priority: 0 }] },
  'servfail.rs': {
    mx: dnsError('ESERVFAIL'),
    a: dnsError('ESERVFAIL'),
    aaaa: dnsError('ESERVFAIL'),
  },
  'gmail.com': { mx: [{ exchange: 'gmail-smtp-in.l.google.com', priority: 5 }] },
  'gmial.com': { mx: [{ exchange: 'parking.example', priority: 10 }] },
  'yaho.com': { mx: [{ exchange: 'parking.example', priority: 10 }] },
})

describe('verifyEmail (ADR 0013)', () => {
  beforeEach(() => {
    resetEmailVerificationCache()
  })

  it('prihvata adresu čiji domen ima MX', async () => {
    await expect(verifyEmail('  Ana@CloudSheep.dev ', { resolver })).resolves.toEqual({
      ok: true,
      email: 'Ana@cloudsheep.dev',
    })
  })

  it('odbija izmišljen domen — ne postoji ni MX ni A', async () => {
    await expect(verifyEmail('x@nepostoji-domen-123.xyz', { resolver })).resolves.toMatchObject({
      ok: false,
      reason: 'noMx',
    })
  })

  it('odbija null MX (RFC 7505) — domen izričito ne prima poštu', async () => {
    await expect(verifyEmail('a@null-mx.com', { resolver })).resolves.toMatchObject({
      ok: false,
      reason: 'noMx',
    })
  })

  it('prihvata domen bez MX-a ako ima A zapis (implicitni MX, RFC 5321 §5.1)', async () => {
    await expect(verifyEmail('a@samo-a-zapis.rs', { resolver })).resolves.toMatchObject({
      ok: true,
    })
  })

  it('prihvata kad DNS ne odgovori — kvar našeg DNS-a ne sme da odbije posetioca', async () => {
    await expect(verifyEmail('a@servfail.rs', { resolver })).resolves.toMatchObject({ ok: true })
  })

  it('odbija grešku u kucanju i nudi ispravku, čak i kad pogrešan domen ima MX', async () => {
    await expect(verifyEmail('marko@yaho.com', { resolver })).resolves.toEqual({
      ok: false,
      reason: 'typo',
      suggestion: 'marko@yahoo.com',
    })
  })

  it('posle potvrde („zadrži kako sam napisao") prolazi, ali MX i dalje važi', async () => {
    await expect(
      verifyEmail('marko@yaho.com', { resolver, allowTypo: true }),
    ).resolves.toMatchObject({ ok: true })
  })

  it('poznat typosquat (gmial.com hvata tuđu poštu) se odbija i posle potvrde', async () => {
    await expect(
      verifyEmail('marko@gmial.com', { resolver, allowTypo: true }),
    ).resolves.toMatchObject({
      ok: false,
      reason: 'disposable',
    })
  })

  it('odbija privremene (disposable) servise', async () => {
    await expect(verifyEmail('bot@mailinator.com', { resolver })).resolves.toMatchObject({
      ok: false,
      reason: 'disposable',
    })
  })

  it('odbija neispravan oblik pre bilo kakvog DNS upita', async () => {
    const spy = vi.fn()
    await expect(
      verifyEmail('nije adresa', { resolver: { ...resolver, resolveMx: spy } }),
    ).resolves.toMatchObject({ ok: false, reason: 'syntax' })
    expect(spy).not.toHaveBeenCalled()
  })

  it('pamti rezultat po domenu — drugi upit ne ide u DNS', async () => {
    const resolveMx = vi.fn(resolver.resolveMx)
    const counted = { ...resolver, resolveMx }
    await verifyEmail('a@cloudsheep.dev', { resolver: counted })
    await verifyEmail('b@cloudsheep.dev', { resolver: counted })
    expect(resolveMx).toHaveBeenCalledTimes(1)
  })
})
