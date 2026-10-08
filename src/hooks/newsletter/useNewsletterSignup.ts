'use client'

import { useLocale } from 'next-intl'
import { useState } from 'react'

import { parseApiError, type ParsedApiError } from '@/helpers/apiError'
import { useSubscribeMutation } from '@/store/api/newsletter'

interface SignupInput {
  email: string
  /** Honeypot vrednost (prazna kod čoveka). */
  website: string
  /** Posetilac je potvrdio adresu koja liči na grešku u kucanju. */
  allowTypo?: boolean
}

/** Prijava na newsletter iz podnožja: slanje, uspeh i greška na polju (sa predlogom ispravke). */
export const useNewsletterSignup = () => {
  const locale = useLocale()
  const [subscribe, { isLoading, isSuccess }] = useSubscribeMutation()
  const [error, setError] = useState<ParsedApiError | null>(null)

  const submit = async ({ email, website, allowTypo = false }: SignupInput) => {
    setError(null)
    try {
      await subscribe({ email, website, allowTypo, locale }).unwrap()
    } catch (caught) {
      setError(parseApiError(caught))
    }
  }

  return { submit, isSubmitting: isLoading, isDone: isSuccess, error }
}
