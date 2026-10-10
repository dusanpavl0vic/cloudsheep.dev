import { useTranslations } from 'next-intl'

import Section from '@/components/sections/Section'
import SectionHeader from '@/components/sections/SectionHeader'
import { countByCategory } from '@/helpers/projects'
import type { ProjectCategory, ProjectSummary } from '@/types/project'

import CategoryFilter from '../CategoryFilter'
import ProjectCard from '../ProjectCard'
import { Empty, Grid } from './ProjectsView.styles'

interface ProjectsViewProps {
  projects: ProjectSummary[]
  /** Iz `?category=`; `null` — svi. */
  category: ProjectCategory | null
}

/** Prve kartice su iznad fold-a (jedan red na desktopu) — slike bez lenjog učitavanja. */
const EAGER_CARDS = 2

/** `/projects` — svi objavljeni projekti, filter po kategoriji u URL-u. */
const ProjectsView = ({ projects, category }: ProjectsViewProps) => {
  const t = useTranslations('projects')
  const shown = category ? projects.filter((project) => project.category === category) : projects

  return (
    <Section spacing="default">
      <SectionHeader as="h1" eyebrow={t('eyebrow')} title={t('title')} muted={t('muted')} />
      <CategoryFilter counts={countByCategory(projects)} total={projects.length} active={category} />
      {shown.length === 0 ? (
        <Empty>{t('empty')}</Empty>
      ) : (
        <Grid>
          {shown.map((project, index) => (
            <li key={project.id}>
              <ProjectCard project={project} eager={index < EAGER_CARDS} />
            </li>
          ))}
        </Grid>
      )}
    </Section>
  )
}

export default ProjectsView
