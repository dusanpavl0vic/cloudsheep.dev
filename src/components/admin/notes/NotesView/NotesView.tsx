'use client'

import NextLink from 'next/link'
import { useTranslations } from 'next-intl'

import Badge from '@/components/admin/Badge'
import DataTable, { type DataColumn } from '@/components/admin/DataTable'
import ListStatus from '@/components/admin/ListStatus'
import PageHeader from '@/components/admin/PageHeader'
import RowActions from '@/components/admin/RowActions'
import Button from '@/components/buttons/Button'
import { adminNoteHref, ROUTES } from '@/constants/routes'
import { useNotes } from '@/hooks/admin/notes'

type NoteRow = ReturnType<typeof useNotes>['items'][number]

/** `/admin/notes` — beleške; naslov vodi u editor. */
const NotesView = () => {
  const t = useTranslations('admin')
  const notes = useNotes()

  const columns: DataColumn<NoteRow>[] = [
    {
      key: 'title',
      header: t('notes.title'),
      cell: (note) => (
        <NextLink href={adminNoteHref(note.id)}>
          <strong>{note.title}</strong>
        </NextLink>
      ),
    },
    { key: 'updated', header: t('notes.updated'), wide: true, cell: (note) => note.updated },
    {
      key: 'status',
      header: t('newsletter.status'),
      cell: (note) => (
        <Button variant="ghost" size="s" aria-pressed={note.isPublished} onClick={() => void notes.togglePublished(note)}>
          <Badge tone={note.isPublished ? 'success' : 'neutral'}>{t(note.isPublished ? 'common.published' : 'common.draft')}</Badge>
        </Button>
      ),
    },
    {
      key: 'actions',
      header: t('common.actions'),
      align: 'right',
      cell: (note) => <RowActions name={note.title} onDelete={() => void notes.remove(note)} />,
    },
  ]

  return (
    <>
      <PageHeader
        title={t('nav.notes')}
        lead={t('notes.lead')}
        actions={
          <Button href={ROUTES.ADMIN_NOTE_NEW} linkComponent={NextLink} iconLeft="plus">
            {t('notes.add')}
          </Button>
        }
      />
      <ListStatus isLoading={notes.isLoading} isError={notes.isError}>
        <DataTable rows={notes.items} columns={columns} rowKey={(note) => note.id} empty={t('common.empty')} caption={t('nav.notes')} />
      </ListStatus>
    </>
  )
}

export default NotesView
