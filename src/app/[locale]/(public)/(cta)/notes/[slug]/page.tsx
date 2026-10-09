import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import NoteView from '@/components/notes/NoteView'
import JsonLd from '@/components/seo/JsonLd'
import { BRAND } from '@/constants/brand'
import type { Locale } from '@/constants/i18n'
import { noteHref, ROUTES } from '@/constants/routes'
import { breadcrumbJsonLd, buildPageMetadata, notePostingJsonLd } from '@/helpers/seo'
import { bindRequestLocale } from '@/i18n/locale'
import { cspNonce } from '@/server/request'
import { getPublishedNote, listPublishedNotes } from '@/server/services/notes'

interface NotePageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

/** Koliko drugih beleški ide na kraj stranice. */
const OTHER_NOTES = 3

export const generateMetadata = async ({ params }: NotePageProps): Promise<Metadata> => {
  const { locale, slug } = await params
  const note = await getPublishedNote(slug, locale)
  if (!note) return {}
  const t = await getTranslations({ locale, namespace: 'meta.note' })
  return buildPageMetadata({
    locale,
    path: noteHref(slug),
    title: t('title', { title: note.title }),
    description: note.excerpt,
    image: note.cover ? { url: note.cover.url, width: note.cover.width, height: note.cover.height, alt: note.cover.alt || note.title } : null,
    type: 'article',
    publishedTime: note.publishedAt,
  })
}

const NotePage = async ({ params }: NotePageProps) => {
  const { locale, slug } = await params
  bindRequestLocale(locale)
  const [note, notes, nonce, t] = await Promise.all([
    getPublishedNote(slug, locale),
    listPublishedNotes(locale),
    cspNonce(),
    getTranslations({ locale, namespace: 'nav' }),
  ])
  if (!note) notFound()

  const path = noteHref(slug)
  return (
    <>
      <JsonLd
        nonce={nonce}
        data={notePostingJsonLd({
          locale,
          path,
          title: note.title,
          description: note.excerpt,
          publishedAt: note.publishedAt,
          updatedAt: note.updatedAt,
          image: note.cover?.url ?? null,
          keywords: note.tags,
          studio: BRAND.name,
        })}
      />
      <JsonLd
        nonce={nonce}
        data={breadcrumbJsonLd(locale, [
          { name: BRAND.name, path: ROUTES.HOME },
          { name: t('notes'), path: ROUTES.NOTES },
          { name: note.title, path },
        ])}
      />
      <NoteView note={note} others={notes.filter((other) => other.slug !== slug).slice(0, OTHER_NOTES)} />
    </>
  )
}

export default NotePage
