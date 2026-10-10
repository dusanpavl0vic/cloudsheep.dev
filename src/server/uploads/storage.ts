import 'server-only'

import imageSize from 'image-size'
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'


import { HTTP_STATUS } from '@/constants/http'
import { UPLOADS_PATH } from '@/constants/uploads'

import { env } from '../env'
import { HttpError } from '../errors'

/**
 * Dozvoljeni tipovi, prepoznati po MAGIČNIM BAJTOVIMA — ne po tipu koji pošalje klijent.
 * Preimenovan `.exe` u `.png` ovde pada; zaglavlje fajla ne laže.
 */
const SIGNATURES: { ext: string; mime: string; test: (b: Buffer) => boolean }[] = [
  { ext: 'jpg', mime: 'image/jpeg', test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { ext: 'png', mime: 'image/png', test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  {
    ext: 'webp',
    mime: 'image/webp',
    test: (b) => b.subarray(0, 4).toString('ascii') === 'RIFF' && b.subarray(8, 12).toString('ascii') === 'WEBP',
  },
  {
    ext: 'avif',
    mime: 'image/avif',
    test: (b) => b.subarray(4, 8).toString('ascii') === 'ftyp' && b.subarray(8, 12).toString('ascii').startsWith('avif'),
  },
  {
    // SVG je dozvoljen SAMO zbog vektorskih logotipa tehnologija. Može da nosi `<script>`,
    // pa se servira uz CSP koji gasi sve (`app/uploads/[...path]/route.ts`).
    ext: 'svg',
    mime: 'image/svg+xml',
    test: (b) => {
      const head = b.subarray(0, 512).toString('utf8').trimStart()
      return head.startsWith('<svg') || head.startsWith('<?xml')
    },
  },
]

const MIME_BY_EXT = Object.fromEntries(SIGNATURES.map((s) => [s.ext, s.mime]))

export interface StoredFile {
  storageKey: string
  mimeType: string
  sizeBytes: number
  width: number
  height: number
  label: string
}

/** Klijentsko ime služi SAMO za prikaz u admin-u, nikad kao putanja. */
const safeLabel = (original: string) =>
  original
    .replace(/[^\w.\- ]/g, '')
    .trim()
    .slice(0, 80) || 'bez-imena'

export const storeUpload = async (file: { buffer: Buffer; name: string }): Promise<StoredFile> => {
  if (file.buffer.length > env().MAX_UPLOAD_BYTES) {
    throw new HttpError(HTTP_STATUS.PAYLOAD_TOO_LARGE, 'uploads.errors.tooLarge')
  }

  const signature = SIGNATURES.find((s) => s.test(file.buffer))
  if (!signature) throw new HttpError(HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE, 'uploads.errors.unsupportedType')

  let size: { width?: number; height?: number }
  try {
    size = imageSize(file.buffer)
  } catch {
    throw new HttpError(HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE, 'uploads.errors.unreadable')
  }
  // Bez dimenzija `<img>` nema width/height i stranica poskakuje (CLS)
  if (!size.width || !size.height) throw new HttpError(HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE, 'uploads.errors.unreadable')

  // Ime je nasumično: klijentsko nikad ne učestvuje u putanji na disku.
  const storageKey = `${randomUUID()}.${signature.ext}`
  await mkdir(env().UPLOAD_DIR, { recursive: true })
  // Folder otpremanja je volume u runtime-u — ne sme u build (Turbopack bi pratio ceo projekat).
  await writeFile(path.join(/* turbopackIgnore: true */ env().UPLOAD_DIR, storageKey), file.buffer)

  return {
    storageKey,
    mimeType: signature.mime,
    sizeBytes: file.buffer.length,
    width: size.width,
    height: size.height,
    label: safeLabel(file.name),
  }
}

/** Javni URL datoteke. Prazan `PUBLIC_UPLOAD_BASE` = isto poreklo (ADR 0009). */
export const publicUrl = (storageKey: string) => `${env().PUBLIC_UPLOAD_BASE}${UPLOADS_PATH}/${storageKey}`

/** Ime fajla na disku je uvek `<uuid>.<ext>` — sve drugo (`../`, podfolderi) se odbija. */
const STORAGE_KEY = /^[0-9a-f-]{36}\.(jpg|png|webp|avif|svg)$/

/** Fajl za serviranje, ili `null` ako ne postoji ili ime nije naše. */
export const readUpload = async (storageKey: string) => {
  const match = STORAGE_KEY.exec(storageKey)
  if (!match?.[1]) return null

  const file = path.join(/* turbopackIgnore: true */ env().UPLOAD_DIR, storageKey)
  try {
    const info = await stat(file)
    if (!info.isFile()) return null
    return { body: await readFile(file), mimeType: MIME_BY_EXT[match[1]] ?? 'application/octet-stream', size: info.size }
  } catch {
    return null
  }
}
