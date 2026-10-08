import type { ImageRef } from './media'

export interface NoteSummary {
  id: string
  slug: string
  title: string
  excerpt: string
  tags: string[]
  cover: ImageRef | null
  /** ISO datum objave. */
  publishedAt: string
  readMinutes: number
}

export interface NoteDetail extends NoteSummary {
  /** HTML iz markdown-a, napravljen na serveru (sirov HTML iz izvora je ekraniran). */
  html: string
  updatedAt: string
}

export interface AdminNote {
  id: string
  slug: string
  titleSr: string
  titleEn: string
  excerptSr: string
  excerptEn: string
  bodySr: string
  bodyEn: string
  tags: string[]
  coverId: string | null
  coverUrl: string | null
  isPublished: boolean
  publishedAt: string | null
  updatedAt: string
}
