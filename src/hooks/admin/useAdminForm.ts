'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm, useFormState, type DefaultValues, type FieldErrors, type FieldValues, type Path } from 'react-hook-form'
import type { z } from 'zod'

import { parseApiError } from '@/helpers/apiError'

import { useApiErrorMessage } from '../useApiErrorMessage'
import { useToast } from '../useToast'

interface AdminFormOptions<In extends FieldValues, Out> {
  schema: z.ZodType<Out, In>
  defaultValues: DefaultValues<In>
  save: (values: Out) => Promise<unknown>
  /** Posle uspešnog čuvanja (zatvaranje dijaloga, povratak na listu). */
  onSaved?: () => void
  /** Validacija pala — npr. prebaci na karticu sa poljem koje nije prikazano. */
  onInvalid?: (errors: FieldErrors<In>) => void
}

/**
 * Admin forma: RHF + ista zod šema kao na serveru. Greška polja sa servera (validacija, zauzet
 * slug) ide na to polje; ostale greške u toast. Uspeh → „Sačuvano.".
 */
export const useAdminForm = <In extends FieldValues, Out>({ schema, defaultValues, save, onSaved, onInvalid }: AdminFormOptions<In, Out>) => {
  const t = useTranslations('admin.common')
  const toast = useToast()
  const errorMessage = useApiErrorMessage()
  const form = useForm<In, unknown, Out>({ resolver: zodResolver(schema), defaultValues, mode: 'onTouched' })
  // React Compiler memoizuje `form.formState` — stanje samo kroz useFormState (docs/10).
  const { errors, isSubmitting, isDirty } = useFormState({ control: form.control })

  const submit = form.handleSubmit(async (values) => {
    try {
      await save(values)
      toast.show(t('saved'), 'success')
      form.reset(form.getValues())
      onSaved?.()
    } catch (caught) {
      const error = parseApiError(caught)
      if (error.field) form.setError(error.field as Path<In>, { type: 'server', message: error.messageKey }, { shouldFocus: true })
      toast.show(errorMessage(error) ?? t('loadFailed'), 'danger')
    }
  }, onInvalid)

  return { form, errors, submit, isSubmitting, isDirty }
}
