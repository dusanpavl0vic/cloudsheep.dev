import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { ROUTES } from '@/lib/routes'
import { Container, TextLink } from '@app/ui'

export function NotFoundPage() {
  const { t } = useTranslation('common')

  return (
    <Container as="main" width="content" className="py-24 text-center">
      <h1 className="font-heading text-foreground mb-4 text-3xl font-bold">
        {t('notFound.title')}
      </h1>
      <TextLink asChild>
        <Link to={ROUTES.DASHBOARD}>{t('notFound.back')}</Link>
      </TextLink>
    </Container>
  )
}
