/* eslint-disable @typescript-eslint/restrict-template-expressions --
   Putanje polja u RHF-u su TIPIZIRANI template literali: `experiences.${number}.company`.
   `String(index)` bi dao `${string}`, koji se ne poklapa sa `FieldPath` i obara typecheck.
   Broj ovde nije formatiranje za prikaz nego deo tipa, pa pravilo ne pogađa pravi slučaj. */
import { useFieldArray, type Control, type UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, FormField, Input, Textarea } from '@app/ui'

import { gridVariants } from './CvForm.variants'
import { OPTIONAL_NUMBER } from './numberField'
import { EmptyRows, RowShell } from './RowShell'
import type { CvFormInput } from '../../schemas/cv.schema'

const EMPTY = {
  name: '',
  summarySr: '',
  summaryEn: '',
  bulletsSr: '',
  bulletsEn: '',
  technologies: '',
  noteSr: '',
  noteEn: '',
  year: null,
  repoUrl: '',
  liveUrl: '',
}

interface Props {
  control: Control<CvFormInput>
  register: UseFormRegister<CvFormInput>
}

/**
 * Projekti u CV-u.
 *
 * Ovo NISU projekti sa sajta. Sajt nosi studije slučaja pisane za klijente, CV nosi i
 * fakultetske i lične radove kojih na sajtu nema — pa su i podaci odvojeni. Naziv se ne
 * prevodi: „TimberGame" je „TimberGame" na oba jezika.
 */
export const ProjectRows = ({ control, register }: Props) => {
  const { t } = useTranslation('cv')
  const { fields, append, remove } = useFieldArray({ control, name: 'projects' })

  return (
    <>
      {fields.length === 0 && <EmptyRows label={t('cv.projects.empty')} />}

      {fields.map((field, index) => (
        <RowShell
          key={field.id}
          title={`${t('cv.projects.row')} ${String(index + 1)}`}
          onRemove={() => {
            remove(index)
          }}
        >
          <div className={gridVariants()}>
            <FormField label={t('cv.projects.name')} description={t('cv.hint.notTranslated')}>
              {(f) => <Input {...f} {...register(`projects.${index}.name`)} />}
            </FormField>
            <FormField label={t('cv.projects.year')}>
              {(f) => (
                <Input
                  {...f}
                  type="number"
                  {...register(`projects.${index}.year`, OPTIONAL_NUMBER)}
                />
              )}
            </FormField>
            <FormField label={t('cv.projects.summary')}>
              {(f) => <Textarea {...f} rows={2} {...register(`projects.${index}.summarySr`)} />}
            </FormField>
            <FormField label={t('cv.projects.summaryEn')}>
              {(f) => <Textarea {...f} rows={2} {...register(`projects.${index}.summaryEn`)} />}
            </FormField>
            <FormField label={t('cv.projects.bullets')} description={t('cv.hint.onePerLine')}>
              {(f) => <Textarea {...f} rows={4} {...register(`projects.${index}.bulletsSr`)} />}
            </FormField>
            <FormField label={t('cv.projects.bulletsEn')} description={t('cv.hint.onePerLine')}>
              {(f) => <Textarea {...f} rows={4} {...register(`projects.${index}.bulletsEn`)} />}
            </FormField>
            <FormField label={t('cv.projects.repoUrl')}>
              {(f) => <Input {...f} {...register(`projects.${index}.repoUrl`)} />}
            </FormField>
            <FormField label={t('cv.projects.liveUrl')}>
              {(f) => <Input {...f} {...register(`projects.${index}.liveUrl`)} />}
            </FormField>
            <FormField label={t('cv.projects.note')} description={t('cv.hint.note')}>
              {(f) => <Input {...f} {...register(`projects.${index}.noteSr`)} />}
            </FormField>
            <FormField label={t('cv.projects.noteEn')}>
              {(f) => <Input {...f} {...register(`projects.${index}.noteEn`)} />}
            </FormField>
          </div>

          <FormField label={t('cv.projects.technologies')} description={t('cv.hint.commaList')}>
            {(f) => <Input {...f} {...register(`projects.${index}.technologies`)} />}
          </FormField>
        </RowShell>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => {
          append(EMPTY)
        }}
      >
        {t('cv.projects.add')}
      </Button>
    </>
  )
}
