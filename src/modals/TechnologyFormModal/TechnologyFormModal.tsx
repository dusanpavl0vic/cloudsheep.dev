'use client'

import { useTranslations } from 'next-intl'

import FormDialog from '@/components/admin/FormDialog'
import ImageField from '@/components/admin/ImageField'
import TextField from '@/components/inputs/TextField'
import { useTechnologyForm } from '@/hooks/admin/technologies'
import { useKeyTranslator } from '@/hooks/useApiErrorMessage'
import { TECHNOLOGY_GROUPS } from '@/types/technology'

import type { OverlayModalProps } from '../shared/types'

/** Dodavanje/izmena tehnologije (`props.id` — izmena). */
const TechnologyFormModal = ({ props, onClose }: OverlayModalProps<{ id?: string }>) => {
  const t = useTranslations('admin.technologies')
  const translate = useKeyTranslator()
  const { form, errors, submit, isSubmitting, isEdit, logoUrl, setLogo } = useTechnologyForm(props.id, onClose)

  return (
    <FormDialog title={t(isEdit ? 'editTitle' : 'addTitle')} onClose={onClose} onSubmit={(event) => void submit(event)} isSaving={isSubmitting}>
      <TextField id="tech-label" label={t('label')} error={translate(errors.label?.message)} {...form.register('label')} />
      <TextField id="tech-slug" label={t('slug')} hint={t('slugHint')} error={translate(errors.slug?.message)} {...form.register('slug')} />
      <TextField
        id="tech-group"
        label={t('group')}
        options={TECHNOLOGY_GROUPS.map((group) => ({ value: group, label: t(`groups.${group}`) }))}
        {...form.register('group')}
      />
      <ImageField label={t('logo')} url={logoUrl} onChange={setLogo} />
    </FormDialog>
  )
}

export default TechnologyFormModal
