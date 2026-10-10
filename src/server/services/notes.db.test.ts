import { describe, expect, it } from 'vitest'

import { createNote, getPublishedNote, listPublishedNotes, updateNote } from './notes'

const base = {
  slug: 'prva-beleska',
  titleSr: 'Prva beleška',
  titleEn: 'First note',
  excerptSr: '',
  excerptEn: 'Excerpt',
  bodySr: 'Telo **beleške**.',
  bodyEn: 'Note **body**.',
  tags: ['Process'],
  coverId: null,
}

describe('notes', () => {
  it('skica nije javna', async () => {
    await createNote({ ...base, isPublished: false })
    expect(await listPublishedNotes('en')).toHaveLength(0)
    expect(await getPublishedNote('prva-beleska', 'en')).toBeNull()
  })

  it('objavljena beleška ima HTML na jeziku stranice', async () => {
    await createNote({ ...base, isPublished: true })
    const note = await getPublishedNote('prva-beleska', 'sr')
    expect(note?.title).toBe('Prva beleška')
    expect(note?.html).toContain('<strong>beleške</strong>')
    // prazan srpski sažetak pada na engleski
    expect(note?.excerpt).toBe('Excerpt')
  })

  it('publishedAt se postavlja pri prvom objavljivanju i posle se ne menja', async () => {
    const draft = await createNote({ ...base, isPublished: false })
    const published = await updateNote(draft.id, { isPublished: true })
    await updateNote(draft.id, { isPublished: false })
    const republished = await updateNote(draft.id, { isPublished: true })

    expect(published.publishedAt).not.toBeNull()
    expect(republished.publishedAt).toBe(published.publishedAt)
  })
})
