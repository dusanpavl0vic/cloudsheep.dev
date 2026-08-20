import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ImageUpload } from '@/components/ImageUpload'
import { useUpload } from '@/hooks/useUpload'
import { Button, Checkbox, FormField, Input, Label } from '@app/ui'

import { teamMemberSchema, type TeamMemberInput } from '../../schemas/team.schema'
import type { TeamMember } from '../../types'

const EMPTY: TeamMemberInput = {
  fullName: '',
  roleSr: '',
  roleEn: '',
  avatarId: null,
  hasDiploma: false,
  universitySr: '',
  universityEn: '',
  degreeSr: '',
  degreeEn: '',
  programmeSr: '',
  programmeEn: '',
  facultySr: '',
  facultyEn: '',
  city: '',
  sealId: null,
  isVisible: true,
}

/** Dvojezična polja diplome. `base` je i i18n ključ i prefiks imena polja. */
const DIPLOMA_FIELDS = ['university', 'degree', 'programme', 'faculty'] as const

interface TeamMemberFormProps {
  member?: TeamMember
  isSaving: boolean
  onSubmit: (values: TeamMemberInput) => Promise<{ ok: boolean }>
  onCancel: () => void
}

/**
 * Forma za člana tima.
 *
 * **Polja diplome se prikazuju samo kad je čekboks uključen.** Bez toga je forma zid od
 * jedanaest praznih polja i za člana koji diplomu nema. Uslov ide kroz `watch`, ne kroz
 * `useState` — vrednost čekboksa već drži react-hook-form (docs/07 §4).
 */
export const TeamMemberForm = ({ member, isSaving, onSubmit, onCancel }: TeamMemberFormProps) => {
  const { t } = useTranslation(['team', 'common'])
  const { upload, isUploading } = useUpload()
  const diplomaId = useId()
  const visibleId = useId()

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TeamMemberInput & { avatarUrl?: string | null; sealUrl?: string | null }>({
    resolver: zodResolver(teamMemberSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    values: member ? { ...member } : { ...EMPTY, avatarUrl: null, sealUrl: null },
  })

  const hasDiploma = watch('hasDiploma')
  const avatarUrl = watch('avatarUrl')
  const sealUrl = watch('sealUrl')
  const fullName = watch('fullName')

  /** Isti tok za avatar i pečat — razlikuju se samo polja u koja upisuju. */
  const handleFile =
    (idField: 'avatarId' | 'sealId', urlField: 'avatarUrl' | 'sealUrl') => (file: File) => {
      void upload(file).then((result) => {
        if (result.ok) {
          setValue(idField, result.asset.id)
          setValue(urlField, result.asset.url)
          return
        }
        setError(idField, { message: result.messageKey })
      })
    }

  const submit = handleSubmit(async (values) => {
    // `avatarUrl`/`sealUrl` su samo za pregled u formi — server zna za id-eve
    await onSubmit({
      fullName: values.fullName,
      roleSr: values.roleSr,
      roleEn: values.roleEn,
      avatarId: values.avatarId,
      hasDiploma: values.hasDiploma,
      universitySr: values.universitySr,
      universityEn: values.universityEn,
      degreeSr: values.degreeSr,
      degreeEn: values.degreeEn,
      programmeSr: values.programmeSr,
      programmeEn: values.programmeEn,
      facultySr: values.facultySr,
      facultyEn: values.facultyEn,
      city: values.city,
      sealId: values.sealId,
      isVisible: values.isVisible,
    })
  })

  const busy = isSaving || isSubmitting || isUploading

  return (
    <form
      noValidate
      onSubmit={(event) => void submit(event)}
      className="flex max-w-3xl flex-col gap-6"
      aria-busy={busy}
    >
      <div className="border-border bg-card flex flex-col gap-5 rounded-xl border p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label={t('team.form.fullName')}
            {...(errors.fullName && { error: t(errors.fullName.message ?? '') })}
          >
            {(field) => <Input {...field} {...register('fullName')} />}
          </FormField>

          <FormField label={t('team.form.city')}>
            {(field) => <Input {...field} {...register('city')} />}
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {(['Sr', 'En'] as const).map((locale) => (
            <FormField
              key={locale}
              label={`${t('team.form.role')} (${t(`team.locales.${locale}`)})`}
            >
              {(field) => <Input {...field} {...register(`role${locale}`)} />}
            </FormField>
          ))}
        </div>

        <ImageUpload
          label={t('team.form.avatar')}
          value={avatarUrl ?? null}
          alt={fullName || t('team.form.avatar')}
          isUploading={isUploading}
          chooseLabel={t('team.form.choose')}
          removeLabel={t('common:common.delete')}
          uploadingLabel={t('team.form.uploading')}
          hint={t('team.form.avatarHint')}
          {...(errors.avatarId && { error: t(errors.avatarId.message ?? '') })}
          onRemove={() => {
            setValue('avatarId', null)
            setValue('avatarUrl', null)
          }}
          onFile={handleFile('avatarId', 'avatarUrl')}
        />
      </div>

      <div className="border-border bg-card flex flex-col gap-5 rounded-xl border p-6">
        <div className="flex items-center gap-2">
          <Checkbox id={diplomaId} {...register('hasDiploma')} />
          <Label htmlFor={diplomaId} className="mb-0">
            {t('team.form.hasDiploma')}
          </Label>
        </div>
        <p className="text-muted-foreground text-[13px]">{t('team.form.hasDiplomaHint')}</p>

        {hasDiploma && (
          <>
            {DIPLOMA_FIELDS.map((base) => (
              <div key={base} className="grid gap-5 sm:grid-cols-2">
                {(['Sr', 'En'] as const).map((locale) => (
                  <FormField
                    key={locale}
                    label={`${t(`team.form.${base}`)} (${t(`team.locales.${locale}`)})`}
                  >
                    {(field) => <Input {...field} {...register(`${base}${locale}`)} />}
                  </FormField>
                ))}
              </div>
            ))}

            <ImageUpload
              label={t('team.form.seal')}
              value={sealUrl ?? null}
              alt={t('team.form.seal')}
              isUploading={isUploading}
              chooseLabel={t('team.form.choose')}
              removeLabel={t('common:common.delete')}
              uploadingLabel={t('team.form.uploading')}
              hint={t('team.form.sealHint')}
              {...(errors.sealId && { error: t(errors.sealId.message ?? '') })}
              onRemove={() => {
                setValue('sealId', null)
                setValue('sealUrl', null)
              }}
              onFile={handleFile('sealId', 'sealUrl')}
            />
          </>
        )}
      </div>

      <div className="border-border bg-card flex items-center gap-4 rounded-xl border p-6">
        <Checkbox id={visibleId} {...register('isVisible')} />
        <Label htmlFor={visibleId} className="mb-0">
          {t('team.form.isVisible')}
        </Label>
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
