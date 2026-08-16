import { useTranslation } from 'react-i18next'

import { useAuth, useLogout } from '@/features/auth'
import { Button, Container } from '@app/ui'

export function DashboardPage() {
  const { t } = useTranslation('common')
  const { user } = useAuth()
  const { logout, isLoading } = useLogout()

  return (
    <Container as="main" width="content" className="py-16">
      <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">
        {t('dashboard.title')}
      </h1>
      <p className="mb-8 text-muted-foreground">
        {t('dashboard.welcome', { name: user?.name ?? '' })}
      </p>
      <Button
        onClick={() => {
          void logout()
        }}
        disabled={isLoading}
      >
        {t('common.signOut')}
      </Button>
    </Container>
  )
}
