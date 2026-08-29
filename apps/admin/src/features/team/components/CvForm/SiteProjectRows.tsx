/* eslint-disable @typescript-eslint/restrict-template-expressions --
   Putanje polja u RHF-u su TIPIZIRANI template literali: `siteProjects.${number}.noteSr`.
   `String(index)` bi dao `${string}`, koji se ne poklapa sa `FieldPath` i obara typecheck. */
import { useFieldArray, type Control, type UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, FormField, Input } from '@app/ui'

import { gridVariants } from './CvForm.variants'
import { EmptyRows, RowShell } from './RowShell'
import type { CvFormInput } from '../../schemas/cv.schema'

interface SiteProject {
  id: string
  title: string
  year: number
}

interface Props {
  control: Control<CvFormInput>
  register: UseFormRegister<CvFormInput>
  /** Svi projekti sa sajta — izvor za dodavanje. */
  available: readonly SiteProject[]
}

/**
 * Projekti sa sajta uvršteni u CV.
 *
 * Ovde se NE unosi sadržaj: naziv, opis, tehnologije i adrese žive u `Project` tabeli i
 * povlače se odatle pri generisanju. Unosi se samo IZBOR, redosled i napomena — čime se
 * isti rad opisuje jednom, a menja na jednom mestu.
 *
 * Već uvršten projekat ispada iz padajuće liste: isti rad dvaput u CV-u je greška koju
 * forma ne treba da dozvoli.
 */
export const SiteProjectRows = ({ control, register, available }: Props) => {
  const { t } = useTranslation('cv')
  const { fields, append, remove } = useFieldArray({ control, name: 'siteProjects' })

  const taken = new Set(fields.map((f) => f.projectId))
  const free = available.filter((p) => !taken.has(p.id))

  return (
    <>
      {fields.length === 0 && <EmptyRows label={t('cv.siteProjects.empty')} />}

      {fields.map((field, index) => (
        <RowShell
          key={field.id}
          title={`${field.title} · ${String(field.year)}`}
          onRemove={() => {
            remove(index)
          }}
        >
          <div className={gridVariants()}>
            <FormField
              label={t('cv.siteProjects.note')}
              description={t('cv.siteProjects.noteHint')}
            >
              {(f) => <Input {...f} {...register(`siteProjects.${index}.noteSr`)} />}
            </FormField>
            <FormField label={t('cv.siteProjects.noteEn')}>
              {(f) => <Input {...f} {...register(`siteProjects.${index}.noteEn`)} />}
            </FormField>
          </div>
        </RowShell>
      ))}

      {free.length === 0 ? (
        <p className="text-faint text-[13px]">
          {available.length === 0 ? t('cv.siteProjects.none') : null}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {free.map((project) => (
            <Button
              key={project.id}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                append({
                  projectId: project.id,
                  title: project.title,
                  year: project.year,
                  noteSr: '',
                  noteEn: '',
                })
              }}
            >
              + {project.title}
            </Button>
          ))}
        </div>
      )}
    </>
  )
}
