'use client'

import { useTranslations } from 'next-intl'

import FormGrid from '@/components/admin/FormGrid'
import Panel from '@/components/admin/Panel'
import CheckboxField from '@/components/inputs/CheckboxField'
import TextField from '@/components/inputs/TextField'
import type { ProjectEditorApi } from '@/hooks/admin/projects'
import { useKeyTranslator } from '@/hooks/useApiErrorMessage'
import { GALLERY_LAYOUTS, PROJECT_CATEGORIES } from '@/types/project'

const PAIRS = ['titleEn', 'titleSr', 'catEn', 'catSr'] as const

/** Naziv, adresa, kategorija, godina, linkovi i objava. */
const ProjectBasics = ({ api }: { api: ProjectEditorApi }) => {
  const t = useTranslations()
  const translate = useKeyTranslator()
  const { register } = api.form
  const label = (key: string) => t(`admin.projects.${key}` as 'admin.projects.slug')

  return (
    <Panel title={label('sections.basics')}>
      <FormGrid>
        {PAIRS.map((field) => (
          <TextField key={field} id={`pr-${field}`} label={label(field)} error={translate(api.errors[field]?.message)} {...register(field)} />
        ))}
        <TextField id="pr-slug" label={label('slug')} hint={label('slugHint')} error={translate(api.errors.slug?.message)} {...register('slug')} />
        <TextField
          id="pr-category"
          label={label('category')}
          options={PROJECT_CATEGORIES.map((value) => ({ value, label: t(`projects.categories.${value}`) }))}
          {...register('category')}
        />
        <TextField id="pr-year" type="number" label={label('year')} error={translate(api.errors.year?.message)} {...register('year')} />
        <TextField id="pr-client" label={label('client')} error={translate(api.errors.client?.message)} {...register('client')} />
        <TextField id="pr-live" type="url" label={label('liveUrl')} error={translate(api.errors.liveUrl?.message)} {...register('liveUrl')} />
        <TextField id="pr-repo" type="url" label={label('repoUrl')} error={translate(api.errors.repoUrl?.message)} {...register('repoUrl')} />
        <TextField
          id="pr-layout"
          label={label('layout')}
          options={GALLERY_LAYOUTS.map((value) => ({ value, label: label(`layouts.${value}`) }))}
          {...register('galleryLayout')}
        />
        <TextField id="pr-growth" label={label('growth')} hint={label('growthHint')} error={translate(api.errors.growth?.message)} {...register('growth')} />
        <CheckboxField label={label('published')} {...register('isPublished')} />
        <CheckboxField label={label('featured')} {...register('isFeatured')} />
      </FormGrid>
    </Panel>
  )
}

export default ProjectBasics
