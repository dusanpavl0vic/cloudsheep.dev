import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import HomeView from '@/components/home/HomeView'
import type { Locale } from '@/constants/i18n'
import { bindRequestLocale } from '@/i18n/locale'

interface HomePageProps {
  params: Promise<{ locale: Locale }>
}

export const generateMetadata = async ({ params }: HomePageProps): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.home' })
  return { title: t('title'), description: t('description') }
}

const HomePage = async ({ params }: HomePageProps) => {
  bindRequestLocale((await params).locale)
  return <HomeView />
}

export default HomePage
