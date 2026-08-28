/* eslint-disable @typescript-eslint/restrict-template-expressions --
   Putanje polja u RHF-u su TIPIZIRANI template literali: `experiences.${number}.company`.
   `String(index)` bi dao `${string}`, koji se ne poklapa sa `FieldPath` i obara typecheck.
   Broj ovde nije formatiranje za prikaz nego deo tipa, pa pravilo ne pogađa pravi slučaj. */
import { useFieldArray, type Control, type UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, FormField, Input } from '@app/ui'

import { gridVariants } from './CvForm.variants'
import { OPTIONAL_NUMBER } from './numberField'
import { EmptyRows, RowShell } from './RowShell'
import type { CvFormInput } from '../../schemas/cv.schema'

const EMPTY_SKILL = { name: '', groupSr: '', groupEn: '', years: null }
const EMPTY_LANGUAGE = { nameSr: '', nameEn: '', levelSr: '', levelEn: '' }

interface Props {
  control: Control<CvFormInput>
  register: UseFormRegister<CvFormInput>
}

/**
 * Veštine sa godinama iskustva.
 *
 * Grupa je slobodan tekst („Backend", „Alati"), ne šifarnik: CV se piše za konkretan oglas
 * i grupe se menjaju od prijave do prijave. Prazna grupa znači da stavka ide u bezimeni
 * blok na kraju — renderer to već zna.
 */
export const SkillRows = ({ control, register }: Props) => {
  const { t } = useTranslation('cv')
  const { fields, append, remove } = useFieldArray({ control, name: 'skills' })

  return (
    <>
      {fields.length === 0 && <EmptyRows label={t('cv.skills.empty')} />}

      {fields.map((field, index) => (
        <RowShell
          key={field.id}
          title={`${t('cv.skills.row')} ${String(index + 1)}`}
          onRemove={() => {
            remove(index)
          }}
        >
          <div className={gridVariants()}>
            <FormField label={t('cv.skills.name')}>
              {(f) => <Input {...f} {...register(`skills.${index}.name`)} />}
            </FormField>
            <FormField label={t('cv.skills.years')} description={t('cv.hint.yearsOptional')}>
              {(f) => (
                <Input
                  {...f}
                  type="number"
                  step="0.5"
                  {...register(`skills.${index}.years`, OPTIONAL_NUMBER)}
                />
              )}
            </FormField>
            <FormField label={t('cv.skills.group')} description={t('cv.hint.groupOptional')}>
              {(f) => <Input {...f} {...register(`skills.${index}.groupSr`)} />}
            </FormField>
            <FormField label={t('cv.skills.groupEn')}>
              {(f) => <Input {...f} {...register(`skills.${index}.groupEn`)} />}
            </FormField>
          </div>
        </RowShell>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => {
          append(EMPTY_SKILL)
        }}
      >
        {t('cv.skills.add')}
      </Button>
    </>
  )
}

/** Jezici. Nivo je slobodan tekst jer nije uvek CEFR — „B2" i „maternji" stoje jedno uz drugo. */
export const LanguageRows = ({ control, register }: Props) => {
  const { t } = useTranslation('cv')
  const { fields, append, remove } = useFieldArray({ control, name: 'languages' })

  return (
    <>
      {fields.length === 0 && <EmptyRows label={t('cv.languages.empty')} />}

      {fields.map((field, index) => (
        <RowShell
          key={field.id}
          title={`${t('cv.languages.row')} ${String(index + 1)}`}
          onRemove={() => {
            remove(index)
          }}
        >
          <div className={gridVariants()}>
            <FormField label={t('cv.languages.name')}>
              {(f) => <Input {...f} {...register(`languages.${index}.nameSr`)} />}
            </FormField>
            <FormField label={t('cv.languages.nameEn')}>
              {(f) => <Input {...f} {...register(`languages.${index}.nameEn`)} />}
            </FormField>
            <FormField label={t('cv.languages.level')} description={t('cv.hint.level')}>
              {(f) => <Input {...f} {...register(`languages.${index}.levelSr`)} />}
            </FormField>
            <FormField label={t('cv.languages.levelEn')}>
              {(f) => <Input {...f} {...register(`languages.${index}.levelEn`)} />}
            </FormField>
          </div>
        </RowShell>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => {
          append(EMPTY_LANGUAGE)
        }}
      >
        {t('cv.languages.add')}
      </Button>
    </>
  )
}
