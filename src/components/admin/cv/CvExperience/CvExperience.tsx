'use client'

import { useTranslations } from 'next-intl'

import FormGrid from '@/components/admin/FormGrid'
import Panel from '@/components/admin/Panel'
import Button from '@/components/buttons/Button'
import TextField from '@/components/inputs/TextField'
import { useCvList, type CvFormApi } from '@/hooks/admin/team'
import { useKeyTranslator } from '@/hooks/useApiErrorMessage'

import { Item, Remove } from './CvExperience.styles'

const EMPTY = {
  company: '',
  positionSr: '',
  positionEn: '',
  locationSr: '',
  locationEn: '',
  startYear: new Date().getFullYear(),
  startMonth: null,
  endYear: null,
  endMonth: null,
  summarySr: '',
  summaryEn: '',
  bulletsSr: '',
  bulletsEn: '',
  technologies: '',
}

const PAIRS = [
  ['positionEn', 'positionSr'],
  ['locationEn', 'locationSr'],
] as const

/** Prazno polje → `null`; RHF šalje i podrazumevanu vrednost (`null`) kroz ovu funkciju. */
const nullableNumber = (value: unknown) => (value === '' || value === null || value === undefined ? null : Number(value))

/** Radno iskustvo: jedna grupa polja po poziciji, redosled = redosled u CV-u. */
const CvExperience = ({ api }: { api: CvFormApi }) => {
  const t = useTranslations('admin.cv')
  const translate = useKeyTranslator()
  const list = useCvList(api, 'experiences', EMPTY)
  const { register } = api.form

  return (
    <Panel title={t('sections.experience')}>
      {list.items.map((item, index) => {
        const errors = api.errors.experiences?.[index]
        const id = (field: string) => `cv-exp-${String(index)}-${field}`
        return (
          <Item key={item.id}>
            <legend>{item.company || t('company')}</legend>
            <FormGrid>
              <div data-wide>
                <TextField id={id('company')} label={t('company')} error={translate(errors?.company?.message)} {...register(`experiences.${index}.company`)} />
              </div>
              {PAIRS.flat().map((field) => (
                <TextField key={field} id={id(field)} label={t(field)} {...register(`experiences.${index}.${field}`)} />
              ))}
              <TextField id={id('startYear')} type="number" label={t('startYear')} error={translate(errors?.startYear?.message)} {...register(`experiences.${index}.startYear`, { valueAsNumber: true })} />
              <TextField id={id('startMonth')} type="number" min={1} max={12} label={t('startMonth')} {...register(`experiences.${index}.startMonth`, { setValueAs: nullableNumber })} />
              <TextField id={id('endYear')} type="number" label={t('endYear')} {...register(`experiences.${index}.endYear`, { setValueAs: nullableNumber })} />
              <TextField id={id('endMonth')} type="number" min={1} max={12} label={t('endMonth')} {...register(`experiences.${index}.endMonth`, { setValueAs: nullableNumber })} />
              <TextField id={id('summaryEn')} multiline rows={3} label={t('summaryEn')} {...register(`experiences.${index}.summaryEn`)} />
              <TextField id={id('summarySr')} multiline rows={3} label={t('summarySr')} {...register(`experiences.${index}.summarySr`)} />
              <TextField id={id('bulletsEn')} multiline rows={4} label={t('bulletsEn')} hint={t('bulletsHint')} {...register(`experiences.${index}.bulletsEn`)} />
              <TextField id={id('bulletsSr')} multiline rows={4} label={t('bulletsSr')} hint={t('bulletsHint')} {...register(`experiences.${index}.bulletsSr`)} />
              <div data-wide>
                <TextField id={id('technologies')} label={t('technologies')} hint={t('technologiesHint')} {...register(`experiences.${index}.technologies`)} />
              </div>
            </FormGrid>
            <Remove>
              <Button variant="ghost" size="s" iconLeft="trash" onClick={() => { list.remove(index) }}>
                {t('removeItem')}
              </Button>
            </Remove>
          </Item>
        )
      })}
      <div>
        <Button variant="secondary" size="s" iconLeft="plus" onClick={list.add}>
          {t('addExperience')}
        </Button>
      </div>
    </Panel>
  )
}

export default CvExperience
