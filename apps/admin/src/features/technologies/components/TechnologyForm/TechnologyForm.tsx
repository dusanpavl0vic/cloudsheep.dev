import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ImageUpload } from '@/components/ImageUpload'
import { useUpload } from '@/hooks/useUpload'
import { Button, FormField, Input, Select } from '@app/ui'

import { technologySchema, toSlug, type TechnologyInput } from '../../schemas/technology.schema'
import { TECHNOLOGY_GROUPS, type Technology } from '../../types'

const EMPTY: TechnologyInput = { slug: '', label: '', group: 'tooling', logoId: null }

interface TechnologyFormProps {
  technology?: Technology
  isSaving: boolean
  onSubmit: (values: TechnologyInput) => Promise<{ ok: boolean; field?: string | undefined }>
  onCancel: () => void
}

/**
 * Forma za tehnologiju. **Nula `useState`** — logotip se drži u RHF polju `logoId`, a
 * njegova adresa za pregled u `logoUrl`, koje forma nosi ali ne šalje serveru.
 */
export const TechnologyForm = ({
  technology,
  isSaving,
  onSubmit,
  onCancel,
}: TechnologyFormProps) => {
  const { t } = useTranslation(['technologies', 'common'])
  const { upload, isUploading } = useUpload()

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TechnologyInput & { logoUrl?: string | null }>({
    resolver: zodResolver(technologySchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    values: technology
      ? {
          ...technology,
          logoId: technology.logoUrl ? technology.id : null,
          logoUrl: technology.logoUrl,
        }
      : { ...EMPTY, logoUrl: null },
  })

  const logoUrl = watch('logoUrl')
  const label = watch('label')

  const submit = handleSubmit(async (values) => {
    // `logoUrl` je samo za pregled u formi — server zna za `logoId`, ne za adresu
    const result = await onSubmit({
      slug: values.slug,
      label: values.label,
      group: values.group,
      logoId: values.logoId,
    })

    // Server javlja koje je polje u sukobu; greška ide NA POLJE, ne u toast (docs/10)
    if (!result.ok && result.field === 'slug') {
      setError('slug', { message: 'technologies.errors.slugTaken' })
    }
  })

  const busy = isSaving || isSubmitting || isUploading

  return (
    <form
      noValidate
      onSubmit={(event) => void submit(event)}
      className="border-border bg-card flex max-w-xl flex-col gap-5 rounded-xl border p-6"
      aria-busy={busy}
    >
      <FormField
        label={t('technologies.form.label')}
        {...(errors.label && { error: t(errors.label.message ?? '') })}
      >
        {(field) => (
          <Input
            {...field}
            {...register('label', {
              // Slug se predlaže iz naziva samo dok je prazan — izmenjen ručno se ne dira
              onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                if (!technology) setValue('slug', toSlug(event.target.value))
              },
            })}
          />
        )}
      </FormField>

      <FormField
        label={t('technologies.form.slug')}
        description={t('technologies.form.slugHint')}
        {...(errors.slug && { error: t(errors.slug.message ?? '') })}
      >
        {(field) => <Input {...field} {...register('slug')} />}
      </FormField>

      <FormField label={t('technologies.form.group')}>
        {(field) => (
          <Select {...field} {...register('group')}>
            {TECHNOLOGY_GROUPS.map((group) => (
              <option key={group} value={group}>
                {t(`technologies.groups.${group}`)}
              </option>
            ))}
          </Select>
        )}
      </FormField>

      <ImageUpload
        label={t('technologies.form.logo')}
        value={logoUrl ?? null}
        alt={label || t('technologies.form.logo')}
        isUploading={isUploading}
        chooseLabel={t('technologies.form.chooseLogo')}
        removeLabel={t('common:common.delete')}
        uploadingLabel={t('technologies.form.uploading')}
        hint={t('technologies.form.logoHint')}
        {...(errors.logoId && { error: t(errors.logoId.message ?? '') })}
        onRemove={() => {
          setValue('logoId', null)
          setValue('logoUrl', null)
        }}
        onFile={(file) => {
          void upload(file).then((result) => {
            if (result.ok) {
              setValue('logoId', result.asset.id)
              setValue('logoUrl', result.asset.url)
              return
            }
            setError('logoId', { message: result.messageKey })
          })
        }}
      />

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
