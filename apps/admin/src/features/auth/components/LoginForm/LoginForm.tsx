import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, Input, Label } from '@app/ui'

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
 */
export function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation(['auth', 'common'])
  const { login, isLoading } = useLogin()

  const emailId = useId()
  const passwordId = useId()
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
      className="flex flex-col gap-5 rounded-xl border border-border bg-card p-8"
      aria-busy={busy}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={emailId}>{t('auth.login.email')}</Label>
        <Input
          id={emailId}
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${emailId}-error` : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p id={`${emailId}-error`} role="alert" className="text-sm text-destructive">
            {t(errors.email.message ?? '')}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={passwordId}>{t('auth.login.password')}</Label>
        <Input
          id={passwordId}
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? `${passwordId}-error` : undefined}
          {...register('password')}
        />
        {errors.password && (
          <p id={`${passwordId}-error`} role="alert" className="text-sm text-destructive">
            {t(errors.password.message ?? '')}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id={rememberId}
          type="checkbox"
          className="size-4 accent-primary"
          {...register('rememberMe')}
        />
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
