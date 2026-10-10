'use client'

import { useTranslations } from 'next-intl'

import Button from '@/components/buttons/Button'
import TextField from '@/components/inputs/TextField'
import { useLogin } from '@/hooks/admin/session'
import { useKeyTranslator } from '@/hooks/useApiErrorMessage'
import { useHydrated } from '@/hooks/useHydrated'

import { Alert, Check, Form, Notice } from './LoginForm.styles'

/** Prijava u admin. `expired` — preusmereno jer je sesija istekla. */
const LoginForm = ({ expired }: { expired: boolean }) => {
  const t = useTranslations('admin.login')
  const translate = useKeyTranslator()
  const hydrated = useHydrated()
  const { form, errors, submit, isSubmitting } = useLogin()

  return (
    <Form noValidate onSubmit={(event) => void submit(event)}>
      {expired && !errors.root && <Notice role="status">{t('expired')}</Notice>}
      {errors.root?.message && <Alert role="alert">{translate(errors.root.message)}</Alert>}
      <TextField id="login-email" type="email" autoComplete="username" label={t('email')} error={translate(errors.email?.message)} {...form.register('email')} />
      <TextField
        id="login-password"
        type="password"
        autoComplete="current-password"
        label={t('password')}
        error={translate(errors.password?.message)}
        {...form.register('password')}
      />
      <Check>
        <input type="checkbox" {...form.register('rememberMe')} />
        {t('remember')}
      </Check>
      <Button type="submit" size="l" fullWidth loading={isSubmitting} disabled={!hydrated}>
        {t('submit')}
      </Button>
    </Form>
  )
}

export default LoginForm
