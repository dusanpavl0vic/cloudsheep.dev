import type { ImageRef } from './media'

export interface Testimonial {
  id: string
  quote: string
  authorName: string
  authorRole: string
  company: string
  avatar: ImageRef | null
  project: { slug: string; title: string } | null
}

export interface AdminTestimonial {
  id: string
  quoteSr: string
  quoteEn: string
  authorName: string
  authorRoleSr: string
  authorRoleEn: string
  company: string
  avatarId: string | null
  avatarUrl: string | null
  projectId: string | null
  sortOrder: number
  isPublished: boolean
}
