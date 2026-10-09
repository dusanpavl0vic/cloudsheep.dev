'use client'

import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import type { ParsedApiError } from '@/helpers/apiError'
import type { BriefInput } from '@/schemas/contact'
import { useCheckEmailMutation } from '@/store/api/contact'

/**
 * Provera adrese na blur (ADR 0013): server proverava MX, privremene servise i greške u kucanju.
 * Greška ide na polje `email`; za grešku u kucanju nudi ispravku ili „zadrži kako sam upisao".
 */
export const useEmailCheck = (form: UseFormReturn<BriefInput>) => {
  const [checkEmail, { isLoading }] = useCheckEmailMutation()
  const [suggestion, setSuggestion] = useState<string | null>(null)

  const check = async (email: string) => {
    if (!email || form.getFieldState('email').invalid) return
    try {
      const result = await checkEmail({ email, allowTypo: Boolean(form.getValues('allowTypo')) }).unwrap()
      if (result.ok) {
        setSuggestion(null)
        return
      }
      setSuggestion(result.suggestion)
      form.setError('email', { type: 'server', message: `email.errors.${result.reason}` })
    } catch {
      // Provera je pomoć, ne kapija: pad provere ne blokira formu — server proverava i pri slanju.
    }
  }

  return {
    check,
    isChecking: isLoading,
    suggestion,
    /** Prihvati predlog (`gmial.com` → `gmail.com`). */
    applySuggestion: () => {
      if (!suggestion) return
      form.setValue('email', suggestion, { shouldValidate: true })
      form.clearErrors('email')
      setSuggestion(null)
    },
    /** Posetilac tvrdi da je adresa tačna — server preskače samo proveru kucanja. */
    keepAsTyped: () => {
      form.setValue('allowTypo', true)
      form.clearErrors('email')
      setSuggestion(null)
    },
    /** Greška polja `email` iz odgovora na slanje (422). */
    fromApiError: (error: ParsedApiError) => {
      setSuggestion(error.suggestion)
      form.setError('email', { type: 'server', message: error.messageKey })
    },
  }
}
