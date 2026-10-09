import { useLocale, useTranslations } from 'next-intl'

import Cover from '@/components/media/Cover'
import TextLink from '@/components/navigation/TextLink'
import { ROUTES } from '@/constants/routes'
import { formatDate } from '@/helpers/date'
import type { NoteDetail, NoteSummary } from '@/types/note'

import NoteCard from '../NoteCard'
import { Article, Column, Lead, Meta, More, MoreGrid, Prose, Tag, Title } from './NoteView.styles'

interface NoteViewProps {
  note: NoteDetail
  /** Druge beleške za kraj stranice (do tri). */
  others: NoteSummary[]
}

/** `/notes/[slug]` — beleška: zaglavlje, naslovna slika, telo iz markdown-a, još beleški. */
const NoteView = ({ note, others }: NoteViewProps) => {
  const t = useTranslations('notes')
  const locale = useLocale()
  const date = (iso: string) => formatDate(iso, locale, { dateStyle: 'long' })
  const wasUpdated = note.updatedAt.slice(0, 10) > note.publishedAt.slice(0, 10)

  return (
    <Article>
      <Column>
        <TextLink href={ROUTES.NOTES} iconLeft="arrowLeft" icon={null} tone="muted">
          {t('back')}
        </TextLink>
        <Meta>
          {note.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          <time dateTime={note.publishedAt}>{t('published', { date: date(note.publishedAt) })}</time>
          {wasUpdated && <time dateTime={note.updatedAt}>{t('updated', { date: date(note.updatedAt) })}</time>}
          <span>{t('readMinutes', { count: note.readMinutes })}</span>
        </Meta>
        <Title>{note.title}</Title>
        <Lead>{note.excerpt}</Lead>
      </Column>
      {note.cover && <Cover image={note.cover} fallbackAlt={t('coverAlt', { title: note.title })} ratio="16 / 8" radius={24} eager />}
      <Column>
        {/* Drugo od dva mesta sa sirovim HTML-om (docs/20 §1): markdown renderovan na serveru, ekraniran. */}
        <Prose dangerouslySetInnerHTML={{ __html: note.html }} />
      </Column>
      {others.length > 0 && (
        <More aria-labelledby="more-notes">
          <h2 id="more-notes">{t('more')}</h2>
          <MoreGrid>
            {others.map((other) => (
              <li key={other.id}>
                <NoteCard note={other} />
              </li>
            ))}
          </MoreGrid>
        </More>
      )}
    </Article>
  )
}

export default NoteView
