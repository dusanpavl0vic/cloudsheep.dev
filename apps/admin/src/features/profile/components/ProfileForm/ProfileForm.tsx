import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, Checkbox, FormField, Input, Label, Textarea } from '@app/ui'

import { profileSchema, type ProfileInput } from '../../schemas/profile.schema'
import type { Profile } from '../../types'

const EMPTY: ProfileInput = {
  fullName: '',
  location: '',
  isAvailable: true,
  headlineSr: '',
  headlineEn: '',
  bioSr: '',
  bioEn: '',
  universitySr: '',
  universityEn: '',
  degreeSr: '',
  degreeEn: '',
}

interface ProfileFormProps {
  profile: Profile | null
  isSaving: boolean
  onSubmit: (values: ProfileInput) => Promise<{ ok: boolean }>
}

/** Dvojezična polja stoje jedno pored drugog: ima ih osam, tabovi bi bili više klikova. */
const LOCALIZED = [
  { base: 'headline', multiline: false },
  { base: 'bio', multiline: true },
  { base: 'university', multiline: false },
  { base: 'degree', multiline: false },
] as const

export const ProfileForm = ({ profile, isSaving, onSubmit }: ProfileFormProps) => {
  const { t } = useTranslation(['profile', 'common'])
  const availableId = useId()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    // `values` usklađuje formu kad podaci stignu — bez `reset()` u efektu (docs/07 §3)
    values: profile ?? EMPTY,
  })

  const submit = handleSubmit(async (values) => {
    await onSubmit(values)
  })

  const busy = isSaving || isSubmitting

  return (
    <form
      noValidate
      onSubmit={(event) => void submit(event)}
      className="border-border bg-card flex max-w-3xl flex-col gap-5 rounded-xl border p-6"
      aria-busy={busy}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label={t('profile.form.fullName')}
          {...(errors.fullName && { error: t(errors.fullName.message ?? '') })}
        >
          {(field) => <Input {...field} {...register('fullName')} />}
        </FormField>

        <FormField
          label={t('profile.form.location')}
          description={t('profile.form.locationHint')}
          {...(errors.location && { error: t(errors.location.message ?? '') })}
        >
          {(field) => <Input {...field} {...register('location')} />}
        </FormField>
      </div>

      {LOCALIZED.map(({ base, multiline }) => (
        <div key={base} className="grid gap-5 sm:grid-cols-2">
          {(['Sr', 'En'] as const).map((locale) => {
            const name = `${base}${locale}` as keyof ProfileInput
            const error = errors[name]

            return (
              <FormField
                key={locale}
                label={`${t(`profile.form.${base}`)} (${t(`profile.locales.${locale}`)})`}
                {...(error && { error: t(error.message ?? '') })}
              >
                {(field) =>
                  multiline ? (
                    <Textarea {...field} rows={4} {...register(name)} />
                  ) : (
                    <Input {...field} {...register(name)} />
                  )
                }
              </FormField>
            )
          })}
        </div>
      ))}

      <div className="flex items-center gap-2">
        <Checkbox id={availableId} {...register('isAvailable')} />
        <Label htmlFor={availableId} className="mb-0">
          {t('profile.form.isAvailable')}
        </Label>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? t('common:common.loading') : t('common:common.save')}
        </Button>
        {isSubmitSuccessful && !busy && (
          // Potvrda bez `useState` — RHF već zna da je poslednji submit uspeo
          <span role="status" className="text-success text-[14.5px]">
            {t('profile.saved')}
          </span>
        )}
      </div>
    </form>
  )
}
