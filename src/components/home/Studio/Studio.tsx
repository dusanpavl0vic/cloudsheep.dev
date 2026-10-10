import { useTranslations } from 'next-intl'

import Section from '@/components/sections/Section'
import SectionHeader from '@/components/sections/SectionHeader'
import { EFFECT_ATTRS } from '@/constants/effects'
import { HOME_SECTIONS } from '@/constants/routes'

import { Bio } from './Studio.styles'
import type { StudioProps } from './Studio.types'
import TeamCarousel from './TeamCarousel'

/** „Jedan čovek, ceo proizvod." — izjava iz profila, biografija i karusel tima sa diplomama. */
const Studio = ({ profile, team }: StudioProps) => {
  const t = useTranslations('home.studio')

  return (
    <Section id={HOME_SECTIONS.STUDIO} labelledBy="studio-title" align="center" spacing="loose">
      <SectionHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        muted={t('muted')}
        lead={profile?.headline.length ? profile.headline : t('headline')}
        leadTone="statement"
        titleId="studio-title"
        align="center"
      />
      {profile?.bio && <Bio {...{ [EFFECT_ATTRS.reveal]: '' }}>{profile.bio}</Bio>}
      {team.length > 0 && (
        <TeamCarousel
          team={team}
          labels={{
            previous: t('previous'),
            next: t('next'),
            noDiploma: t('noDiploma'),
            show: team.map((member) => t('show', { name: member.fullName })),
          }}
        />
      )}
    </Section>
  )
}

export default Studio
