import 'server-only'

import type { Asset, Note, Prisma } from '@prisma/client'
import type { z } from 'zod'

import { CACHE_TAGS } from '@/constants/cache'
import type { Locale } from '@/constants/i18n'
import { WORDS_PER_MINUTE } from '@/constants/notes'
import { pickLocalized } from '@/helpers/locale'
import { countWords, renderMarkdown } from '@/helpers/markdown'
import type { noteSchema, updateNoteSchema } from '@/schemas/note'
import type { AdminNote, NoteDetail, NoteSummary } from '@/types/note'

import { cached, invalidate } from '../cache'
import { prisma } from '../db'
import { publicUrl } from '../uploads/storage'

type NoteWithCover = Note & { cover: Asset | null }

const readMinutes = (body: string) => Math.max(1, Math.round(countWords(body) / WORDS_PER_MINUTE))

const summary = (n: NoteWithCover, locale: Locale): NoteSummary => {
  const title = pickLocalized(locale, n.titleSr, n.titleEn)
  return {
    id: n.id,
    slug: n.slug,
    title,
    excerpt: pickLocalized(locale, n.excerptSr, n.excerptEn),
    tags: n.tags,
    cover: n.cover
      ? {
          url: publicUrl(n.cover.storageKey),
          width: n.cover.width,
          height: n.cover.height,
          alt: title,
        }
      : null,
    publishedAt: (n.publishedAt ?? n.createdAt).toISOString(),
    readMinutes: readMinutes(pickLocalized(locale, n.bodySr, n.bodyEn)),
  }
}

const published = { isPublished: true, publishedAt: { not: null } } satisfies Prisma.NoteWhereInput

export const listPublishedNotes = cached(
  async (locale: Locale) =>
    (
      await prisma.note.findMany({
        where: published,
        orderBy: { publishedAt: 'desc' },
        include: { cover: true },
      })
    ).map((n) => summary(n, locale)),
  'notes',
  [CACHE_TAGS.NOTES],
)

/** Beleška; `null` → `notFound()`. Markdown se renderuje ovde, na serveru. */
export const getPublishedNote = cached(
  async (slug: string, locale: Locale): Promise<NoteDetail | null> => {
    const note = await prisma.note.findFirst({
      where: { ...published, slug },
      include: { cover: true },
    })
    if (!note) return null
    return {
      ...summary(note, locale),
      html: renderMarkdown(pickLocalized(locale, note.bodySr, note.bodyEn)),
      updatedAt: note.updatedAt.toISOString(),
    }
  },
  'note',
  [CACHE_TAGS.NOTES],
)

export const listNoteSlugs = cached(
  async () =>
    (await prisma.note.findMany({ where: published, select: { slug: true, updatedAt: true } })).map(
      (n) => ({
        slug: n.slug,
        updatedAt: n.updatedAt.toISOString(),
      }),
    ),
  'note-slugs',
  [CACHE_TAGS.NOTES],
)

// ─── Admin ────────────────────────────────────────────────────────────────────────

const adminNote = (n: NoteWithCover): AdminNote => ({
  id: n.id,
  slug: n.slug,
  titleSr: n.titleSr,
  titleEn: n.titleEn,
  excerptSr: n.excerptSr,
  excerptEn: n.excerptEn,
  bodySr: n.bodySr,
  bodyEn: n.bodyEn,
  tags: n.tags,
  coverId: n.coverId,
  coverUrl: n.cover ? publicUrl(n.cover.storageKey) : null,
  isPublished: n.isPublished,
  publishedAt: n.publishedAt?.toISOString() ?? null,
  updatedAt: n.updatedAt.toISOString(),
})

export const listAdminNotes = async () =>
  (await prisma.note.findMany({ orderBy: { updatedAt: 'desc' }, include: { cover: true } })).map(
    adminNote,
  )

export const getAdminNote = async (id: string) => {
  const note = await prisma.note.findUnique({ where: { id }, include: { cover: true } })
  return note ? adminNote(note) : null
}

export const createNote = async (data: z.output<typeof noteSchema>) => {
  const note = await prisma.note.create({
    data: { ...data, publishedAt: data.isPublished ? new Date() : null },
    include: { cover: true },
  })
  invalidate(CACHE_TAGS.NOTES)
  return adminNote(note)
}

/**
 * `publishedAt` se postavlja pri PRVOM objavljivanju i posle se ne menja — skrivanje i
 * ponovno objavljivanje ne sme da pomeri belešku na vrh liste kao novu.
 */
export const updateNote = async (id: string, data: z.output<typeof updateNoteSchema>) => {
  const current = await prisma.note.findUniqueOrThrow({
    where: { id },
    select: { publishedAt: true },
  })
  const note = await prisma.note.update({
    where: { id },
    data: {
      ...(data as Prisma.NoteUncheckedUpdateInput),
      ...(data.isPublished && !current.publishedAt ? { publishedAt: new Date() } : {}),
    },
    include: { cover: true },
  })
  invalidate(CACHE_TAGS.NOTES)
  return adminNote(note)
}

export const deleteNote = async (id: string) => {
  await prisma.note.delete({ where: { id } })
  invalidate(CACHE_TAGS.NOTES)
}
