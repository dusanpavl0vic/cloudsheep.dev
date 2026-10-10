'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm, useFormState, useWatch } from 'react-hook-form'

import { BOOKING_TIME_ZONE } from '@/constants/booking'
import { addDays, dayInZone } from '@/helpers/date'
import { slotGeneratorFormSchema, toGenerateSlotsInput, type SlotGeneratorForm } from '@/schemas/booking'
import { useGenerateSlotsMutation } from '@/store/api/admin/booking'

import { useToast } from '../../useToast'
import { useAdminAction } from '../useAdminAction'

const WORKDAYS = [1, 2, 3, 4, 5]
const DEFAULT_TIMES = '10:00, 14:00, 16:00'
const DEFAULT_SPAN_DAYS = 14

/** Generator termina: od–do × dani × satnice. Postojeći termini se preskaču (server). */
export const useSlotGenerator = () => {
  const t = useTranslations('admin.booking.generator')
  const toast = useToast()
  const { run } = useAdminAction()
  const [generate, { isLoading }] = useGenerateSlotsMutation()
  const today = dayInZone(new Date(), BOOKING_TIME_ZONE)
  const form = useForm<SlotGeneratorForm>({
    resolver: zodResolver(slotGeneratorFormSchema),
    defaultValues: { from: today, to: addDays(today, DEFAULT_SPAN_DAYS), weekdays: WORKDAYS, times: DEFAULT_TIMES },
  })
  // React Compiler memoizuje `form.formState` — greške samo kroz useFormState (docs/10).
  const { errors } = useFormState({ control: form.control })
  // `useWatch`, ne `form.watch`: Compiler bi memoizovao rezultat `watch` poziva.
  const weekdays = useWatch({ control: form.control, name: 'weekdays' })

  return {
    form,
    errors,
    weekdays,
    isSubmitting: isLoading,
    toggleWeekday: (day: number) => {
      const next = weekdays.includes(day) ? weekdays.filter((d) => d !== day) : [...weekdays, day].sort()
      form.setValue('weekdays', next, { shouldValidate: form.getFieldState('weekdays').isTouched || Boolean(errors.weekdays) })
    },
    submit: form.handleSubmit(async (values) => {
      const result = await run(() => generate(toGenerateSlotsInput(values)).unwrap())
      if (result) toast.show(t('created', { count: result.created }), 'success')
    }),
  }
}
