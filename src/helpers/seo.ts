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

/** JSON-LD studija kao `ProfessionalService` (početna). */
export const studioJsonLd = ({ locale, name, description, email, sameAs, city }: {
  locale: Locale
  name: string
  description: string
  email: string | null
  sameAs: string[]
  city: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name,
  description,
  url: absoluteUrl(localizedPath('/', locale)),
  logo: absoluteUrl('/favicon.svg'),
  image: absoluteUrl('/og.png'),
  ...(email ? { email } : {}),
  address: { '@type': 'PostalAddress', addressLocality: city, addressCountry: 'RS' },
  areaServed: 'Worldwide',
  inLanguage: LOCALE_TAGS[locale],
  ...(sameAs.length > 0 ? { sameAs } : {}),
})

/** JSON-LD studije slučaja: `CreativeWork` sa autorom, godinom i tehnologijama. */
export const projectJsonLd = ({ locale, path, title, description, year, image, keywords, studio }: {
  locale: Locale
  path: string
  title: string
  description: string
  year: number
  image: string | null
  keywords: string[]
  studio: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: title,
  description,
  url: absoluteUrl(localizedPath(path, locale)),
  dateCreated: String(year),
  inLanguage: LOCALE_TAGS[locale],
  creator: { '@type': 'Organization', name: studio, url: absoluteUrl(localizedPath('/', locale)) },
  ...(image ? { image: image.startsWith('http') ? image : absoluteUrl(image) } : {}),
  ...(keywords.length > 0 ? { keywords: keywords.join(', ') } : {}),
})

/** JSON-LD putanje do stranice (Početna › Radovi › BookSphere). */
export const breadcrumbJsonLd = (locale: Locale, items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(localizedPath(item.path, locale)),
  })),
})
