import imageSize from 'image-size'
import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { env } from '../env.ts'
import { HttpError } from '../middleware/error.ts'

/**
 * Dozvoljeni tipovi, prepoznati po MAGIČNIM BAJTOVIMA — ne po `file.mimetype`.
 *
 * `mimetype` bira klijent i može reći šta god; preimenovan `.exe` u `.png` prošao bi bez
 * problema. Zaglavlje fajla ne laže.
 */
const SIGNATURES: { ext: string; mime: string; test: (b: Buffer) => boolean }[] = [
  { ext: 'jpg', mime: 'image/jpeg', test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    ext: 'png',
    mime: 'image/png',
    test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  {
    ext: 'webp',
    mime: 'image/webp',
    test: (b) =>
      b.subarray(0, 4).toString('ascii') === 'RIFF' &&
      b.subarray(8, 12).toString('ascii') === 'WEBP',
  },
  {
    ext: 'avif',
    mime: 'image/avif',
    test: (b) =>
      b.subarray(4, 8).toString('ascii') === 'ftyp' &&
      b.subarray(8, 12).toString('ascii').startsWith('avif'),
  },
  {
    /**
     * SVG je dozvoljen SAMO zato što su logotipi tehnologija vektorski.
     *
     * SVG je izvršni format — može da nosi `<script>`. Zato se servira uz
     * `Content-Security-Policy` koji na tom odgovoru gasi sve (`routes/uploads.ts`), i zato
     * stoji na `api.` poddomenu, odvojenom od porekla sajta.
     */
    ext: 'svg',
    mime: 'image/svg+xml',
    test: (b) => {
      const head = b.subarray(0, 512).toString('utf8').trimStart()
      return head.startsWith('<svg') || head.startsWith('<?xml')
    },
  },
]

export interface StoredFile {
  storageKey: string
  mimeType: string
  sizeBytes: number
  width: number
  height: number
  label: string
}

/** Klijentsko ime se koristi SAMO za prikaz u adminu, nikad kao putanja. */
const safeLabel = (original: string): string =>
  original
    .replace(/[^\w.\- ]/g, '')
    .trim()
    .slice(0, 80) || 'bez-imena'

export async function storeUpload(file: {
  buffer: Buffer
  originalname: string
  size: number
}): Promise<StoredFile> {
  const signature = SIGNATURES.find((s) => s.test(file.buffer))
  if (!signature) throw new HttpError(415, 'uploads.errors.unsupportedType')

  if (file.size > env.MAX_UPLOAD_BYTES) throw new HttpError(413, 'uploads.errors.tooLarge')

  let width: number | undefined
  let height: number | undefined
  try {
    ;({ width, height } = imageSize(file.buffer))
  } catch {
    throw new HttpError(415, 'uploads.errors.unreadable')
  }

  // Bez dimenzija `<img>` nema width/height i stranica poskakuje dok se slika učitava
  if (!width || !height) throw new HttpError(415, 'uploads.errors.unreadable')

  // Ime je nasumično: klijentsko nikad ne učestvuje u putanji na disku.
  const storageKey = `${randomUUID()}.${signature.ext}`

  await mkdir(env.UPLOAD_DIR, { recursive: true })
  await writeFile(path.join(env.UPLOAD_DIR, storageKey), file.buffer)

  return {
    storageKey,
    mimeType: signature.mime,
    sizeBytes: file.size,
    width,
    height,
    label: safeLabel(file.originalname),
  }
}

/** Javni URL datoteke. Prazan `PUBLIC_UPLOAD_BASE` znači relativno — radi na localhost-u. */
export const publicUrl = (storageKey: string): string =>
  `${env.PUBLIC_UPLOAD_BASE}/uploads/${storageKey}`
