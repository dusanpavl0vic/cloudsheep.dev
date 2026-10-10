'use client'

import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useTransition } from 'react'

import { LOCALES, type Locale } from '@/constants/i18n'
import { saveAdminLocaleCookie } from '@/store/persistence/preferencesStorage'

/** Jezik admin-a: kolačić + `router.refresh()` — server ponovo renderuje sa novim porukama. */
export const useAdminLocale = () => {
  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return {
    locale,
    locales: LOCALES,
    isPending,
    switchTo: (next: Locale) => {
      if (next === locale) return
      saveAdminLocaleCookie(next)
      startTransition(() => {
        router.refresh()
      })
    },
  }
}
