'use client'

import { useTranslations } from 'next-intl'

import FormDialog from '@/components/admin/FormDialog'
import CheckboxField from '@/components/inputs/CheckboxField'
import TextField from '@/components/inputs/TextField'
import { useSocialLinkForm } from '@/hooks/admin/profile'
import { useKeyTranslator } from '@/hooks/useApiErrorMessage'

import type { OverlayModalProps } from '../shared/types'

/** Dodavanje/izmena kontakt linka (`props.id` — izmena). */
const SocialLinkFormModal = ({ props, onClose }: OverlayModalProps<{ id?: string }>) => {
  const t = useTranslations('admin')
  const translate = useKeyTranslator()
  const { form, errors, submit, isSubmitting, isEdit } = useSocialLinkForm(props.id, onClose)
  const { register } = form

  return (
    <FormDialog title={t(isEdit ? 'profile.editLinkTitle' : 'profile.addLinkTitle')} onClose={onClose} onSubmit={(event) => void submit(event)} isSaving={isSubmitting}>
      <TextField id="link-label" label={t('profile.label')} error={translate(errors.label?.message)} {...register('label')} />
      <TextField id="link-platform" label={t('profile.platform')} hint={t('profile.platformHint')} error={translate(errors.platform?.message)} {...register('platform')} />
      <div data-wide>
        <TextField id="link-url" label={t('profile.url')} hint={t('profile.urlHint')} error={translate(errors.url?.message)} {...register('url')} />
      </div>
      <div data-wide>
        <CheckboxField label={t('common.visible')} {...register('isVisible')} />
      </div>
    </FormDialog>
  )
}

export default SocialLinkFormModal
