import { useTranslations } from 'next-intl'

import { ROUTES } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

import { Body, Eyebrow, Root, Title } from './NotFoundView.styles'

/** 404 — renderuje je `notFound()`, pa odgovor ima pravi kod 404 (docs/05-routing.md §4). */
const NotFoundView = () => {
  const t = useTranslations('errors')

  return (
    <Root>
      <Eyebrow>{t('notFoundEyebrow')}</Eyebrow>
      <Title>{t('notFoundTitle')}</Title>
      <Body>{t('notFoundBody')}</Body>
      <Link href={ROUTES.HOME}>{t('backHome')}</Link>
    </Root>
  )
}

export default NotFoundView
