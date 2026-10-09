'use client'

import { useLocale, useTranslations } from 'next-intl'

import Badge from '@/components/admin/Badge'
import Button from '@/components/buttons/Button'
import { formatDate } from '@/helpers/date'
import type { AdminMessage } from '@/types/contact'

import { Actions, Body, Date, Facts, Name, Root, Subject, Summary, Text, Warning } from './MessageCard.styles'

interface MessageCardProps {
  message: AdminMessage
  onOpen: () => void
  onToggleRead: () => void
  onDelete: () => void
}

const DATE_TIME = { dateStyle: 'medium', timeStyle: 'short' } as const

/** Jedan upit: sažetak u redu, ceo upit na klik (`<details>`, bez stanja). */
const MessageCard = ({ message, onOpen, onToggleRead, onDelete }: MessageCardProps) => {
  const t = useTranslations('admin.messages')
  const tc = useTranslations('contact')
  const common = useTranslations('admin.common')
  const locale = useLocale()
  const has = (key: string) => tc.has(key as never)
  const label = (key: string) => (has(key) ? tc(key as never) : common('none'))

  return (
    <Root
      onToggle={(event) => {
        if (event.currentTarget.open) onOpen()
      }}
    >
      <Summary>
        <Name>
          {message.name}
          {!message.isRead && <Badge tone="accent">{t('new')}</Badge>}
        </Name>
        <Date>{formatDate(message.createdAt, locale, DATE_TIME)}</Date>
        <Subject>{message.subject || message.message}</Subject>
      </Summary>
      <Body>
        <Facts>
          <div>
            <dt>{tc('summary.type')}</dt>
            <dd>{label(`types.${message.projectType}.label`)}</dd>
          </div>
          <div>
            <dt>{tc('summary.budget')}</dt>
            <dd>{label(`budgets.${message.budget}`)}</dd>
          </div>
          <div>
            <dt>{tc('summary.timeline')}</dt>
            <dd>{label(`timelines.${message.timeline}`)}</dd>
          </div>
          <div>
            <dt>{tc('summary.call')}</dt>
            <dd>{message.bookedAt ? formatDate(message.bookedAt, locale, DATE_TIME) : tc('summary.noCall')}</dd>
          </div>
        </Facts>
        <Text>{message.message}</Text>
        {!message.wasEmailed && <Warning>{t('mailFailed')}</Warning>}
        <Actions>
          <Button href={`mailto:${message.email}`} size="s" iconLeft="mail">
            {t('reply')} · {message.email}
          </Button>
          <Button variant="secondary" size="s" onClick={onToggleRead}>
            {t(message.isRead ? 'markUnread' : 'markRead')}
          </Button>
          <Button variant="ghost" size="s" onClick={onDelete}>
            {common('delete')}
          </Button>
        </Actions>
      </Body>
    </Root>
  )
}

export default MessageCard
