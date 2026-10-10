'use client'

import { useTranslations } from 'next-intl'

import { Body, Retry, Root, Title } from './ErrorView.styles'
import type { ErrorViewProps } from './ErrorView.types'

/**
 * Greška pri renderu (npr. baza nije odgovorila). NIKAD ne prikazuje poruku ni stack greške:
 * Googlebot je ranije iz takvog teksta izvukao „adrese" `react-vendor-….js:9:70789` (ADR 0009).
 */
const ErrorView = ({ onRetry }: ErrorViewProps) => {
  const t = useTranslations('errors')

  return (
    <Root role="alert">
      <Title>{t('genericTitle')}</Title>
      <Body>{t('genericBody')}</Body>
      <Retry
        type="button"
        onClick={() => {
          onRetry()
        }}
      >
        {t('retry')}
      </Retry>
    </Root>
  )
}

export default ErrorView
