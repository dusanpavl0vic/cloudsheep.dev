import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import ProjectView from '@/components/projects/ProjectView'
import JsonLd from '@/components/seo/JsonLd'
import { BRAND } from '@/constants/brand'
import type { Locale } from '@/constants/i18n'
import { projectHref, ROUTES } from '@/constants/routes'
import { breadcrumbJsonLd, buildPageMetadata, projectJsonLd } from '@/helpers/seo'
import { bindRequestLocale } from '@/i18n/locale'
import { cspNonce } from '@/server/request'
import { getPublishedProject } from '@/server/services/projects'

interface ProjectPageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

export const generateMetadata = async ({ params }: ProjectPageProps): Promise<Metadata> => {
  const { locale, slug } = await params
  const project = await getPublishedProject(slug, locale)
  if (!project) return {}
  const t = await getTranslations({ locale, namespace: 'meta.project' })
  return buildPageMetadata({
    locale,
    path: projectHref(slug),
    title: t('title', { name: project.title }),
    description: project.description,
    image: project.cover ? { url: project.cover.url, width: project.cover.width, height: project.cover.height, alt: project.cover.alt || project.title } : null,
    type: 'article',
  })
}

const ProjectPage = async ({ params }: ProjectPageProps) => {
  const { locale, slug } = await params
  bindRequestLocale(locale)
  const [project, nonce, t] = await Promise.all([getPublishedProject(slug, locale), cspNonce(), getTranslations({ locale, namespace: 'nav' })])
  if (!project) notFound()

  const path = projectHref(slug)
  return (
    <>
      <JsonLd
        nonce={nonce}
        data={projectJsonLd({
          locale,
          path,
          title: project.title,
          description: project.description,
          year: project.year,
          image: project.cover?.url ?? null,
          keywords: project.technologies.map((tech) => tech.label),
          studio: BRAND.name,
        })}
      />
      <JsonLd
        nonce={nonce}
        data={breadcrumbJsonLd(locale, [
          { name: BRAND.name, path: ROUTES.HOME },
          { name: t('work'), path: ROUTES.PROJECTS },
          { name: project.title, path },
        ])}
      />
      <ProjectView project={project} />
    </>
  )
}

export default ProjectPage
