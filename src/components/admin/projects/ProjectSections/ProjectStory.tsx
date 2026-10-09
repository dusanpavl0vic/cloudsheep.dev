'use client'

import { useTranslations } from 'next-intl'

import FormGrid from '@/components/admin/FormGrid'
import Panel from '@/components/admin/Panel'
import Chip from '@/components/buttons/Chip'
import TextField from '@/components/inputs/TextField'
import type { ProjectEditorApi } from '@/hooks/admin/projects'
import { useKeyTranslator } from '@/hooks/useApiErrorMessage'

import { Chips } from './ProjectSections.styles'

const SHORT = ['roleEn', 'roleSr', 'timelineEn', 'timelineSr', 'captionEn', 'captionSr'] as const

/** Opis, uloga, trajanje i potpis — tekst studije slučaja. */
export const ProjectStory = ({ api }: { api: ProjectEditorApi }) => {
  const t = useTranslations('admin.projects')
  const translate = useKeyTranslator()
  const { register } = api.form

  return (
    <Panel title={t('sections.story')}>
      <FormGrid>
        <TextField id="pr-desc-en" multiline rows={4} label={t('descEn')} error={translate(api.errors.descEn?.message)} {...register('descEn')} />
        <TextField id="pr-desc-sr" multiline rows={4} label={t('descSr')} error={translate(api.errors.descSr?.message)} {...register('descSr')} />
        {SHORT.map((field) => (
          <TextField key={field} id={`pr-${field}`} label={t(field)} error={translate(api.errors[field]?.message)} {...register(field)} />
        ))}
      </FormGrid>
    </Panel>
  )
}

/** Tehnologije projekta — biraju se iz spiska (Tehnologije), ne kucaju. */
export const ProjectStack = ({ api }: { api: ProjectEditorApi }) => {
  const t = useTranslations('admin.projects')
  return (
    <Panel title={t('sections.stack')}>
      <Chips>
        {api.technologies.map((technology) => (
          <Chip
            key={technology.id}
            role="checkbox"
            selected={technology.selected}
            onClick={() => {
              api.toggleTechnology(technology.id)
            }}
          >
            {technology.label}
          </Chip>
        ))}
      </Chips>
    </Panel>
  )
}
