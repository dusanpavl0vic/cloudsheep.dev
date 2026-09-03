import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { WorkItem } from '@/components/WorkItem'
import { localize, type Project } from '@/features/projects'
import { SECTION_IDS } from '@/lib/navigation'
import { ROUTES, projectPath } from '@/lib/routes'
import { SectionBlock, TextLink } from '@app/ui'

interface WorkSectionProps {
  /** Izdvojeni projekti sa API-ja. Broj više nije fiksan — nekad ih je tri, nekad ni jedan. */
  projects: readonly Project[]
}

/** Naslovna slika projekta; `galleryLayout: 'none'` znači da je namerno nema. */
const coverUrl = (project: Project): string | undefined =>
  project.galleryLayout === 'none' ? undefined : project.images[0]?.url

export const WorkSection = ({ projects }: WorkSectionProps) => {
  const { t, i18n } = useTranslation(['landing', 'common'])
  const lang = i18n.language

  if (projects.length === 0) return null

  return (
    <SectionBlock
      id={SECTION_IDS.WORK}
      eyebrow={t('work.eyebrow')}
      title={t('work.title')}
      muted={t('work.titleMuted')}
      action={
        <TextLink asChild>
          <Link to={ROUTES.PROJECTS}>{t('work.allCases')} →</Link>
        </TextLink>
      }
    >
      <div className="flex flex-col gap-20">
        {projects.map((project, index) => {
          const image = coverUrl(project)

          return (
            <WorkItem
              key={project.slug}
              // Ranije fiksan niz od tri vrednosti; sada se izvodi iz indeksa, pa četvrti
              // izdvojen projekat ne ostaje bez oznake.
              index={`/ ${String(index + 1).padStart(2, '0')}`}
              title={localize(project.title, lang)}
              meta={`${String(project.year)} · ${localize(project.cat, lang)}`}
              description={localize(project.desc, lang)}
              imageCaption={localize(project.caption, lang)}
              tags={project.technologies.map((technology) => ({
                label: technology.label,
                ...(technology.logoUrl ? { icon: technology.logoUrl } : {}),
              }))}
              to={projectPath(project.slug)}
              {...(image ? { imageSrc: image } : {})}
              /**
               * Strane se SMENJUJU po rednom broju: neparni (01, 03…) imaju sliku desno,
               * parni (02, 04…) sliku levo i tekst desno.
               *
               * Ritam je time zagarantovan, ali zavisi od POZICIJE: dodavanje projekta ispred
               * okreće strane svima ispod njega. Ranije je strana bila podatak u bazi
               * (`mediaSide`); polje je uklonjeno jer ga ništa nije čitalo.
               */
              media={(index + 1) % 2 === 0 ? 'start' : 'end'}
              action={
                <TextLink asChild className="mt-1">
                  <Link to={projectPath(project.slug)}>{t('work.readCase')} →</Link>
                </TextLink>
              }
            />
          )
        })}
      </div>
    </SectionBlock>
  )
}
