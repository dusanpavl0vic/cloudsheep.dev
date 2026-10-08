import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import HomeView from '@/components/home/HomeView'
import type { Locale } from '@/constants/i18n'
import { bindRequestLocale } from '@/i18n/locale'
import { getSiteProfile } from '@/server/services/profile'
import { listTeam } from '@/server/services/team'
import { listTechnologies } from '@/server/services/technologies'

interface HomePageProps {
  params: Promise<{ locale: Locale }>
}

export const generateMetadata = async ({ params }: HomePageProps): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.home' })
  return { title: t('title'), description: t('description') }
}

const HomePage = async ({ params }: HomePageProps) => {
  const { locale } = await params
  bindRequestLocale(locale)
  const [technologies, site, team] = await Promise.all([listTechnologies(), getSiteProfile(locale), listTeam(locale)])
  return <HomeView technologies={technologies} profile={site.profile} team={team} />
}

export default HomePage
