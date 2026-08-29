import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, FormField, Input, Textarea } from '@app/ui'

import {
  actionsVariants,
  formVariants,
  gridVariants,
  pairVariants,
  sectionHeadVariants,
  sectionHintVariants,
  sectionTitleVariants,
  sectionVariants,
} from './CvForm.variants'
import { ExperienceRows } from './ExperienceRows'
import { OPTIONAL_NUMBER } from './numberField'
import { ProjectRows } from './ProjectRows'
import { SiteProjectRows } from './SiteProjectRows'
import { LanguageRows, SkillRows } from './SkillRows'
import { cvSchema, type CvFormInput } from '../../schemas/cv.schema'
import type { CvLang } from '../../types'

interface SiteProject {
  id: string
  title: string
  year: number
}

interface CvFormProps {
  values: CvFormInput
  /**
   * Projekti sa sajta, za izbor. Stižu kroz props iz strane, ne uvozom `features/projects` —
   * feature ne sme da uvozi feature (docs/01 §2), a strana sme oba.
   */
  siteProjects: readonly SiteProject[]
  onSubmit: (values: CvFormInput) => Promise<unknown>
  onDownload: (lang: CvLang) => void
  isSaving: boolean
  isDownloading: boolean
}

/**
 * Ceo CV u jednoj formi.
 *
 * Sve se čuva jednim `PUT`-om, pa nema „sačuvaj" po sekciji — ceo dokument je jedan podatak.
 * Otud i traka sa dugmadima koja ostaje prilepljena za dno: forma je duga, a čuvanje ne sme
 * da traži skrolovanje do kraja.
 *
 * **Preuzimanje ne čuva.** Dugmad za PDF šalju ono što je POSLEDNJE sačuvano, ne ono što je
 * u formi — server crta iz baze. Zato tekst uz dugmad na to i podseća.
 */
export const CvForm = ({
  values,
  siteProjects,
  onSubmit,
  onDownload,
  isSaving,
  isDownloading,
}: CvFormProps) => {
  const { t } = useTranslation(['cv', 'common'])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CvFormInput>({
    resolver: zodResolver(cvSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    // `values`, ne `defaultValues`: podaci stižu posle prvog rendera (docs/07 §3)
    values,
  })

  const submit = handleSubmit(async (data) => {
    await onSubmit(data)
  })
  const busy = isSaving || isSubmitting

  const section = (title: string, hint: string, body: React.ReactNode) => (
    <section className={sectionVariants()}>
      <div className={sectionHeadVariants()}>
        <h2 className={sectionTitleVariants()}>{title}</h2>
        <span className={sectionHintVariants()}>{hint}</span>
      </div>
      {body}
    </section>
  )

  return (
    <form
      className={formVariants()}
      noValidate
      aria-busy={busy}
      onSubmit={(event) => void submit(event)}
    >
      {section(
        t('cv.contact.title'),
        t('cv.contact.hint'),
        <div className={gridVariants()}>
          <FormField
            label={t('cv.contact.email')}
            {...(errors.email && { error: t(errors.email.message ?? '') })}
          >
            {(f) => <Input {...f} type="email" {...register('email')} />}
          </FormField>
          <FormField label={t('cv.contact.phone')}>
            {(f) => <Input {...f} {...register('phone')} />}
          </FormField>
          <FormField label={t('cv.contact.location')} description={t('cv.hint.bothLangs')}>
            {(f) => <Input {...f} {...register('locationSr')} />}
          </FormField>
          <FormField label={t('cv.contact.locationEn')}>
            {(f) => <Input {...f} {...register('locationEn')} />}
          </FormField>
          <FormField label={t('cv.contact.github')}>
            {(f) => <Input {...f} {...register('githubUrl')} />}
          </FormField>
          <FormField label={t('cv.contact.linkedin')}>
            {(f) => <Input {...f} {...register('linkedinUrl')} />}
          </FormField>
          <FormField label={t('cv.contact.website')}>
            {(f) => <Input {...f} {...register('websiteUrl')} />}
          </FormField>
        </div>,
      )}

      {section(
        t('cv.summary.title'),
        t('cv.summary.hint'),
        <div className={gridVariants()}>
          <FormField label={t('cv.summary.sr')}>
            {(f) => <Textarea {...f} rows={4} {...register('summarySr')} />}
          </FormField>
          <FormField label={t('cv.summary.en')}>
            {(f) => <Textarea {...f} rows={4} {...register('summaryEn')} />}
          </FormField>
        </div>,
      )}

      {section(
        t('cv.experience.title'),
        t('cv.experience.hint'),
        <ExperienceRows control={control} register={register} />,
      )}

      {section(
        t('cv.education.title'),
        t('cv.education.hint'),
        <div className={gridVariants()}>
          <FormField label={t('cv.education.status')} description={t('cv.hint.bothLangs')}>
            {(f) => <Input {...f} {...register('educationStatusSr')} />}
          </FormField>
          <FormField label={t('cv.education.statusEn')}>
            {(f) => <Input {...f} {...register('educationStatusEn')} />}
          </FormField>
          <FormField label={t('cv.education.gpa')} description={t('cv.hint.gpa')}>
            {(f) => <Input {...f} {...register('gpa')} />}
          </FormField>
          <FormField label={t('cv.education.years')}>
            {(f) => (
              <span className={pairVariants()}>
                <Input {...f} type="number" {...register('educationStartYear', OPTIONAL_NUMBER)} />
                <Input type="number" {...register('educationEndYear', OPTIONAL_NUMBER)} />
              </span>
            )}
          </FormField>
        </div>,
      )}

      {section(
        t('cv.siteProjects.title'),
        t('cv.siteProjects.hint'),
        <SiteProjectRows control={control} register={register} available={siteProjects} />,
      )}

      {section(
        t('cv.projects.title'),
        t('cv.projects.hint'),
        <ProjectRows control={control} register={register} />,
      )}

      {section(
        t('cv.skills.title'),
        t('cv.skills.hint'),
        <SkillRows control={control} register={register} />,
      )}

      {section(
        t('cv.languages.title'),
        t('cv.languages.hint'),
        <LanguageRows control={control} register={register} />,
      )}

      <div className={actionsVariants()}>
        <Button type="submit" disabled={busy}>
          {busy ? t('common:common.loading') : t('cv.form.save')}
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isDownloading || isDirty}
          onClick={() => {
            onDownload('sr')
          }}
        >
          {t('cv.form.downloadSr')}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isDownloading || isDirty}
          onClick={() => {
            onDownload('en')
          }}
        >
          {t('cv.form.downloadEn')}
        </Button>

        {isDirty && <span className={sectionHintVariants()}>{t('cv.form.saveFirst')}</span>}
      </div>
    </form>
  )
}
