import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import ProjectsView from '@/components/projects/ProjectsView'
import type { Locale } from '@/constants/i18n'
import { ROUTES } from '@/constants/routes'
import { buildPageMetadata } from '@/helpers/seo'
import { bindRequestLocale } from '@/i18n/locale'
import { listPublishedProjects } from '@/server/services/projects'
import { PROJECT_CATEGORIES, type ProjectCategory } from '@/types/project'

interface ProjectsPageProps {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ category?: string | string[] }>
}

/** Nepoznata kategorija u URL-u = svi projekti (ne 404 — filter nije zasebna stranica). */
const readCategory = (value: string | string[] | undefined): ProjectCategory | null =>
  typeof value === 'string' && PROJECT_CATEGORIES.includes(value as ProjectCategory) ? (value as ProjectCategory) : null

export const generateMetadata = async ({ params }: ProjectsPageProps): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.projects' })
  // Canonical je uvek `/projects` — filtrirana lista nije zaseban dokument za Google.
  return buildPageMetadata({ locale, path: ROUTES.PROJECTS, title: t('title'), description: t('description') })
}

const ProjectsPage = async ({ params, searchParams }: ProjectsPageProps) => {
  const { locale } = await params
  bindRequestLocale(locale)
  const [projects, { category }] = await Promise.all([listPublishedProjects(locale), searchParams])
  return <ProjectsView projects={projects} category={readCategory(category)} />
}

export default ProjectsPage
