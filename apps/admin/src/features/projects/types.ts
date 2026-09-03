/**
 * Vrednosti se poklapaju sa `ProjectCategory` enumom u Prisma šemi i sa i18n ključevima
 * na javnom sajtu (`projects.filters.fullStack`). Ručno napisana unija, kao i `AuthRole` —
 * generisanje tipova sa servera ne postoji i nije uvedeno zbog jednog enuma.
 */
export const PROJECT_CATEGORIES = ['frontend', 'backend', 'fullStack', 'openSource'] as const

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]

/**
 * Oblik koji vraća `/admin/projects` — ravan, jer puni formu.
 *
 * Javni API isti projekat vraća ugnežđeno (`title.sr`), jer se tamo prikazuje.
 */
export const GALLERY_LAYOUTS = ['grid', 'feature', 'none'] as const

export type GalleryLayout = (typeof GALLERY_LAYOUTS)[number]

export interface ProjectTechnology {
  id: string
  slug: string
  label: string
  group: string
  logoUrl: string | null
}

export interface ProjectImage {
  id: string
  url: string
  width: number
  height: number
  altSr: string
  altEn: string
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
  technologyIds: string[]
  technologies: ProjectTechnology[]
  images: ProjectImage[]
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
  updatedAt: string
}

export interface ProjectListResponse {
  items: AdminProject[]
}
