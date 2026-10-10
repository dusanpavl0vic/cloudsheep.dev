import type { ImageRef } from './media'
import type { Technology } from './technology'

export const PROJECT_CATEGORIES = ['frontend', 'backend', 'fullStack', 'openSource'] as const
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]

export const GALLERY_LAYOUTS = ['grid', 'feature', 'none'] as const
export type GalleryLayout = (typeof GALLERY_LAYOUTS)[number]

export const DEVICE_KINDS = ['phone', 'browser'] as const
export type DeviceKind = (typeof DEVICE_KINDS)[number]

/** Merljiv rezultat na kartici i studiji slučaja („40%" · „brže učitavanje"). */
export interface ProjectMetric {
  value: string
  label: string
}

export interface ProjectChapter {
  title: string
  body: string
}

/** Kartica projekta — već na jeziku stranice (javni API ne šalje oba jezika). */
export interface ProjectSummary {
  id: string
  slug: string
  category: ProjectCategory
  year: number
  title: string
  /** Potpis ispod naslova („full-stack · mobilne"). */
  tagline: string
  description: string
  isFeatured: boolean
  cover: ImageRef | null
  metric: ProjectMetric | null
  technologies: Technology[]
}

export interface ProjectDetail extends ProjectSummary {
  role: string
  timeline: string
  client: string
  caption: string
  metrics: ProjectMetric[]
  chapters: ProjectChapter[]
  growth: number[]
  galleryLayout: GalleryLayout
  gallery: ImageRef[]
  screens: Record<DeviceKind, ImageRef[]>
  liveUrl: string | null
  repoUrl: string | null
  next: { slug: string; title: string } | null
}

/** Dvojezična polja admin forme (ravna, jer puni formu). */
export interface LocalizedMetric {
  value: string
  labelSr: string
  labelEn: string
}

export interface LocalizedChapter {
  titleSr: string
  titleEn: string
  bodySr: string
  bodyEn: string
}

export interface AdminProjectImage {
  id: string
  assetId: string
  url: string
  width: number
  height: number
  altSr: string
  altEn: string
  device: DeviceKind | null
  sortOrder: number
}

export interface AdminProject {
  id: string
  slug: string
  category: ProjectCategory
  year: number
  sortOrder: number
  isFeatured: boolean
  isPublished: boolean
  galleryLayout: GalleryLayout
  liveUrl: string | null
  repoUrl: string | null
  titleSr: string
  titleEn: string
  catSr: string
  catEn: string
  descSr: string
  descEn: string
  captionSr: string
  captionEn: string
  roleSr: string
  roleEn: string
  timelineSr: string
  timelineEn: string
  client: string
  metrics: LocalizedMetric[]
  chapters: LocalizedChapter[]
  growth: number[]
  technologyIds: string[]
  technologies: Technology[]
  images: AdminProjectImage[]
  updatedAt: string
}
