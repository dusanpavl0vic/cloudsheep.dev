import { useTranslation } from 'react-i18next'

import { SkeletonList } from '@/components/Skeleton'
import { useMessages } from '@/features/messages'
import { Button, EmptyState, PageHeader } from '@app/ui'

/** Stranica je SAMO kompozicija — nema state, nema selektora (docs/02). */
export function MessagesPage() {
  const { t, i18n } = useTranslation(['messages', 'common'])
  const { messages, unread, status, setStatus, toggleRead, removeMessage, isLoading, error } =
    useMessages()

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(value),
    )

  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-4">
        <PageHeader
          title={t('messages.title')}
          subtitle={
            unread > 0 ? t('messages.unreadCount', { count: unread }) : t('messages.subtitle')
          }
        />
        <div className="flex gap-2">
          {(['all', 'unread'] as const).map((value) => (
            <Button
              key={value}
              variant={status === value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setStatus(value)
              }}
            >
              {t(`messages.filters.${value}`)}
            </Button>
          ))}
        </div>
      </div>

      {isLoading && <SkeletonList rows={6} label={t('messages.loading')} />}
      {error && <p role="alert">{t('messages.loadError')}</p>}

      {!isLoading && !error && messages.length === 0 && (
        <EmptyState title={t('messages.empty.title')} description={t('messages.empty.body')} />
      )}

      <ul className="flex flex-col gap-3">
        {messages.map((message) => (
          <li
            key={message.id}
            className={
              message.isRead
                ? 'border-border bg-card rounded-xl border p-5'
                : 'border-primary/40 bg-card rounded-xl border p-5'
            }
          >
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className="text-foreground font-semibold">{message.name}</span>
              <a
                href={`mailto:${message.email}`}
                className="text-primary font-mono text-[13.5px] hover:brightness-110"
              >
                {message.email}
              </a>
              <span className="text-muted-foreground text-[13px]">
                {formatDate(message.createdAt)}
              </span>

              {/* Poruka postoji i kad mejl nije prošao — to je poenta upisa pre slanja */}
              {!message.wasEmailed && (
                <span
                  className="bg-destructive/15 text-destructive rounded-full px-2.5 py-0.5 text-[12.5px] font-semibold"
                  title={message.emailError ?? undefined}
                >
                  {t('messages.notEmailed')}
                </span>
              )}
            </div>

            {message.subject && (
              <p className="text-foreground mb-1 font-semibold">{message.subject}</p>
            )}
            <p className="text-muted-foreground mb-3 text-[15px] leading-relaxed whitespace-pre-line">
              {message.message}
            </p>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toggleRead(message)
                }}
              >
                {message.isRead ? t('messages.markUnread') : t('messages.markRead')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  removeMessage(message.id)
                }}
              >
                {t('common:common.delete')}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
