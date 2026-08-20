import { afterEach, describe, expect, it, vi } from 'vitest'

const writeFile = vi.fn()
const mkdir = vi.fn()

// Disk se ne dira: testira se ODLUKA (šta se prihvata, kako se ime), ne fajl sistem.
vi.mock('node:fs/promises', () => ({ writeFile, mkdir }))

const { storeUpload, publicUrl } = await import('./uploads.ts')

/** Najmanji PNG koji nosi ispravan IHDR sa dimenzijama. */
const png = (width: number, height: number) => {
  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(25)
  ihdr.writeUInt32BE(13, 0)
  ihdr.write('IHDR', 4)
  ihdr.writeUInt32BE(width, 8)
  ihdr.writeUInt32BE(height, 12)
  ihdr[16] = 8
  ihdr[17] = 6
  return Buffer.concat([header, ihdr])
}

const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"></svg>')

const upload = (buffer: Buffer, originalname = 'slika.png') =>
  storeUpload({ buffer, originalname, size: buffer.byteLength })

afterEach(() => {
  vi.clearAllMocks()
})

describe('prepoznavanje tipa', () => {
  it('prihvata PNG i čita dimenzije iz zaglavlja', async () => {
    const stored = await upload(png(800, 600))

    expect(stored.mimeType).toBe('image/png')
    expect(stored).toMatchObject({ width: 800, height: 600 })
  })

  it('prihvata SVG — logotipi tehnologija su vektorski', async () => {
    const stored = await upload(svg, 'react.svg')

    expect(stored.mimeType).toBe('image/svg+xml')
    expect(stored.storageKey.endsWith('.svg')).toBe(true)
  })

  /*
   * Tip se čita iz MAGIČNIH BAJTOVA, ne iz imena ni iz `mimetype`.
   *
   * `mimetype` bira klijent; preimenovan izvršni fajl u `.png` prošao bi bez ove provere.
   */
  it('odbija fajl koji nije slika, ma kako se zvao', async () => {
    await expect(upload(Buffer.from('MZ\x90\x00ovo je exe'), 'slika.png')).rejects.toMatchObject({
      status: 415,
      messageKey: 'uploads.errors.unsupportedType',
    })
  })

  it('odbija prazan fajl', async () => {
    await expect(upload(Buffer.alloc(0))).rejects.toMatchObject({ status: 415 })
  })

  it('ne piše na disk kad odbije', async () => {
    await expect(upload(Buffer.from('nije slika'))).rejects.toThrow()

    expect(writeFile).not.toHaveBeenCalled()
  })
})

describe('granica veličine', () => {
  it('odbija fajl preko granice sa 413', async () => {
    const big = png(10, 10)

    await expect(
      storeUpload({ buffer: big, originalname: 'velika.png', size: 50 * 1024 * 1024 }),
    ).rejects.toMatchObject({ status: 413, messageKey: 'uploads.errors.tooLarge' })
  })
})

describe('ime na disku', () => {
  /* Klijentsko ime nikad ne sme da učestvuje u putanji — inače je `../../etc` validan unos. */
  it('ime je nasumično, bez traga originalnog', async () => {
    const stored = await upload(png(10, 10), '../../../etc/passwd.png')

    expect(stored.storageKey).toMatch(/^[0-9a-f-]{36}\.png$/)
    expect(stored.storageKey).not.toContain('passwd')
    expect(stored.storageKey).not.toContain('..')
  })

  it('originalno ime se čuva sanitizovano, samo za prikaz', async () => {
    const stored = await upload(png(10, 10), '../moja slika!!.png')

    expect(stored.label).not.toContain('/')
    expect(stored.label).toContain('moja slika')
  })

  it('ime bez upotrebljivih znakova dobija zamenu', async () => {
    const stored = await upload(png(10, 10), '???')

    expect(stored.label).toBe('bez-imena')
  })

  it('dva otpremanja istog fajla daju različita imena', async () => {
    const a = await upload(png(10, 10))
    const b = await upload(png(10, 10))

    expect(a.storageKey).not.toBe(b.storageKey)
  })
})

describe('publicUrl', () => {
  it('sastavlja putanju do datoteke', () => {
    expect(publicUrl('abc.png')).toBe('/uploads/abc.png')
  })
})
