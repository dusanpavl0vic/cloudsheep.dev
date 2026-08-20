import { useTranslation } from 'react-i18next'
import { Navigate, useLocation, useNavigate } from 'react-router'

import { LoginForm, useAuth } from '@/features/auth'
import { ROUTES } from '@/lib/routes'
import { Container } from '@app/ui'

/** Stranica je SAMO kompozicija — nema state, nema selektora (docs/02). */
export function LoginPage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  const from = (location.state as { from?: string } | null)?.from ?? ROUTES.DASHBOARD

  /*
   * Ko već ima sesiju ne vidi formu.
   *
   * `SessionGate` je iznad ove rute, pa je obnova sesije ovde već završena — `isAuthenticated`
   * je konačan odgovor, ne „još ne znam". Bez ove provere bi otvaranje `/login` iz obeleživača
   * tražilo lozinku i onome ko je uredno prijavljen.
   *
   * `<Navigate>` tokom rendera, ne `useEffect` — inače forma bljesne pre preusmerenja (docs/05).
   */
  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  return (
    <Container width="content" className="flex min-h-dvh items-center justify-center py-16">
      <div className="w-full max-w-md">
        <h1 className="font-heading text-foreground mb-6 text-3xl font-bold">
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
