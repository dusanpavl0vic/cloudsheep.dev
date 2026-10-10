import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import Document from '@/components/layout/Document'
import RootLayout from '@/components/layout/RootLayout'
import { BRAND } from '@/constants/brand'
import { THEME_COOKIE } from '@/constants/cookies'
import { SITE_URL } from '@/constants/env'
import { OG_LOCALES } from '@/constants/i18n'
import { isThemeMode } from '@/constants/preferences'
import { PALETTE } from '@/constants/theme'
import { bindRequestLocale } from '@/i18n/locale'
import { routing } from '@/i18n/routing'

interface LocaleLayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export const generateMetadata = async ({ params }: LocaleLayoutProps): Promise<Metadata> => {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: t('siteName'),
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      ],
      apple: '/apple-touch-icon.png',
    },
    // Velika sličica i pun isečak u Google rezultatu; `noindex` stranice ovo pregaze svojim robots-om
    robots: {
      googleBot: { 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
    openGraph: {
      type: 'website',
      siteName: t('siteName'),
      locale: OG_LOCALES[locale],
      images: [{ url: BRAND.ogImage, width: 1200, height: 630, alt: t('ogAlt') }],
    },
    twitter: { card: 'summary_large_image' },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: PALETTE.light.bg },
    { media: '(prefers-color-scheme: dark)', color: PALETTE.dark.bg },
  ],
}

/** Javni sajt na jeziku iz URL-a. Nepoznat jezik je 404, ne podrazumevani. */
const LocaleLayout = async ({ children, params }: LocaleLayoutProps) => {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  bindRequestLocale(locale)

  const themeCookie = (await cookies()).get(THEME_COOKIE)?.value

  return (
    <Document locale={locale} theme={isThemeMode(themeCookie) ? themeCookie : null}>
      <RootLayout>{children}</RootLayout>
    </Document>
  )
}

export default LocaleLayout
