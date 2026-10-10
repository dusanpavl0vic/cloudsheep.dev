'use client'

import { useTranslations } from 'next-intl'

import FormGrid from '@/components/admin/FormGrid'
import Panel from '@/components/admin/Panel'
import Button from '@/components/buttons/Button'
import TextField from '@/components/inputs/TextField'
import type { ProjectEditorApi } from '@/hooks/admin/projects'
import { useKeyTranslator } from '@/hooks/useApiErrorMessage'

import { Item, Remove } from './ProjectSections.styles'

const METRIC = [
  ['value', 'metricValue'],
  ['labelEn', 'metricLabelEn'],
  ['labelSr', 'metricLabelSr'],
] as const

/** Rezultati (broj + opis) — trake brojki u studiji slučaja. */
export const ProjectMetrics = ({ api }: { api: ProjectEditorApi }) => {
  const t = useTranslations('admin.projects')
  const translate = useKeyTranslator()
  const { register } = api.form

  return (
    <Panel title={t('sections.metrics')}>
      {api.metrics.items.map((item, index) => (
        <Item key={item.id}>
          <FormGrid>
            {METRIC.map(([field, label]) => (
              <TextField
                key={field}
                id={`pr-m-${String(index)}-${field}`}
                label={t(label)}
                error={translate(api.errors.metrics?.[index]?.[field]?.message)}
                {...register(`metrics.${index}.${field}`)}
              />
            ))}
          </FormGrid>
          <Remove>
            <Button variant="ghost" size="s" iconLeft="trash" onClick={() => { api.metrics.remove(index) }}>
              {t('removeItem')}
            </Button>
          </Remove>
        </Item>
      ))}
      <div>
        <Button variant="secondary" size="s" iconLeft="plus" onClick={api.metrics.add}>
          {t('addMetric')}
        </Button>
      </div>
    </Panel>
  )
}

const CHAPTER = [
  ['titleEn', 'chapterTitleEn', false],
  ['titleSr', 'chapterTitleSr', false],
  ['bodyEn', 'chapterBodyEn', true],
  ['bodySr', 'chapterBodySr', true],
] as const

/** Poglavlja studije slučaja (izazov, rešenje, ishod…). */
export const ProjectChapters = ({ api }: { api: ProjectEditorApi }) => {
  const t = useTranslations('admin.projects')
  const translate = useKeyTranslator()
  const { register } = api.form

  return (
    <Panel title={t('sections.chapters')}>
      {api.chapters.items.map((item, index) => (
        <Item key={item.id}>
          <FormGrid>
            {CHAPTER.map(([field, label, multiline]) => (
              <TextField
                key={field}
                id={`pr-c-${String(index)}-${field}`}
                {...(multiline ? { multiline: true, rows: 5 } : {})}
                label={t(label)}
                error={translate(api.errors.chapters?.[index]?.[field]?.message)}
                {...register(`chapters.${index}.${field}`)}
              />
            ))}
          </FormGrid>
          <Remove>
            <Button variant="ghost" size="s" iconLeft="trash" onClick={() => { api.chapters.remove(index) }}>
              {t('removeItem')}
            </Button>
          </Remove>
        </Item>
      ))}
      <div>
        <Button variant="secondary" size="s" iconLeft="plus" onClick={api.chapters.add}>
          {t('addChapter')}
        </Button>
      </div>
    </Panel>
  )
}
