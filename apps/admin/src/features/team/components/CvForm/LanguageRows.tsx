/* eslint-disable @typescript-eslint/restrict-template-expressions --
   Putanje polja u RHF-u su TIPIZIRANI template literali: `languages.${number}.nameSr`.
   `String(index)` bi dao `${string}`, koji se ne poklapa sa `FieldPath` i obara typecheck. */
import { useFieldArray, type Control, type UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, FormField, Input } from '@app/ui'

import { gridVariants } from './CvForm.variants'
import { EmptyRows, RowShell } from './RowShell'
import type { CvFormInput } from '../../schemas/cv.schema'

const EMPTY = { nameSr: '', nameEn: '', levelSr: '', levelEn: '' }

interface Props {
  control: Control<CvFormInput>
  register: UseFormRegister<CvFormInput>
}

/**
 * Jezici.
 *
 * Nivo je slobodan tekst, ne CEFR šifarnik: „B2" i „maternji" stoje jedno uz drugo, a
 * maternji jezik nema nivo koji bi se birao iz liste.
 */
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
          append(EMPTY)
        }}
      >
        {t('cv.languages.add')}
      </Button>
    </>
  )
}
