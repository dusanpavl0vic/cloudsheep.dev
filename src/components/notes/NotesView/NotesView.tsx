import { useTranslations } from 'next-intl'

import Section from '@/components/sections/Section'
import SectionHeader from '@/components/sections/SectionHeader'
import type { NoteSummary } from '@/types/note'

import NoteCard from '../NoteCard'
import { Empty, Grid } from './NotesView.styles'

/** Prve kartice su iznad fold-a — slike bez lenjog učitavanja. */
const EAGER_CARDS = 3

/** `/notes` — sve objavljene beleške, najnovije prve. */
const NotesView = ({ notes }: { notes: NoteSummary[] }) => {
  const t = useTranslations('notes')

  return (
    <Section>
      <SectionHeader as="h1" eyebrow={t('eyebrow')} title={t('title')} muted={t('muted')} />
      {notes.length === 0 ? (
        <Empty>{t('empty')}</Empty>
      ) : (
        <Grid>
          {notes.map((note, index) => (
            <li key={note.id}>
              <NoteCard note={note} eager={index < EAGER_CARDS} />
            </li>
          ))}
        </Grid>
      )}
    </Section>
  )
}

export default NotesView
