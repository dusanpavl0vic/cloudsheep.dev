import { useTranslations } from 'next-intl'

import TechTile from '@/components/data-display/TechTile'
import { EFFECT_ATTRS } from '@/constants/effects'
import type { Technology } from '@/types/technology'

import { TASKS, THOUGHTS, thoughtDelay, type ThoughtKind } from './Hero.constants'
import { Anchor, Card, Fill, Float, Label, Layer, Meta, Note, Score, Status, Task, TaskName, Tiles, Track } from './HeroThoughts.styles'
import ScoreRing from './ScoreRing'

interface HeroThoughtsProps {
  /** Prve tri tehnologije za oblak „stack". */
  technologies: Technology[]
}

/** Pet „oblaka misli" oko naslova (od 1200 px). Dekorativni — za čitač ekrana ih nema. */
const HeroThoughts = ({ technologies }: HeroThoughtsProps) => {
  const t = useTranslations('home.hero.thoughts')

  const body = (kind: ThoughtKind) => {
    switch (kind) {
      case 'note':
        return <Note>{t('note')}</Note>
      case 'tasks':
        return (
          <>
            <Label>{t('tasksTitle')}</Label>
            {TASKS.map((task) => (
              <Task key={task.key}>
                <TaskName>{t(task.key)}</TaskName>
                <Track>
                  <Fill $width={task.width} $tone={task.tone} />
                </Track>
              </Task>
            ))}
          </>
        )
      case 'deploy':
        return (
          <>
            <Label>{t('deployTitle')}</Label>
            <Status>{t('deployStatus')}</Status>
            <Meta>{t('deployMeta')}</Meta>
          </>
        )
      case 'score':
        return (
          <Score>
            <ScoreRing />
            <div>
              <Label>{t('scoreTitle')}</Label>
              <Meta>{t('scoreMeta')}</Meta>
            </div>
          </Score>
        )
      case 'stack':
        return (
          <>
            <Label $center>{t('stackTitle')}</Label>
            <Tiles>
              {technologies.slice(0, 3).map((tech) => (
                <TechTile key={tech.id} label={tech.label} logoUrl={tech.logoUrl} size={40} />
              ))}
            </Tiles>
          </>
        )
    }
  }

  return (
    <Layer aria-hidden="true">
      {THOUGHTS.map((thought, index) => (
        <Anchor key={thought.kind} style={thought.position} {...{ [EFFECT_ATTRS.depth]: thought.depth }}>
          <Float $rotate={thought.rotate} $driftS={thought.driftS} $offsetS={-index * 1.7}>
            <Card $note={thought.kind === 'note'} $delay={thoughtDelay(index)}>
              {body(thought.kind)}
            </Card>
          </Float>
        </Anchor>
      ))}
    </Layer>
  )
}

export default HeroThoughts
