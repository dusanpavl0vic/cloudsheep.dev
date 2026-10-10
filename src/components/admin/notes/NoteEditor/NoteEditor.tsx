'use client'

import NextLink from 'next/link'
import { useTranslations } from 'next-intl'

import FormGrid from '@/components/admin/FormGrid'
import ImageField from '@/components/admin/ImageField'
import ListStatus from '@/components/admin/ListStatus'
import PageHeader from '@/components/admin/PageHeader'
import Panel from '@/components/admin/Panel'
import Button from '@/components/buttons/Button'
import SegmentedControl from '@/components/buttons/SegmentedControl'
import Prose from '@/components/data-display/Prose'
import CheckboxField from '@/components/inputs/CheckboxField'
import TextField from '@/components/inputs/TextField'
import { LOCALES } from '@/constants/i18n'
import { noteHref, ROUTES } from '@/constants/routes'
import { useNoteEditor, useNotePage } from '@/hooks/admin/notes'
import { useKeyTranslator } from '@/hooks/useApiErrorMessage'
import type { AdminNote } from '@/types/note'

import { Bar, Form, Preview, Split } from './NoteEditor.styles'

const META = ['titleEn', 'titleSr', 'excerptEn', 'excerptSr'] as const

const NoteForm = ({ note }: { note: AdminNote | undefined }) => {
  const t = useTranslations('admin')
  const translate = useKeyTranslator()
  const editor = useNoteEditor(note)
  const { register } = editor.form
  const body = editor.bodyLocale === 'sr' ? 'bodySr' : 'bodyEn'

  return (
    <>
      <PageHeader
        title={t(editor.isEdit ? 'notes.editTitle' : 'notes.newTitle')}
        actions={
          <>
            <Button href={ROUTES.ADMIN_NOTES} linkComponent={NextLink} variant="ghost" iconLeft="arrowLeft">
              {t('notes.back')}
            </Button>
            {note?.isPublished && (
              <Button href={noteHref(note.slug)} variant="secondary" iconRight="arrowUpRight">
                {t('notes.view')}
              </Button>
            )}
          </>
        }
      />
      <Form noValidate onSubmit={(event) => void editor.submit(event)}>
        <Panel>
          <FormGrid>
            {META.map((field) => (
              <TextField key={field} id={`n-${field}`} label={t(`notes.${field}`)} error={translate(editor.errors[field]?.message)} {...register(field)} />
            ))}
            <TextField id="n-slug" label={t('notes.slug')} hint={t('notes.slugHint')} error={translate(editor.errors.slug?.message)} {...register('slug')} />
            <TextField id="n-tags" label={t('notes.tags')} hint={t('notes.tagsHint')} error={translate(editor.errors.tags?.message)} {...register('tags')} />
            <ImageField label={t('notes.cover')} url={editor.coverUrl} onChange={editor.setCover} />
            <CheckboxField label={t('notes.publish')} {...register('isPublished')} />
          </FormGrid>
        </Panel>
        <SegmentedControl
          label={t('notes.language')}
          value={editor.bodyLocale}
          onChange={editor.setBodyLocale}
          options={LOCALES.map((value) => ({ value, label: t(`common.${value}`) }))}
        />
        <Split>
          <TextField
            key={body}
            id={`n-${body}`}
            multiline
            label={t(`notes.${body}`)}
            hint={t('notes.bodyHint')}
            error={translate(editor.errors[body]?.message)}
            {...register(body)}
          />
          <Preview aria-label={t('notes.preview')}>
            <h2>{t('notes.preview')}</h2>
            <Prose html={editor.previewHtml} />
          </Preview>
        </Split>
        <Bar>
          <Button type="submit" size="l" loading={editor.isSubmitting}>
            {t('common.save')}
          </Button>
        </Bar>
      </Form>
    </>
  )
}

/** `/admin/notes/new` i `/admin/notes/[id]` — editor sa pregledom uživo. */
const NoteEditor = ({ noteId }: { noteId?: string }) => {
  const page = useNotePage(noteId)
  return (
    <ListStatus isLoading={page.isLoading} isError={page.isError || page.isMissing}>
      <NoteForm key={page.note?.id ?? 'new'} note={page.note} />
    </ListStatus>
  )
}

export default NoteEditor
