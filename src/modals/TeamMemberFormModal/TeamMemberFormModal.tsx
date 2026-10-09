'use client'

import { useTranslations } from 'next-intl'

import FormDialog from '@/components/admin/FormDialog'
import ImageField from '@/components/admin/ImageField'
import CheckboxField from '@/components/inputs/CheckboxField'
import TextField from '@/components/inputs/TextField'
import { useTeamMemberForm } from '@/hooks/admin/team'
import { useKeyTranslator } from '@/hooks/useApiErrorMessage'

import type { OverlayModalProps } from '../shared/types'

const DIPLOMA_FIELDS = ['universitySr', 'universityEn', 'degreeSr', 'degreeEn', 'programmeSr', 'programmeEn', 'facultySr', 'facultyEn'] as const

/** Dodavanje/izmena člana tima (`props.id` — izmena). */
const TeamMemberFormModal = ({ props, onClose }: OverlayModalProps<{ id?: string }>) => {
  const t = useTranslations('admin.team')
  const translate = useKeyTranslator()
  const { form, errors, submit, isSubmitting, isEdit, hasDiploma, images, setAvatar, setSeal } = useTeamMemberForm(props.id, onClose)
  const { register } = form

  return (
    <FormDialog title={t(isEdit ? 'editTitle' : 'addTitle')} onClose={onClose} onSubmit={(event) => void submit(event)} isSaving={isSubmitting}>
      <div data-wide>
        <TextField id="m-name" label={t('name')} error={translate(errors.fullName?.message)} {...register('fullName')} />
      </div>
      <TextField id="m-role-en" label={t('roleEn')} error={translate(errors.roleEn?.message)} {...register('roleEn')} />
      <TextField id="m-role-sr" label={t('roleSr')} error={translate(errors.roleSr?.message)} {...register('roleSr')} />
      <ImageField label={t('avatar')} url={images.avatar} onChange={setAvatar} round />
      <div data-wide>
        <CheckboxField label={t('visible')} {...register('isVisible')} />
      </div>
      <div data-wide>
        <CheckboxField label={t('diploma')} {...register('hasDiploma')} />
      </div>
      {hasDiploma && (
        <>
          {DIPLOMA_FIELDS.map((field) => (
            <TextField key={field} id={`m-${field}`} label={t(field)} error={translate(errors[field]?.message)} {...register(field)} />
          ))}
          <TextField id="m-city" label={t('city')} error={translate(errors.city?.message)} {...register('city')} />
          <ImageField label={t('seal')} url={images.seal} onChange={setSeal} />
        </>
      )}
    </FormDialog>
  )
}

export default TeamMemberFormModal
