import authEn from '@/features/auth/locales/en.json'
import authSr from '@/features/auth/locales/sr.json'
import messagesEn from '@/features/messages/locales/en.json'
import messagesSr from '@/features/messages/locales/sr.json'
import profileEn from '@/features/profile/locales/en.json'
import profileSr from '@/features/profile/locales/sr.json'
import projectsEn from '@/features/projects/locales/en.json'
import projectsSr from '@/features/projects/locales/sr.json'
import teamEn from '@/features/team/locales/en.json'
import teamSr from '@/features/team/locales/sr.json'
import technologiesEn from '@/features/technologies/locales/en.json'
import technologiesSr from '@/features/technologies/locales/sr.json'
import { STORAGE_KEYS } from '@/lib/storageKeys'
import commonEn from '@/locales/en.json'
import commonSr from '@/locales/sr.json'
import { createI18n } from '@app/i18n'

/**
 * Svi namespace-i se učitavaju odmah, bez lazy podele po ruti.
 *
 * `docs/09` traži lazy učitavanje uz feature chunk, i to važi za `apps/web` gde je 253
 * ključa u pet namespace-a. Admin ima tri, ukupno reda veličine 4 KB, i nema bundle
 * budžet — podela bi ovde bila složenost bez dobitka. Kad ih bude pet-šest, vredi vratiti.
 */
export const i18n = createI18n({
  resources: {
    sr: {
      common: commonSr,
      auth: authSr,
      projects: projectsSr,
      technologies: technologiesSr,
      profile: profileSr,
      team: teamSr,
      messages: messagesSr,
    },
    en: {
      common: commonEn,
      auth: authEn,
      projects: projectsEn,
      technologies: technologiesEn,
      profile: profileEn,
      team: teamEn,
      messages: messagesEn,
    },
  },
  storageKey: STORAGE_KEYS.LANGUAGE,
  defaultNS: 'common',
})
