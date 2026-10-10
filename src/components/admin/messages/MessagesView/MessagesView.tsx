'use client'

import { useTranslations } from 'next-intl'

import PageHeader from '@/components/admin/PageHeader'
import SegmentedControl from '@/components/buttons/SegmentedControl'
import { useMessages, type MessageFilter } from '@/hooks/admin/messages'

import MessageCard from '../MessageCard'
import { List, Status } from './MessagesView.styles'

/** `/admin/messages` — potvrđeni upiti, najnoviji prvi. */
const MessagesView = ({ status }: { status: MessageFilter }) => {
  const t = useTranslations('admin')
  const messages = useMessages(status)

  const body = (() => {
    if (messages.isLoading) return <Status role="status">{t('common.loading')}</Status>
    if (messages.isError) return <Status role="alert">{t('common.loadFailed')}</Status>
    if (messages.items.length === 0) return <Status>{t(status === 'unread' ? 'messages.emptyUnread' : 'messages.empty')}</Status>
    return (
      <List>
        {messages.items.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            onOpen={() => {
              messages.opened(message)
            }}
            onToggleRead={() => void messages.toggleRead(message)}
            onDelete={() => void messages.remove(message)}
          />
        ))}
      </List>
    )
  })()

  return (
    <>
      <PageHeader
        title={t('nav.messages')}
        lead={`${t('messages.lead')} ${t('messages.unread', { count: messages.unread })}.`}
        actions={
          <SegmentedControl
            label={t('messages.filter.label')}
            value={status}
            onChange={messages.setFilter}
            options={[
              { value: 'all', label: t('messages.filter.all') },
              { value: 'unread', label: t('messages.filter.unread') },
            ]}
          />
        }
      />
      {body}
    </>
  )
}

export default MessagesView
