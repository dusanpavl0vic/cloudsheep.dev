import { getTranslations } from 'next-intl/server'

import AuthLayout from '@/components/admin/AuthLayout'
import LoginForm from '@/components/admin/LoginForm'

interface LoginPageProps {
  searchParams: Promise<{ expired?: string }>
}

/** `/admin/login` — jedina admin stranica dostupna bez sesije. */
const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const [t, { expired }] = await Promise.all([getTranslations('admin.login'), searchParams])
  return (
    <AuthLayout title={t('title')} lead={t('lead')}>
      <LoginForm expired={expired === '1'} />
    </AuthLayout>
  )
}

export default LoginPage
