import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import NotesView from '@/components/notes/NotesView'
import type { Locale } from '@/constants/i18n'
import { ROUTES } from '@/constants/routes'
import { buildPageMetadata } from '@/helpers/seo'
import { bindRequestLocale } from '@/i18n/locale'
import { listPublishedNotes } from '@/server/services/notes'

interface NotesPageProps {
  params: Promise<{ locale: Locale }>
}

export const generateMetadata = async ({ params }: NotesPageProps): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.notes' })
  // Dok nema nijedne beleške, stranica je samo „uskoro" — tanak sadržaj ne ide u indeks
  const empty = (await listPublishedNotes(locale)).length === 0
  return buildPageMetadata({
    locale,
    path: ROUTES.NOTES,
    title: t('title'),
    description: t('description'),
    noindex: empty,
  })
}

const NotesPage = async ({ params }: NotesPageProps) => {
  const { locale } = await params
  bindRequestLocale(locale)
  return <NotesView notes={await listPublishedNotes(locale)} />
}

export default NotesPage
