import type { Metadata } from 'next'

import { SITE_URL } from '@/constants/env'
import { DEFAULT_LOCALE, LOCALE_TAGS, LOCALES, OG_LOCALES, type Locale } from '@/constants/i18n'

/** `/projects` na jeziku: engleski bez prefiksa, srpski pod `/sr` (ADR 0012). */
export const localizedPath = (path: string, locale: Locale) => {
  if (locale === DEFAULT_LOCALE) return path
  return path === '/' ? `/${locale}` : `/${locale}${path}`
}

export const absoluteUrl = (path: string) => `${SITE_URL}${path}`

interface PageMetadataInput {
  locale: Locale
  /** Putanja BEZ jezika (`/projects/booksphere`). */
  path: string
  title: string
  description: string
  /** Apsolutna ili korenska adresa slike; bez nje ostaje `og.png` iz layout-a. */
  image?: { url: string; width: number; height: number; alt: string } | null
  type?: 'website' | 'article'
  publishedTime?: string
}

/**
 * Metapodaci stranice: canonical na sopstveni jezik, hreflang parovi za oba jezika i
 * `x-default` (engleski), OG/Twitter. Filtrirane varijante (`?category=`) kanonski pokazuju na
 * osnovnu stranicu — page.tsx prosleđuje putanju bez query-ja.
 */
export const buildPageMetadata = ({ locale, path, title, description, image, type = 'website', publishedTime }: PageMetadataInput): Metadata => {
  const url = absoluteUrl(localizedPath(path, locale))
  const languages: Record<string, string> = {
    ...Object.fromEntries(LOCALES.map((l): [string, string] => [LOCALE_TAGS[l], absoluteUrl(localizedPath(path, l))])),
    'x-default': absoluteUrl(localizedPath(path, DEFAULT_LOCALE)),
  }

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type,
      url,
      title,
      description,
      locale: OG_LOCALES[locale],
      ...(image ? { images: [image] } : {}),
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: 'summary_large_image', title, description, ...(image ? { images: [image.url] } : {}) },
  }
}
