'use client'

import { useLocale } from 'next-intl'
import { useTransition } from 'react'

import { LOCALES, type Locale } from '@/constants/i18n'
import { usePathname, useRouter } from '@/i18n/navigation'

/**
 * Promena jezika na ISTOJ stranici: `/projects/booksphere` → `/sr/projects/booksphere`. Slug je
 * isti na oba jezika, pa putanja ostaje važeća. Filter (`?category=`) i sidro (`#pricing`) idu
 * sa njom — čitaju se u trenutku klika, ne pri renderu.
 */
export const useLocaleSwitch = () => {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const switchTo = (next: Locale) => {
    if (next === locale) return
    const { search, hash } = window.location
    startTransition(() => {
      router.replace(`${pathname}${search}${hash}`, { locale: next, scroll: false })
    })
  }

  return { locale, locales: LOCALES, switchTo, isPending }
}
