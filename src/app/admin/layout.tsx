import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getLocale, getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import ToastContainer from '@/components/feedback/ToastContainer'
import Document from '@/components/layout/Document'
import RootLayout from '@/components/layout/RootLayout'
import { THEME_COOKIE } from '@/constants/cookies'
import type { MessagePath } from '@/constants/i18n'
import { isThemeMode } from '@/constants/preferences'
import AdminModalRoot from '@/modals/AdminModalRoot'

/** Poruke koje admin koristi u pregledaču (forme, greške sa servera, oznake iz javnog dela). */
const ADMIN_NAMESPACES = [
  'admin',
  'common',
  'errors',
  'validation',
  'theme',
  'language',
  'auth',
  'booking',
  'cv',
  'profile',
  'team',
  'technologies',
  'testimonials',
  'uploads',
  'contact',
  'email',
  'projects.categories',
  'projects.errors',
  'notes.errors',
] as const satisfies readonly MessagePath[]

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('admin.meta')
  return { title: t('title'), robots: { index: false, follow: false } }
}

/** Admin: bez jezika u URL-u (ADR 0012), jezik i tema iz kolačića, nikad u indeksu. */
const AdminLayout = async ({ children }: { children: ReactNode }) => {
  // Jezik admin-a (kolačić) bira `i18n/request.ts` — isti za layout i stranicu.
  const [locale, store] = await Promise.all([getLocale(), cookies()])
  const themeCookie = store.get(THEME_COOKIE)?.value

  return (
    <Document locale={locale} theme={isThemeMode(themeCookie) ? themeCookie : null} namespaces={ADMIN_NAMESPACES}>
      <RootLayout>
        {children}
        <AdminModalRoot />
        <ToastContainer />
      </RootLayout>
    </Document>
  )
}

export default AdminLayout
