'use client'

import { useTranslations } from 'next-intl'

import FormDialog from '@/components/admin/FormDialog'
import ImageField from '@/components/admin/ImageField'
import CheckboxField from '@/components/inputs/CheckboxField'
import TextField from '@/components/inputs/TextField'
import { useTestimonialForm } from '@/hooks/admin/testimonials'
import { useKeyTranslator } from '@/hooks/useApiErrorMessage'

import type { OverlayModalProps } from '../shared/types'

/** Prazan izbor u `<select>`-u je „bez projekta" → `null`. */
const emptyToNull = (value: string) => value || null

/** Dodavanje/izmena utiska (`props.id` — izmena). */
const TestimonialFormModal = ({ props, onClose }: OverlayModalProps<{ id?: string }>) => {
  const t = useTranslations('admin.testimonials')
  const translate = useKeyTranslator()
  const { form, errors, submit, isSubmitting, isEdit, projects, avatarUrl, setAvatar } = useTestimonialForm(props.id, onClose)
  const { register } = form

  return (
    <FormDialog title={t(isEdit ? 'editTitle' : 'addTitle')} onClose={onClose} onSubmit={(event) => void submit(event)} isSaving={isSubmitting}>
      <div data-wide>
        <TextField id="t-quote-en" multiline rows={3} label={t('quoteEn')} error={translate(errors.quoteEn?.message)} {...register('quoteEn')} />
      </div>
      <div data-wide>
        <TextField id="t-quote-sr" multiline rows={3} label={t('quoteSr')} error={translate(errors.quoteSr?.message)} {...register('quoteSr')} />
      </div>
      <TextField id="t-author" label={t('author')} error={translate(errors.authorName?.message)} {...register('authorName')} />
      <TextField id="t-company" label={t('company')} error={translate(errors.company?.message)} {...register('company')} />
      <TextField id="t-role-en" label={t('roleEn')} error={translate(errors.authorRoleEn?.message)} {...register('authorRoleEn')} />
      <TextField id="t-role-sr" label={t('roleSr')} error={translate(errors.authorRoleSr?.message)} {...register('authorRoleSr')} />
      <TextField
        id="t-project"
        label={t('project')}
        options={[{ value: '', label: t('noProject') }, ...projects]}
        {...register('projectId', { setValueAs: emptyToNull })}
      />
      <ImageField label={t('avatar')} url={avatarUrl} onChange={setAvatar} round />
      <div data-wide>
        <CheckboxField label={t('publish')} {...register('isPublished')} />
      </div>
    </FormDialog>
  )
}

export default TestimonialFormModal
