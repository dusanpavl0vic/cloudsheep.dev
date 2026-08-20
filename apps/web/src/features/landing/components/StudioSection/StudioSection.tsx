import { useTranslation } from 'react-i18next'

import { TeamCarousel } from '@/features/landing/components/TeamCarousel'
import { localize } from '@/features/projects'
import { SECTION_IDS } from '@/lib/navigation'
import type { SiteProfile, TeamMember } from '@/lib/site'
import { SectionBlock } from '@app/ui'

import {
  studioBodyVariants,
  studioLeadVariants,
  studioTextVariants,
} from './StudioSection.variants'

/**
 * Ko drži proizvod.
 *
 * Ranije je sekcija nosila i četiri brojke i četiri reda tagova. Oboje je izašlo: brojke
 * su prešle u traku ispod hero-a, tehnologije u mrežu logotipa. Isti podatak na tri mesta
 * nije naglasak nego šum, a sekcija je zbog njega gubila ono jedino što samo ona ima —
 * rečenicu o tome ko radi posao.
 *
 * Na kraju je stajala i pilula „primam projekte za Q3". Nju je zamenio pečat sa diplomom:
 * kvartal zastari za tri meseca i sajt izgleda napušteno, a zvanje ne zastareva. Isti podatak
 * je ranije stajao i u `studio.lead`, pa je odatle skraćen — pečat ga sada nosi jednom.
 */
interface StudioSectionProps {
  profile: SiteProfile['profile']
  team: readonly TeamMember[]
}

export const StudioSection = ({ profile, team }: StudioSectionProps) => {
  const { t, i18n } = useTranslation('landing')

  const headline = profile ? localize(profile.headline, i18n.language) : ''
  const bio = profile ? localize(profile.bio, i18n.language) : ''

  return (
    <SectionBlock
      id={SECTION_IDS.STUDIO}
      eyebrow={t('studio.eyebrow')}
      title={t('studio.titleTop')}
      muted={t('studio.titleMuted')}
      align="center"
    >
      <div className={studioBodyVariants()}>
        {/* Tekst dolazi iz profila u bazi, ne iz i18n: sa timom od više ljudi kopija
            „jednočlani studio" prestaje da bude tačna, a menja se u adminu. */}
        {headline && <p className={studioLeadVariants()}>{headline}</p>}
        {bio && <p className={studioTextVariants()}>{bio}</p>}
      </div>

      {/* Karusel je IZVAN uže tekstualne kolone: kartice diplome su šire od 680px */}
      <div className="mt-10">
        <TeamCarousel members={team} />
      </div>
    </SectionBlock>
  )
}
