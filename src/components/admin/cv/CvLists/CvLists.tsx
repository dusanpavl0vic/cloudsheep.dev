'use client'

import { useTranslations } from 'next-intl'

import FormGrid from '@/components/admin/FormGrid'
import Panel from '@/components/admin/Panel'
import Button from '@/components/buttons/Button'
import TextField from '@/components/inputs/TextField'
import { useCvList, type CvFormApi } from '@/hooks/admin/team'
import { useKeyTranslator } from '@/hooks/useApiErrorMessage'

import { Item, Remove } from '../CvExperience/CvExperience.styles'

const EMPTY_LANGUAGE = { nameSr: '', nameEn: '', levelSr: '', levelEn: '' }
const LANGUAGE_FIELDS = ['nameEn', 'nameSr', 'levelEn', 'levelSr'] as const

/** Projekti sa sajta koji ulaze u CV, sa napomenom o ulozi. */
export const CvProjects = ({ api }: { api: CvFormApi }) => {
  const t = useTranslations('admin.cv')
  const translate = useKeyTranslator()
  const list = useCvList(api, 'siteProjects', { projectId: api.projects[0]?.value ?? '', noteSr: '', noteEn: '' })
  const { register } = api.form

  return (
    <Panel title={t('sections.projects')}>
      {list.items.map((item, index) => (
        <Item key={item.id}>
          <FormGrid>
            <div data-wide>
              <TextField
                id={`cv-sp-${String(index)}`}
                label={t('project')}
                options={api.projects}
                error={translate(api.errors.siteProjects?.[index]?.projectId?.message)}
                {...register(`siteProjects.${index}.projectId`)}
              />
            </div>
            <TextField id={`cv-sp-${String(index)}-en`} label={t('noteEn')} {...register(`siteProjects.${index}.noteEn`)} />
            <TextField id={`cv-sp-${String(index)}-sr`} label={t('noteSr')} {...register(`siteProjects.${index}.noteSr`)} />
          </FormGrid>
          <Remove>
            <Button variant="ghost" size="s" iconLeft="trash" onClick={() => { list.remove(index) }}>
              {t('removeItem')}
            </Button>
          </Remove>
        </Item>
      ))}
      <div>
        <Button variant="secondary" size="s" iconLeft="plus" disabled={api.projects.length === 0} onClick={list.add}>
          {t('addProject')}
        </Button>
      </div>
    </Panel>
  )
}

/** Jezici i nivo, na oba jezika. */
export const CvLanguages = ({ api }: { api: CvFormApi }) => {
  const t = useTranslations('admin.cv')
  const translate = useKeyTranslator()
  const list = useCvList(api, 'languages', EMPTY_LANGUAGE)
  const { register } = api.form

  return (
    <Panel title={t('sections.languages')}>
      {list.items.map((item, index) => (
        <Item key={item.id}>
          <FormGrid>
            {LANGUAGE_FIELDS.map((field) => (
              <TextField
                key={field}
                id={`cv-lang-${String(index)}-${field}`}
                label={t(field)}
                error={translate(api.errors.languages?.[index]?.[field]?.message)}
                {...register(`languages.${index}.${field}`)}
              />
            ))}
          </FormGrid>
          <Remove>
            <Button variant="ghost" size="s" iconLeft="trash" onClick={() => { list.remove(index) }}>
              {t('removeItem')}
            </Button>
          </Remove>
        </Item>
      ))}
      <div>
        <Button variant="secondary" size="s" iconLeft="plus" onClick={list.add}>
          {t('addLanguage')}
        </Button>
      </div>
    </Panel>
  )
}
