import type { MetadataRoute } from 'next'

import { DEFAULT_LOCALE } from '@/constants/i18n'
import { noteHref, projectHref, ROUTES } from '@/constants/routes'
import { absoluteUrl, localizedPath } from '@/helpers/seo'
import { listNoteSlugs } from '@/server/services/notes'
import { listProjectSlugs } from '@/server/services/projects'

/**
 * Renderuje se po zahtevu, ne pri build-u: inače bi se zamrznuo u trenutku deploy-a (novi
 * projekat ne bi ušao do sledećeg build-a), a CI build nema bazu. Podaci su keširani po tagu.
 */
export const dynamic = 'force-dynamic'

/**
 * Sitemap iz baze, samo engleske adrese — u pretrazi je samo engleski (ADR 0012, dopuna);
 * `/sr` stranice su `noindex`. Nov projekat ili beleška ulaze bez rebuild-a (docs/11 §2).
 */
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [projects, notes] = await Promise.all([listProjectSlugs(), listNoteSlugs()])

  const page = (path: string, lastModified?: string, priority = 0.7): MetadataRoute.Sitemap => [
    {
      url: absoluteUrl(localizedPath(path, DEFAULT_LOCALE)),
      ...(lastModified ? { lastModified } : {}),
      priority,
    },
  ]

  return [
    ...page(ROUTES.HOME, undefined, 1),
    ...page(ROUTES.PROJECTS, undefined, 0.9),
    ...page(ROUTES.NOTES, undefined, 0.8),
    ...page(ROUTES.CONTACT, undefined, 0.8),
    ...projects.flatMap((p) => page(projectHref(p.slug), p.updatedAt, 0.8)),
    ...notes.flatMap((n) => page(noteHref(n.slug), n.updatedAt, 0.6)),
  ]
}

export default sitemap
