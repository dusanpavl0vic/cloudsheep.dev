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
  return buildPageMetadata({ locale, path: ROUTES.NOTES, title: t('title'), description: t('description') })
}

const NotesPage = async ({ params }: NotesPageProps) => {
  const { locale } = await params
  bindRequestLocale(locale)
  return <NotesView notes={await listPublishedNotes(locale)} />
}

export default NotesPage
