import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import HomeView from '@/components/home/HomeView'
import type { Locale } from '@/constants/i18n'
import { ROUTES } from '@/constants/routes'
import { buildPageMetadata } from '@/helpers/seo'
import { bindRequestLocale } from '@/i18n/locale'
import { emailFrom } from '@/helpers/links'
import { getSiteProfile } from '@/server/services/profile'
import { listPublishedProjects } from '@/server/services/projects'
import { listTeam } from '@/server/services/team'
import { listTechnologies } from '@/server/services/technologies'
import { listTestimonials } from '@/server/services/testimonials'

interface HomePageProps {
  params: Promise<{ locale: Locale }>
}

export const generateMetadata = async ({ params }: HomePageProps): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.home' })
  return buildPageMetadata({ locale, path: ROUTES.HOME, title: t('title'), description: t('description') })
}

const HomePage = async ({ params }: HomePageProps) => {
  const { locale } = await params
  bindRequestLocale(locale)
  const [technologies, site, team, projects, testimonials] = await Promise.all([
    listTechnologies(),
    getSiteProfile(locale),
    listTeam(locale),
    listPublishedProjects(locale),
    listTestimonials(locale),
  ])
  return (
    <HomeView
      technologies={technologies}
      profile={site.profile}
      team={team}
      projects={projects}
      testimonials={testimonials}
      email={emailFrom(site.links)}
    />
  )
}

export default HomePage
