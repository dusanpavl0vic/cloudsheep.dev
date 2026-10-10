'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm, useFormState } from 'react-hook-form'

import { ROUTES } from '@/constants/routes'
import { parseApiError } from '@/helpers/apiError'
import { loginSchema, type LoginInput } from '@/schemas/auth'
import { useLoginMutation } from '@/store/api/admin/auth'

/** Prijava: RHF + ista šema kao na serveru; pogrešna lozinka je greška forme, ne toast. */
export const useLogin = () => {
  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '', rememberMe: true },
  })
  // React Compiler memoizuje `form.formState` (proxy) — greške samo kroz useFormState (docs/10).
  const { errors } = useFormState({ control: form.control })

  const submit = form.handleSubmit(async (values) => {
    try {
      await login(values).unwrap()
      router.replace(ROUTES.ADMIN)
    } catch (caught) {
      form.setError('root', { type: 'server', message: parseApiError(caught).messageKey })
    }
  })

  return { form, errors, submit, isSubmitting: isLoading }
}
