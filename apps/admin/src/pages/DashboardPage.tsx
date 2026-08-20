import { useTranslation } from 'react-i18next'

import { useAuth, useLogout } from '@/features/auth'
import { Button, Container } from '@app/ui'

export function DashboardPage() {
  const { t } = useTranslation('common')
  const { user } = useAuth()
  const { logout, isLoading } = useLogout()

  return (
    <Container as="main" width="content" className="py-16">
      <h1 className="font-heading text-foreground mb-2 text-3xl font-bold">
        {t('dashboard.title')}
      </h1>
      <p className="text-muted-foreground mb-8">
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
