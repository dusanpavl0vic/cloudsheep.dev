import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Container, PageHeader, Reveal, cn } from '@app/ui'


import { ProjectCard } from './components/ProjectCard'
import { PROJECT_CATEGORIES, PROJECTS, type ProjectCategory } from './projects.constants'

const filterButtonClass = (active: boolean) =>
  cn(
    'rounded-full border px-4 py-1.5 text-[13.5px] font-semibold transition-colors',
    active
      ? 'border-foreground bg-foreground text-background'
      : 'border-border-strong text-muted-foreground hover:border-foreground hover:text-foreground',
  )

export const ProjectsPage = () => {
  const { t } = useTranslation()
  const [active, setActive] = useState<ProjectCategory>('all')

  // Izvedena vrednost — filtriranje tokom rendera, bez useEffect-a (PROJECT_GUIDE 2.1)
  const visible = useMemo(
    () => (active === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === active)),
    [active],
  )

  return (
    <>
      <Container width="content" className="pt-22 pb-10">
        <Reveal>
          <PageHeader
            eyebrow={t('projects.eyebrow')}
            title={t('projects.title')}
            subtitle={t('projects.subtitle')}
          />
        </Reveal>
      </Container>

      <div className="sticky top-[71px] z-50 border-y border-border bg-background/86 backdrop-blur-md">
        <Container width="content" className="flex flex-wrap gap-2.5 py-3.5">
          {PROJECT_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => { setActive(category); }}
              className={filterButtonClass(category === active)}
            >
              {t(`projects.filters.${category}`)}
            </button>
          ))}
        </Container>
      </div>

      <Container width="content" className="pt-12 pb-24">
        {visible.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project) => (
              <Reveal key={project.slug} className="h-full">
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="py-20 text-center font-mono text-sm text-faint">{t('projects.empty')}</p>
        )}
      </Container>
    </>
  )
}
