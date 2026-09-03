import { z } from 'zod'

import { apiGet } from './apiClient'

/**
 * Podaci o vlasniku sajta i kontakt linkovi.
 *
 * Stoje u `lib/`, a ne u feature-u, jer ih koristi LJUSKA — podnožje je na svakoj ruti, a
 * `components/` ne sme da uvozi feature (docs/01 §2). Zamenjuju `CONTACT_EMAIL` i
 * `SOCIAL_LINKS` konstante iz `lib/navigation.ts`.
 */
const localizedSchema = z.object({ sr: z.string(), en: z.string() })

/**
 * Član tima. `diploma` je `null` kad u adminu nije čekirano da je ima — server tada
 * izostavlja ceo objekat, pa frontend ne mora da pogađa da li ima šta da prikaže.
 */
const teamMemberSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  role: localizedSchema,
  avatar: z.object({ url: z.string(), width: z.number(), height: z.number() }).nullable(),
  diploma: z
    .object({
      university: localizedSchema,
      degree: localizedSchema,
      programme: localizedSchema,
      faculty: localizedSchema,
      city: z.string(),
      /** `null` kad grb nije otpremljen — kartica se prikazuje bez pečata. */
      sealUrl: z.string().nullable(),
    })
    .nullable(),
})

const teamListSchema = z.object({ items: z.array(teamMemberSchema) })

export type TeamMember = z.infer<typeof teamMemberSchema>

const siteProfileSchema = z.object({
  profile: z
    .object({
      fullName: z.string(),
      location: z.string(),
      isAvailable: z.boolean(),
      headline: localizedSchema,
      bio: localizedSchema,
      university: localizedSchema,
      degree: localizedSchema,
    })
    .nullable(),
  links: z.array(
    z.object({
      id: z.string(),
      /** `github` | `linkedin` | `instagram` | `x` | `email` | … — bira ikonicu. */
      platform: z.string(),
      url: z.string(),
      label: z.string(),
    }),
  ),
})

export type SiteProfile = z.infer<typeof siteProfileSchema>
export type SiteLink = SiteProfile['links'][number]

export const fetchSite = (): Promise<SiteProfile> => apiGet('/profile', siteProfileSchema)

/** Vidljivi članovi tima, sortirani kako su poređani u adminu. */
export const fetchTeam = async (): Promise<TeamMember[]> =>
  (await apiGet('/team', teamListSchema)).items
