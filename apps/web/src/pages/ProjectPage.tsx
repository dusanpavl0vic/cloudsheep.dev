import { useTranslation } from 'react-i18next'
import { Link, useLoaderData } from 'react-router'

import { ProjectGallery, TechTags, localize, type Project } from '@/features/projects'
import { ROUTES, projectPath } from '@/lib/routes'
import { Button, Container, PageHeader, Reveal, TextLink } from '@app/ui'

export interface ProjectPageData {
  project: Project
  /** Sledeći po redosledu iz admina. `null` kad je projekat jedini. */
  next: Project | null
}

/**
 * Stranica projekta.
 *
 * **Studija slučaja je uklonjena, i to je popravka, ne gubitak.** Ranije su
 * `CASE_STUDY_HIGHLIGHTS`, `CASE_STUDY_STATS` i `CASE_STUDY_SECTIONS` bili JEDNA hardkodovana
 * priča (Atlasova) koja se renderovala ispod SVAKOG projekta — dakle sajt je za četiri od
 * pet projekata tvrdio neistinu. Isto važi za dugmad „GitHub" i „Demo uživo", koja su oba
 * vodila na `#top`; sada vode na prave adrese ili ih nema.
 */
export const ProjectPage = () => {
  const { t, i18n } = useTranslation(['projects', 'common'])
  const { project, next } = useLoaderData<ProjectPageData>()

  const lang = i18n.language

  return (
    <Container as="article" width="article" className="pt-20 pb-24">
      <PageHeader
        title={localize(project.title, lang)}
        backLink={
          <TextLink asChild className="border-b-0">
            <Link to={ROUTES.PROJECTS}>← {t('caseStudy.allProjects')}</Link>
          </TextLink>
        }
        className="mb-4"
      />

      <div className="text-faint mb-4 flex flex-wrap items-center gap-3 font-mono text-[13px]">
        <span className="text-primary">{localize(project.cat, lang)}</span>
        <span>·</span>
        <span>{project.year}</span>
      </div>

      <TechTags technologies={project.technologies} className="mb-11" />

      <ProjectGallery images={project.images} layout={project.galleryLayout} language={lang} />

      <Reveal as="section" className="mx-auto mb-16 max-w-[720px]">
        <p className="text-muted-foreground text-[17px] leading-relaxed text-pretty">
          {localize(project.desc, lang)}
        </p>
      </Reveal>

      {(project.liveUrl ?? project.repoUrl) && (
        <div className="mx-auto mb-16 flex max-w-[720px] flex-wrap items-center gap-3.5">
          {project.repoUrl && (
            <Button asChild variant="outline" shape="pill" size="sm">
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                {t('caseStudy.github')} ↗
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button asChild shape="pill" size="sm">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                {t('caseStudy.liveDemo')} ↗
              </a>
            </Button>
          )}
        </div>
      )}

      {next && (
        <div className="border-border flex items-center justify-between gap-4 border-t pt-8">
          <span className="text-faint font-mono text-xs">{t('caseStudy.nextUp')}</span>
          <Link
            to={projectPath(next.slug)}
            className="font-heading text-foreground hover:text-primary text-[22px] font-semibold tracking-tight transition-colors"
          >
            {localize(next.title, lang)} →
          </Link>
        </div>
      )}
    </Container>
  )
}
