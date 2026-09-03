import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { QUERY } from '@/lib/routes'
import { Button, Checkbox, FormField, Input, Label, Select } from '@app/ui'

import { LocaleFields } from './LocaleFields'
import {
  localeTabVariants,
  localeTabsVariants,
  projectFormRowVariants,
  projectFormSectionVariants,
  projectFormVariants,
} from './ProjectForm.variants'
import { projectSchema, type ProjectInput } from '../../schemas/project.schema'
import { GALLERY_LAYOUTS, PROJECT_CATEGORIES, type AdminProject } from '../../types'
import { ProjectImages } from '../ProjectImages'

const LOCALES = ['Sr', 'En'] as const

/** Modul-konstanta — `?? []` bi pravio nov niz na svaki render (docs/07 §2). */
const EMPTY_IMAGES: AdminProject['images'] = []

const EMPTY: ProjectInput = {
  slug: '',
  category: 'fullStack',
  year: new Date().getFullYear(),
  titleSr: '',
  titleEn: '',
  catSr: '',
  catEn: '',
  descSr: '',
  descEn: '',
  captionSr: '',
  captionEn: '',
  technologyIds: [],
  galleryLayout: 'grid',
  liveUrl: '',
  repoUrl: '',
  isPublished: false,
  isFeatured: false,
}

const toFormValues = (project: AdminProject): ProjectInput => ({
  ...project,
  liveUrl: project.liveUrl ?? '',
  repoUrl: project.repoUrl ?? '',
})

interface ProjectFormProps {
  project?: AdminProject
  /** Spisak iz kog se biraju tehnologije. Prazan znači da ih još nema ni jedna. */
  availableTechnologies: readonly { id: string; label: string; logoUrl: string | null }[]
  isSaving: boolean
  onSubmit: (values: ProjectInput) => Promise<{ ok: boolean }>
  onCancel: () => void
}

