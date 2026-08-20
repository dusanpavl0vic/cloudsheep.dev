import type {
  Asset,
  GalleryLayout,
  MediaSide,
  Project,
  ProjectImage,
  Technology,
} from '@prisma/client'

import { publicUrl } from './uploads.ts'

/**
 * Dvojezično polje. API vraća OBA jezika u istom odgovoru, pa prebacivanje jezika na sajtu
 * ne izaziva nijedan novi zahtev — cena je nekoliko kilobajta u telu odgovora.
 */
interface Localized {
  sr: string
  en: string
}

/** Projekat sa svim vezama koje serijalizacija traži. */
export type ProjectWithRelations = Project & {
  technologies: { sortOrder: number; technology: Technology & { logo: Asset | null } }[]
  images: (ProjectImage & { asset: Asset })[]
}

/** Prisma `include` koji odgovara `ProjectWithRelations`. Jedno mesto, da se ne razidu. */
export const projectInclude = {
  technologies: {
    include: { technology: { include: { logo: true } } },
    orderBy: { sortOrder: 'asc' },
  },
  images: { include: { asset: true }, orderBy: { sortOrder: 'asc' } },
} as const

export interface PublicTechnology {
  id: string
  slug: string
  label: string
  group: string
  /** `null` kad logotip nije otpremljen — pločica se tada prikazuje samo kao naziv. */
  logoUrl: string | null
}

export interface PublicImage {
  id: string
  url: string
  /** Bez dimenzija `<img>` poskakuje dok se učitava (docs/07 §7). */
  width: number
  height: number
  alt: Localized
}

export interface PublicProject {
  id: string
  slug: string
  category: Project['category']
  year: number
  isFeatured: boolean
  mediaSide: MediaSide
  galleryLayout: GalleryLayout
  liveUrl: string | null
  repoUrl: string | null
  title: Localized
  cat: Localized
  desc: Localized
  caption: Localized
  technologies: PublicTechnology[]
  images: PublicImage[]
}

export const publicTechnology = (t: Technology & { logo: Asset | null }): PublicTechnology => ({
  id: t.id,
  slug: t.slug,
  label: t.label,
  group: t.group,
  logoUrl: t.logo ? publicUrl(t.logo.storageKey) : null,
})

const publicImage = (i: ProjectImage & { asset: Asset }): PublicImage => ({
  id: i.id,
  url: publicUrl(i.asset.storageKey),
  width: i.asset.width,
  height: i.asset.height,
  alt: { sr: i.altSr, en: i.altEn },
})

/**
 * Granica serijalizacije za javni API.
 *
 * Nabrajanje polja je namerno — `res.json(project)` bi propustio svako novo polje čim se
 * pojavi u šemi, uključujući i ono koje ne treba da izađe napolje.
 */
export const publicProject = (p: ProjectWithRelations): PublicProject => ({
  id: p.id,
  slug: p.slug,
  category: p.category,
  year: p.year,
  isFeatured: p.isFeatured,
  mediaSide: p.mediaSide,
  galleryLayout: p.galleryLayout,
  liveUrl: p.liveUrl,
  repoUrl: p.repoUrl,
  title: { sr: p.titleSr, en: p.titleEn },
  cat: { sr: p.catSr, en: p.catEn },
  desc: { sr: p.descSr, en: p.descEn },
  caption: { sr: p.captionSr, en: p.captionEn },
  technologies: p.technologies.map((pt) => publicTechnology(pt.technology)),
  images: p.images.map(publicImage),
})

/**
 * Admin oblik je RAVAN (`titleSr`), a ne ugnežđen kao javni (`title.sr`).
 *
 * Namerno se razlikuju jer služe različitim stvarima: javni oblik se prikazuje, pa mu
 * odgovara grupisanje po polju; admin oblik puni formu, a forma ima ravna polja.
 */
export interface AdminProject {
  id: string
  slug: string
  category: Project['category']
  year: number
  sortOrder: number
  isFeatured: boolean
  isPublished: boolean
  mediaSide: MediaSide
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
  /** Samo id-evi — forma bira iz spiska tehnologija, ne kuca nazive. */
  technologyIds: string[]
  technologies: PublicTechnology[]
  images: (PublicImage & { altSr: string; altEn: string; sortOrder: number })[]
  updatedAt: Date
}

export const adminProject = (p: ProjectWithRelations): AdminProject => ({
  id: p.id,
  slug: p.slug,
  category: p.category,
  year: p.year,
  sortOrder: p.sortOrder,
  isFeatured: p.isFeatured,
  isPublished: p.isPublished,
  mediaSide: p.mediaSide,
  galleryLayout: p.galleryLayout,
  liveUrl: p.liveUrl,
  repoUrl: p.repoUrl,
  titleSr: p.titleSr,
  titleEn: p.titleEn,
  catSr: p.catSr,
  catEn: p.catEn,
  descSr: p.descSr,
  descEn: p.descEn,
  captionSr: p.captionSr,
  captionEn: p.captionEn,
  technologyIds: p.technologies.map((pt) => pt.technology.id),
  technologies: p.technologies.map((pt) => publicTechnology(pt.technology)),
  images: p.images.map((i) => ({
    ...publicImage(i),
    altSr: i.altSr,
    altEn: i.altEn,
    sortOrder: i.sortOrder,
  })),
  updatedAt: p.updatedAt,
})
