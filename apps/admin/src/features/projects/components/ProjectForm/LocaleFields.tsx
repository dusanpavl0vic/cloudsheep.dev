import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormField, Input, Textarea } from '@app/ui'

import type { ProjectInput } from '../../schemas/project.schema'

type Locale = 'Sr' | 'En'

interface LocaleFieldsProps {
  locale: Locale
  register: UseFormRegister<ProjectInput>
  errors: FieldErrors<ProjectInput>
}

/**
 * Četiri polja koja postoje po jeziku. Izdvojena da `ProjectForm` ne bi imao isti blok
 * dvaput i prešao granicu od 150 linija (docs/03).
 *
 * Imena polja se sastavljaju (`title${locale}`), pa dodavanje jezika ovde ne bi tražilo
 * novi blok — ali i ne planira se: jezika je dva i to je odluka, ne trenutno stanje.
 */
export const LocaleFields = ({ locale, register, errors }: LocaleFieldsProps) => {
  const { t } = useTranslation('projects')

  const title = `title${locale}` as const
  const cat = `cat${locale}` as const
  const desc = `desc${locale}` as const
  const caption = `caption${locale}` as const

  return (
    <>
      <FormField
        label={t('projects.form.title')}
        {...(errors[title] && { error: t(errors[title].message ?? '') })}
      >
        {(field) => <Input {...field} {...register(title)} />}
      </FormField>

      <FormField
        label={t('projects.form.cat')}
        description={t('projects.form.catHint')}
        {...(errors[cat] && { error: t(errors[cat].message ?? '') })}
      >
        {(field) => <Input {...field} {...register(cat)} />}
      </FormField>

      <FormField
        label={t('projects.form.desc')}
        {...(errors[desc] && { error: t(errors[desc].message ?? '') })}
      >
        {(field) => <Textarea {...field} rows={4} {...register(desc)} />}
      </FormField>

      <FormField
        label={t('projects.form.caption')}
        description={t('projects.form.captionHint')}
        {...(errors[caption] && { error: t(errors[caption].message ?? '') })}
      >
        {(field) => <Input {...field} {...register(caption)} />}
      </FormField>
    </>
  )
}
