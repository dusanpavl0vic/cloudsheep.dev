import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, Checkbox, FormField, Input, Label } from '@app/ui'

import { useLogin } from '../../hooks/useLogin'
import { loginSchema, type LoginInput } from '../../schemas/login.schema'

interface LoginFormProps {
  /** Poziva se posle uspešne prijave — komponenta ne odlučuje kuda se ide dalje. */
  onSuccess?: () => void
}

/**
 * Referentna forma za ceo repo (docs/10-forms-validation.md).
 *
 * **Nula `useState`.** Vrednosti, greške, `isSubmitting` i `isValid` drži react-hook-form.
 * Poruke grešaka su i18n ključevi iz zod šeme, pa se prevode tek pri prikazu.
 *
 * Povezivanje labele, `aria-invalid` i `aria-describedby` radi `FormField` — ranije je
 * ovde stajalo po devet linija na svako polje, sa `useId`-om po polju. Jedini `useId` koji
 * je ostao je za čekboks, jer njemu labela stoji sa strane, ne iznad.
 */
export function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation(['auth', 'common'])
  const { login, isLoading } = useLogin()

  const rememberId = useId()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  const onSubmit = handleSubmit(async (values) => {
    const result = await login(values)

    if (!result.ok) {
      // Greška polja ide na POLJE, ne u toast — korisnik mora da vidi gde je problem
      setError('password', { message: 'auth.errors.invalidCredentials' })
      return
    }

    onSuccess?.()
  })

  const busy = isLoading || isSubmitting

  return (
    <form
      noValidate
      onSubmit={(event) => void onSubmit(event)}
      className="border-border bg-card flex flex-col gap-5 rounded-xl border p-8"
      aria-busy={busy}
    >
      <FormField
        label={t('auth.login.email')}
        {...(errors.email && { error: t(errors.email.message ?? '') })}
      >
        {(field) => <Input {...field} type="email" autoComplete="email" {...register('email')} />}
      </FormField>

      <FormField
        label={t('auth.login.password')}
        {...(errors.password && { error: t(errors.password.message ?? '') })}
      >
        {(field) => (
          <Input
            {...field}
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
        )}
      </FormField>

      <div className="flex items-center gap-2">
        <Checkbox id={rememberId} {...register('rememberMe')} />
        <Label htmlFor={rememberId} className="mb-0">
          {t('auth.login.rememberMe')}
        </Label>
      </div>

      <Button type="submit" disabled={busy}>
        {busy ? t('common:common.loading') : t('auth.login.submit')}
      </Button>
    </form>
  )
}
