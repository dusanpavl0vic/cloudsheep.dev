'use client'

import { useTranslations } from 'next-intl'

import FormGrid from '@/components/admin/FormGrid'
import Panel from '@/components/admin/Panel'
import Button from '@/components/buttons/Button'
import CheckboxField from '@/components/inputs/CheckboxField'
import TextField from '@/components/inputs/TextField'
import { useProfileForm } from '@/hooks/admin/profile'
import { useKeyTranslator } from '@/hooks/useApiErrorMessage'
import type { AdminProfile } from '@/types/profile'

const PAIRS = ['headlineEn', 'headlineSr', 'universityEn', 'universitySr', 'degreeEn', 'degreeSr'] as const

/** Podaci o studiju (ime, dostupnost, naslov i biografija na oba jezika). */
const ProfileForm = ({ profile }: { profile: AdminProfile | null }) => {
  const t = useTranslations('admin')
  const translate = useKeyTranslator()
  const { form, errors, submit, isSubmitting } = useProfileForm(profile)
  const { register } = form

  return (
    <Panel title={t('nav.profile')}>
      <form noValidate onSubmit={(event) => void submit(event)}>
        <FormGrid>
          <TextField id="p-name" label={t('profile.fullName')} error={translate(errors.fullName?.message)} {...register('fullName')} />
          <TextField id="p-location" label={t('profile.location')} error={translate(errors.location?.message)} {...register('location')} />
          <div data-wide>
            <CheckboxField label={t('profile.available')} {...register('isAvailable')} />
          </div>
          {PAIRS.map((field) => (
            <TextField key={field} id={`p-${field}`} label={t(`profile.${field}`)} error={translate(errors[field]?.message)} {...register(field)} />
          ))}
          <TextField id="p-bio-en" multiline rows={6} label={t('profile.bioEn')} error={translate(errors.bioEn?.message)} {...register('bioEn')} />
          <TextField id="p-bio-sr" multiline rows={6} label={t('profile.bioSr')} error={translate(errors.bioSr?.message)} {...register('bioSr')} />
          <div data-wide>
            <Button type="submit" loading={isSubmitting}>
              {t('common.save')}
            </Button>
          </div>
        </FormGrid>
      </form>
    </Panel>
  )
}

export default ProfileForm
