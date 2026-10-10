import { afterAll, beforeEach, vi } from 'vitest'

import { prisma } from '@/server/db'

/**
 * Next keš van Next-a nema gde da čuva — u testu `unstable_cache` samo poziva funkciju, a
 * `revalidateTag` se beleži da test može da proveri da je izmena osvežila stranicu.
 */
vi.mock('next/cache', () => ({
  unstable_cache: <T>(fn: T) => fn,
  revalidateTag: vi.fn(),
}))

/** Svaki test kreće od prazne baze (redosled poštuje strane ključeve). */
const TABLES = [
  'BookingSlot',
  'ContactMessage',
  'NewsletterSubscriber',
  'Testimonial',
  'Note',
  'ProjectImage',
  'ProjectTechnology',
  'CvSiteProject',
  'CvExperience',
  'CvLanguage',
  'Project',
  'Technology',
  'TeamMember',
  'SocialLink',
  'Profile',
  'RefreshToken',
  'User',
  'Asset',
]

beforeEach(async () => {
  await prisma.$executeRawUnsafe(`TRUNCATE ${TABLES.map((t) => `"${t}"`).join(', ')} CASCADE`)
})

afterAll(async () => {
  await prisma.$disconnect()
})
