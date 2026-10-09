'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale } from 'next-intl'
import { useState } from 'react'
import { useForm, useFormState, useWatch, type PathValue } from 'react-hook-form'

import { HTTP_STATUS } from '@/constants/http'
import { parseApiError } from '@/helpers/apiError'
import type { EstimateInput } from '@/helpers/estimator'
import { briefSchema, type Brief, type BriefInput } from '@/schemas/contact'
import { useSendBriefMutation } from '@/store/api/contact'

import { useEmailCheck } from './useEmailCheck'

/** Polja koja svaki korak proverava pre prelaska na sledeći. */
const STEP_FIELDS = [['projectType'], ['budget', 'timeline'], ['name', 'email', 'message']] as const satisfies readonly (keyof BriefInput)[][]
export const BRIEF_STEPS = STEP_FIELDS.length

interface BriefDefaults {
  projectType: BriefInput['projectType'] | null
  budget: BriefInput['budget'] | null
  timeline: BriefInput['timeline'] | null
  message: string
  estimate: EstimateInput | null
}

/**
 * Upit u tri koraka (dizajn): tip → budžet i rok → podaci. Vrednosti drži RHF (docs/10); korak je
 * stanje toka, ne forme. Greška sa servera ide na polje (`email`, `slotId`), ne u toast.
 */
export const useBriefForm = (defaults: BriefDefaults) => {
  const locale = useLocale()
  const [step, setStep] = useState(0)
  const [sendBrief, { isLoading }] = useSendBriefMutation()

  const form = useForm<BriefInput, unknown, Brief>({
    resolver: zodResolver(briefSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    // Neizabrano polje izostaje — šema ga odbija porukom `validation.pick` tek pri proveri koraka.
    defaultValues: {
      ...(defaults.projectType ? { projectType: defaults.projectType } : {}),
      ...(defaults.budget ? { budget: defaults.budget } : {}),
      ...(defaults.timeline ? { timeline: defaults.timeline } : {}),
      name: '',
      email: '',
      message: defaults.message,
      slotId: null,
      estimate: defaults.estimate
        ? { ...defaults.estimate, platforms: [...defaults.estimate.platforms], features: [...defaults.estimate.features] }
        : null,
      locale,
      allowTypo: false,
      website: '',
    },
  })
  const email = useEmailCheck(form)
  const isDone = step >= BRIEF_STEPS
  const values = useWatch({ control: form.control })
  // `form.formState` je proxy koji se menja iznutra — React Compiler bi ga memoizovao zauvek.
  // `useFormState` vraća nov objekat na svaku promenu (docs/10).
  const { errors } = useFormState({ control: form.control })

  /** Izbor opcije (tip, budžet, rok, termin): upis + provera polja, bez dodira inputa. */
  const choose = <K extends 'projectType' | 'budget' | 'timeline' | 'slotId'>(field: K, value: PathValue<BriefInput, K>) => {
    form.setValue(field, value, { shouldValidate: true })
  }

  const next = async () => {
    const fields = STEP_FIELDS[step]
    if (fields && (await form.trigger(fields))) setStep(step + 1)
  }

  const submit = form.handleSubmit(async (values) => {
    try {
      await sendBrief(values).unwrap()
      setStep(BRIEF_STEPS)
    } catch (caught) {
      const error = parseApiError(caught)
      if (error.field === 'email') email.fromApiError(error)
      else if (error.status === HTTP_STATUS.CONFLICT) {
        form.setValue('slotId', null)
        form.setError('slotId', { type: 'server', message: error.messageKey })
      } else form.setError('root', { type: 'server', message: error.messageKey })
    }
  })

  return {
    form,
    values,
    errors,
    choose,
    email,
    step,
    isDone,
    isLast: step === BRIEF_STEPS - 1,
    isSending: isLoading,
    next,
    back: () => {
      setStep((current) => Math.max(0, current - 1))
    },
    submit,
  }
}
