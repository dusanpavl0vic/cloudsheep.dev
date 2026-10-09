import { useLocale, useTranslations } from 'next-intl'

import Cover from '@/components/media/Cover'
import { EFFECT_ATTRS } from '@/constants/effects'
import { noteHref } from '@/constants/routes'
import { formatDate } from '@/helpers/date'
import type { NoteSummary } from '@/types/note'

import { Body, Excerpt, Meta, Root, Tag, Title, TitleLink } from './NoteCard.styles'

interface NoteCardProps {
  note: NoteSummary
  eager?: boolean
}

/** Kartica beleške: slika, oznaka, datum · trajanje čitanja, naslov (link), sažetak. */
const NoteCard = ({ note, eager = false }: NoteCardProps) => {
  const t = useTranslations('notes')
  const locale = useLocale()

  return (
    <Root {...{ [EFFECT_ATTRS.reveal]: '' }}>
      <Cover image={note.cover} fallbackAlt={t('coverAlt', { title: note.title })} ratio="16 / 10" radius={14} eager={eager} />
      <Body>
        <Meta>
          <Tag>{note.tags[0] ?? ''}</Tag>
          <span>
            <time dateTime={note.publishedAt}>{formatDate(note.publishedAt, locale)}</time>
            {` · ${t('readMinutes', { count: note.readMinutes })}`}
          </span>
        </Meta>
        <Title>
          <TitleLink href={noteHref(note.slug)}>{note.title}</TitleLink>
        </Title>
        <Excerpt>{note.excerpt}</Excerpt>
      </Body>
    </Root>
  )
}

export default NoteCard
