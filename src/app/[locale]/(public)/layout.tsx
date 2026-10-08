import type { ReactNode } from 'react'

import PublicLayout from '@/components/layout/PublicLayout'
import type { Locale } from '@/constants/i18n'
import { bindRequestLocale } from '@/i18n/locale'
import { getSiteProfile } from '@/server/services/profile'
import { listPublishedProjects } from '@/server/services/projects'

interface PublicGroupLayoutProps {
  children: ReactNode
  params: Promise<{ locale: Locale }>
}

/** Podaci ljuske (linkovi iz profila, prva tri projekta za podnožje) — jednom po stranici, iz keša. */
const PublicGroupLayout = async ({ children, params }: PublicGroupLayoutProps) => {
  const { locale } = await params
  bindRequestLocale(locale)

  const [site, projects] = await Promise.all([getSiteProfile(locale), listPublishedProjects(locale)])

  return (
    <PublicLayout links={site.links} projects={projects.slice(0, 3).map(({ slug, title }) => ({ slug, title }))}>
      {children}
    </PublicLayout>
  )
}

export default PublicGroupLayout
