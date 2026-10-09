'use client'

import { useTranslations } from 'next-intl'

import FormGrid from '@/components/admin/FormGrid'
import Panel from '@/components/admin/Panel'
import CheckboxField from '@/components/inputs/CheckboxField'
import TextField from '@/components/inputs/TextField'
import type { CvFormApi } from '@/hooks/admin/team'
import { useKeyTranslator } from '@/hooks/useApiErrorMessage'

const CONTACT = [
  ['email', 'email'],
  ['phone', 'phone'],
  ['githubUrl', 'github'],
  ['linkedinUrl', 'linkedin'],
  ['websiteUrl', 'website'],
  ['city', 'city'],
  ['locationSr', 'locationSr'],
  ['locationEn', 'locationEn'],
] as const

const DIPLOMA = ['universitySr', 'universityEn', 'degreeSr', 'degreeEn', 'programmeSr', 'programmeEn', 'facultySr', 'facultyEn'] as const

/** Prazno polje → `null`; RHF šalje i podrazumevanu vrednost (`null`) kroz ovu funkciju. */
const nullableYear = (value: unknown) => (value === '' || value === null || value === undefined ? null : Number(value))

/** Kontakt i sažetak CV-a. */
export const CvContactSection = ({ api }: { api: CvFormApi }) => {
  const t = useTranslations('admin')
  const translate = useKeyTranslator()
  const { register } = api.form

  return (
    <Panel title={t('cv.sections.contact')}>
      <FormGrid>
        {CONTACT.map(([field, label]) => (
          <TextField key={field} id={`cv-${field}`} label={label === 'city' ? t('team.city') : t(`cv.${label}`)} error={translate(api.errors[field]?.message)} {...register(field)} />
        ))}
        <div data-wide>
          <TextField id="cv-summary-en" multiline rows={4} label={t('cv.summaryEn')} error={translate(api.errors.summaryEn?.message)} {...register('summaryEn')} />
        </div>
        <div data-wide>
          <TextField id="cv-summary-sr" multiline rows={4} label={t('cv.summarySr')} error={translate(api.errors.summarySr?.message)} {...register('summarySr')} />
        </div>
      </FormGrid>
    </Panel>
  )
}

/** Obrazovanje — diploma je ista kao na kartici člana tima (čuva se na članu). */
export const CvEducationSection = ({ api }: { api: CvFormApi }) => {
  const t = useTranslations('admin')
  const translate = useKeyTranslator()
  const { register } = api.form

  return (
    <Panel title={t('cv.sections.education')}>
      <FormGrid>
        <div data-wide>
          <CheckboxField label={t('team.diploma')} {...register('hasDiploma')} />
        </div>
        {DIPLOMA.map((field) => (
          <TextField key={field} id={`cv-${field}`} label={t(`team.${field}`)} error={translate(api.errors[field]?.message)} {...register(field)} />
        ))}
        <TextField id="cv-status-en" label={t('cv.statusEn')} {...register('educationStatusEn')} />
        <TextField id="cv-status-sr" label={t('cv.statusSr')} {...register('educationStatusSr')} />
        <TextField id="cv-edu-start" type="number" label={t('cv.startYear')} error={translate(api.errors.educationStartYear?.message)} {...register('educationStartYear', { setValueAs: nullableYear })} />
        <TextField id="cv-edu-end" type="number" label={t('cv.endYear')} error={translate(api.errors.educationEndYear?.message)} {...register('educationEndYear', { setValueAs: nullableYear })} />
        <TextField id="cv-gpa" label={t('cv.gpa')} {...register('gpa')} />
      </FormGrid>
    </Panel>
  )
}
