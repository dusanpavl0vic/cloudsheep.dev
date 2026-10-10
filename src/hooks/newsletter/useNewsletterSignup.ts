'use client'

import { useLocale } from 'next-intl'
import { useState } from 'react'

import { API_ENDPOINTS } from '@/constants/api'
import { parseApiError, type ParsedApiError } from '@/helpers/apiError'
import { postJson } from '@/helpers/http'
import type { SubscribeInput } from '@/schemas/newsletter'

interface SignupInput {
  email: string
  /** Honeypot vrednost (prazna kod čoveka). */
  website: string
  /** Posetilac je potvrdio adresu koja liči na grešku u kucanju. */
  allowTypo?: boolean
}

type Status = 'idle' | 'sending' | 'done'

/**
 * Prijava na newsletter iz podnožja: slanje, uspeh i greška na polju (sa predlogom ispravke).
 * Kroz `postJson`, ne RTK Query — podnožje je na svakoj stranici (ADR 0014).
 */
export const useNewsletterSignup = () => {
  const locale = useLocale()
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<ParsedApiError | null>(null)

  const submit = async ({ email, website, allowTypo = false }: SignupInput) => {
    setError(null)
    setStatus('sending')
    try {
      await postJson<{ ok: true }>(API_ENDPOINTS.NEWSLETTER, { email, website, allowTypo, locale } satisfies SubscribeInput)
      setStatus('done')
    } catch (caught) {
      setError(parseApiError(caught))
      setStatus('idle')
    }
  }

  return { submit, isSubmitting: status === 'sending', isDone: status === 'done', error }
}
