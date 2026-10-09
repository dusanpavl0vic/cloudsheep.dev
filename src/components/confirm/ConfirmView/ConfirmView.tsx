import { useTranslations } from 'next-intl'

import Button from '@/components/buttons/Button'
import Icon from '@/components/foundations/Icon'
import TextLink from '@/components/navigation/TextLink'
import type { ConfirmStatus } from '@/constants/confirmation'

import { Body, Card, Detail, Form, Mark, Root, Title } from './ConfirmView.styles'

interface ConfirmViewProps {
  kind: 'brief' | 'newsletter'
  state: 'pending' | ConfirmStatus
  /** Samo dok čeka potvrdu: token i jezik idu skriveni u formi. */
  form?: { action: string; token: string; locale: string }
  /** Šta se potvrđuje (upit): „Marko · Web aplikacija", termin. */
  details?: string[]
  backHref: string
}

/**
 * Stranica potvrde adrese (ADR 0016). Pre klika: šta se potvrđuje i dugme — obična forma sa
 * `POST`-om, jer skeneri pošte otvaraju linkove (`GET`) sami. Posle: ishod.
 */
const ConfirmView = ({ kind, state, form, details = [], backHref }: ConfirmViewProps) => {
  const t = useTranslations(`confirm.${kind}`)

  if (state === 'pending' && form) {
    return (
      <Root>
        <Card>
          <Title>{t('title')}</Title>
          <Body>{t('lead')}</Body>
          {details.map((line) => (
            <Detail key={line}>{line}</Detail>
          ))}
          <Form method="post" action={form.action}>
            <input type="hidden" name="token" value={form.token} />
            <input type="hidden" name="locale" value={form.locale} />
            <Button type="submit" size="l" iconRight="arrowRight">
              {t('button')}
            </Button>
          </Form>
        </Card>
      </Root>
    )
  }

  const result = state === 'pending' ? 'invalid' : state
  return (
    <Root>
      <Card role="status">
        {result === 'confirmed' && (
          <Mark aria-hidden="true">
            <Icon name="check" size={26} />
          </Mark>
        )}
        <Title>{t(`${result}.title`)}</Title>
        <Body>{t(`${result}.body`)}</Body>
        <TextLink href={backHref} iconLeft="arrowLeft" icon={null}>
          {t('again')}
        </TextLink>
      </Card>
    </Root>
  )
}

export default ConfirmView
