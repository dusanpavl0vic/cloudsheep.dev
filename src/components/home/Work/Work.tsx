import { useTranslations } from 'next-intl'

import TextLink from '@/components/navigation/TextLink'
import Section from '@/components/sections/Section'
import SectionHeader from '@/components/sections/SectionHeader'
import { HOME_SECTIONS, ROUTES } from '@/constants/routes'
import { pickFeatured } from '@/helpers/projects'
import type { ProjectSummary } from '@/types/project'

import FeaturedProject from './FeaturedProject'
import { FEATURED_COUNT } from './Work.constants'
import { Head, List } from './Work.styles'

interface WorkProps {
  projects: ProjectSummary[]
}

/** „Dokazi, ne obećanja." — tri istaknuta projekta, naizmenično. Bez projekata sekcije nema. */
const Work = ({ projects }: WorkProps) => {
  const t = useTranslations('home.work')
  const featured = pickFeatured(projects, FEATURED_COUNT)
  if (featured.length === 0) return null

  return (
    <Section id={HOME_SECTIONS.WORK} labelledBy="work-title">
      <Head>
        <SectionHeader eyebrow={t('eyebrow')} title={t('title')} muted={t('muted')} titleId="work-title" />
        <TextLink href={ROUTES.PROJECTS} underline>
          {t('allCases')}
        </TextLink>
      </Head>
      <List>
        {featured.map((project, index) => (
          <FeaturedProject key={project.id} project={project} index={index} />
        ))}
      </List>
    </Section>
  )
}

export default Work
