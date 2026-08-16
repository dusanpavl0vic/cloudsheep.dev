import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'

import { LoginForm } from '@/features/auth'
import { ROUTES } from '@/lib/routes'
import { Container } from '@app/ui'

/** Stranica je SAMO kompozicija — nema state, nema selektora (docs/02). */
export function LoginPage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: string } | null)?.from ?? ROUTES.DASHBOARD

  return (
    <Container width="content" className="flex min-h-dvh items-center justify-center py-16">
      <div className="w-full max-w-md">
        <h1 className="mb-6 font-heading text-3xl font-bold text-foreground">
          {t('auth.login.title')}
        </h1>
        <LoginForm
          onSuccess={() => {
            void navigate(from, { replace: true })
          }}
        />
      </div>
    </Container>
  )
}
