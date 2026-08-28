/* eslint-disable @typescript-eslint/restrict-template-expressions --
   Putanje polja u RHF-u su TIPIZIRANI template literali: `experiences.${number}.company`.
   `String(index)` bi dao `${string}`, koji se ne poklapa sa `FieldPath` i obara typecheck.
   Broj ovde nije formatiranje za prikaz nego deo tipa, pa pravilo ne pogađa pravi slučaj. */
import { useFieldArray, type Control, type UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, FormField, Input, Textarea } from '@app/ui'

import { gridVariants, pairVariants } from './CvForm.variants'
import { OPTIONAL_NUMBER, REQUIRED_NUMBER } from './numberField'
import { EmptyRows, RowShell } from './RowShell'
import type { CvFormInput } from '../../schemas/cv.schema'

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

interface Props {
  control: Control<CvFormInput>
  register: UseFormRegister<CvFormInput>
}

/**
 * Radna mesta.
 *
 * **Prvi `useFieldArray` u repou.** Do sada su se ponovljivi redovi rešavali zasebnim
 * endpointom po redu (`SocialLinks`, `ProjectImages`) — ovde ne mogu, jer ceo CV ide jednim
 * `PUT`-om, pa nizovi moraju da žive u formi. Obrazloženje je u planu i u `useCv`.
 *
 * Trajanje se NE unosi — računa ga server iz datuma. Prazna „kraj" godina znači da posao
 * traje, i to je jedini način da se to kaže.
 */
export const ExperienceRows = ({ control, register }: Props) => {
  const { t } = useTranslation('cv')
  const { fields, append, remove } = useFieldArray({ control, name: 'experiences' })

  return (
    <>
      {fields.length === 0 && <EmptyRows label={t('cv.experience.empty')} />}

      {fields.map((field, index) => (
        <RowShell
          key={field.id}
          title={`${t('cv.experience.row')} ${String(index + 1)}`}
          onRemove={() => {
            remove(index)
          }}
        >
          <div className={gridVariants()}>
            <FormField label={t('cv.experience.company')}>
              {(f) => <Input {...f} {...register(`experiences.${index}.company`)} />}
            </FormField>
            <FormField label={t('cv.experience.position')} description={t('cv.hint.bothLangs')}>
              {(f) => <Input {...f} {...register(`experiences.${index}.positionSr`)} />}
            </FormField>
            <FormField label={t('cv.experience.positionEn')}>
              {(f) => <Input {...f} {...register(`experiences.${index}.positionEn`)} />}
            </FormField>
            <FormField label={t('cv.experience.location')}>
              {(f) => <Input {...f} {...register(`experiences.${index}.locationSr`)} />}
            </FormField>
            <FormField label={t('cv.experience.locationEn')}>
              {(f) => <Input {...f} {...register(`experiences.${index}.locationEn`)} />}
            </FormField>

            <FormField label={t('cv.experience.start')} description={t('cv.hint.monthOptional')}>
              {(f) => (
                <span className={pairVariants()}>
                  <Input
                    {...f}
                    type="number"
                    placeholder={t('cv.experience.year')}
                    {...register(`experiences.${index}.startYear`, REQUIRED_NUMBER)}
                  />
                  <Input
                    type="number"
                    placeholder={t('cv.experience.month')}
                    {...register(`experiences.${index}.startMonth`, {
                      valueAsNumber: true,
                    })}
                  />
                </span>
              )}
            </FormField>

            <FormField label={t('cv.experience.end')} description={t('cv.hint.emptyMeansNow')}>
              {(f) => (
                <span className={pairVariants()}>
                  <Input
                    {...f}
                    type="number"
                    placeholder={t('cv.experience.year')}
                    {...register(`experiences.${index}.endYear`, OPTIONAL_NUMBER)}
                  />
                  <Input
                    type="number"
                    placeholder={t('cv.experience.month')}
                    {...register(`experiences.${index}.endMonth`, OPTIONAL_NUMBER)}
                  />
                </span>
              )}
            </FormField>
          </div>

          <div className={gridVariants()}>
            <FormField label={t('cv.experience.summary')}>
              {(f) => <Textarea {...f} rows={2} {...register(`experiences.${index}.summarySr`)} />}
            </FormField>
            <FormField label={t('cv.experience.summaryEn')}>
              {(f) => <Textarea {...f} rows={2} {...register(`experiences.${index}.summaryEn`)} />}
            </FormField>
            <FormField label={t('cv.experience.bullets')} description={t('cv.hint.onePerLine')}>
              {(f) => <Textarea {...f} rows={4} {...register(`experiences.${index}.bulletsSr`)} />}
            </FormField>
            <FormField label={t('cv.experience.bulletsEn')} description={t('cv.hint.onePerLine')}>
              {(f) => <Textarea {...f} rows={4} {...register(`experiences.${index}.bulletsEn`)} />}
            </FormField>
          </div>

          <FormField label={t('cv.experience.technologies')} description={t('cv.hint.commaList')}>
            {(f) => <Input {...f} {...register(`experiences.${index}.technologies`)} />}
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
        {t('cv.experience.add')}
      </Button>
    </>
  )
}