export const ProjectForm = ({
  project,
  availableTechnologies,
  isSaving,
  onSubmit,
  onCancel,
}: ProjectFormProps) => {
  const { t } = useTranslation(['projects', 'common'])
  const publishedId = useId()
  const featuredId = useId()
  const tabsId = useId()

  /*
   * Aktivan jezik je u URL-u, ne u `useState`.
   *
   * `docs/04` traži tabove u URL-u: tako se link na formu otvorenu na engleskom može
   * poslati, i tako povratak nazad vraća onaj tab na kom si bio.
   */
  const [params, setParams] = useSearchParams()
  const activeLocale = params.get(QUERY.LANG) === 'en' ? 'En' : 'Sr'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    // `values`, ne `defaultValues`: podaci stižu posle prvog rendera, a `values` ih
    // usklađuje sam — `defaultValues` bi tražio `reset()` u `useEffect`-u (docs/07 §3).
    values: project ? toFormValues(project) : EMPTY,
  })

  const submit = handleSubmit(async (values) => {
    await onSubmit(values)
  })

  const busy = isSaving || isSubmitting

  return (
    <form
      noValidate
      onSubmit={(event) => void submit(event)}
      className={projectFormVariants()}
      aria-busy={busy}
    >
      <div className={projectFormSectionVariants()}>
        <div className={projectFormRowVariants()}>
          <FormField
            label={t('projects.form.slug')}
            description={t('projects.form.slugHint')}
            {...(errors.slug && { error: t(errors.slug.message ?? '') })}
          >
            {(field) => <Input {...field} {...register('slug')} />}
          </FormField>

          <FormField
            label={t('projects.form.year')}
            {...(errors.year && { error: t(errors.year.message ?? '') })}
          >
            {(field) => (
              <Input {...field} type="number" {...register('year', { valueAsNumber: true })} />
            )}
          </FormField>
        </div>

        <FormField label={t('projects.form.category')}>
          {(field) => (
            <Select {...field} {...register('category')}>
              {PROJECT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {t(`projects.categories.${category}`)}
                </option>
              ))}
            </Select>
          )}
        </FormField>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-foreground mb-1 text-[14.5px] font-medium">
            {t('projects.form.tech')}
          </legend>
          <p className="text-muted-foreground text-[13px]">{t('projects.form.techHint')}</p>

          {availableTechnologies.length === 0 ? (
            <p className="text-muted-foreground text-[13px]">{t('projects.form.noTech')}</p>
          ) : (
            <div className="flex flex-wrap gap-x-5 gap-y-2.5">
              {availableTechnologies.map((technology) => (
                <label
                  key={technology.id}
                  className="flex cursor-pointer items-center gap-2 text-[15px]"
                >
                  <Checkbox value={technology.id} {...register('technologyIds')} />
                  {technology.logoUrl && (
                    <img
                      src={technology.logoUrl}
                      alt=""
                      width={16}
                      height={16}
                      className="size-4 object-contain"
                    />
                  )}
                  {technology.label}
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <div className={projectFormRowVariants()}>
          <FormField
            label={t('projects.form.galleryLayout')}
            description={t('projects.form.galleryLayoutHint')}
          >
            {(field) => (
              <Select {...field} {...register('galleryLayout')}>
                {GALLERY_LAYOUTS.map((layout) => (
                  <option key={layout} value={layout}>
                    {t(`projects.galleryLayouts.${layout}`)}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
        </div>

        <div className={projectFormRowVariants()}>
          <FormField
            label={t('projects.form.liveUrl')}
            {...(errors.liveUrl && { error: t(errors.liveUrl.message ?? '') })}
          >
            {(field) => <Input {...field} type="url" {...register('liveUrl')} />}
          </FormField>

          <FormField
            label={t('projects.form.repoUrl')}
            {...(errors.repoUrl && { error: t(errors.repoUrl.message ?? '') })}
          >
            {(field) => <Input {...field} type="url" {...register('repoUrl')} />}
          </FormField>
        </div>
      </div>

      <div className={projectFormSectionVariants()}>
        <div className={localeTabsVariants()} role="tablist">
          {LOCALES.map((locale) => (
            <button
              key={locale}
              type="button"
              role="tab"
              id={`${tabsId}-${locale}`}
              aria-controls={`${tabsId}-${locale}-panel`}
              aria-selected={locale === activeLocale}
              className={localeTabVariants({ active: locale === activeLocale })}
              onClick={() => {
                setParams({ [QUERY.LANG]: locale.toLowerCase() }, { replace: true })
              }}
            >
              {t(`projects.form.locale${locale}`)}
            </button>
          ))}
        </div>

        {/*
          Oba jezika su uvek u DOM-u, samo je jedan skriven: da su uslovno renderovani,
          greška validacije na skrivenom jeziku ne bi imala gde da se prikaže.

          Zato `role="tabpanel"` i `aria-labelledby`: polja „Naslov" postoje dvaput, pa bez
          panela koji nosi ime jezika screen reader čita dva identična imena u istoj formi.
        */}
        {LOCALES.map((locale) => (
          <div
            key={locale}
            role="tabpanel"
            id={`${tabsId}-${locale}-panel`}
            aria-labelledby={`${tabsId}-${locale}`}
            hidden={locale !== activeLocale}
            className="flex flex-col gap-5"
          >
            <LocaleFields locale={locale} register={register} errors={errors} />
          </div>
        ))}
      </div>

      <div className={projectFormSectionVariants()}>
        <h2 className="font-heading text-foreground text-base font-semibold">
          {t('projects.images.title')}
        </h2>
        <ProjectImages projectId={project?.id} images={project?.images ?? EMPTY_IMAGES} />
      </div>

      <div className={projectFormSectionVariants()}>
        <div className="flex items-center gap-2">
          <Checkbox id={publishedId} {...register('isPublished')} />
          <Label htmlFor={publishedId} className="mb-0">
            {t('projects.form.isPublished')}
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id={featuredId} {...register('isFeatured')} />
          <Label htmlFor={featuredId} className="mb-0">
            {t('projects.form.isFeatured')}
          </Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? t('common:common.loading') : t('common:common.save')}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t('common:common.cancel')}
        </Button>
      </div>
    </form>
  )
}
