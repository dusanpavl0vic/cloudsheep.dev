import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { TechTile } from '@/components/TechTile'
import { ThoughtBubble } from '@/components/ThoughtBubble'
import type { Technology } from '@/features/projects'
import { useDevice } from '@/hooks/useDevice'

import { FLOAT_POSITION, STEP_ORDER } from './HeroThoughts.constants'
import {
  heroCardTitleVariants,
  heroFloatVariants,
  heroNoteTextVariants,
  heroStackRowVariants,
  heroStatusDotVariants,
  heroStatusValueVariants,
  heroTaskBarVariants,
  heroTaskFillVariants,
  heroTaskLabelVariants,
  heroTaskRowVariants,
} from './HeroThoughts.variants'

/**
 * Zadaci u misli su **primer izgleda proizvoda**, ne stvarni podaci.
 * Zato imena idu kroz i18n, a procenti su konstante — ništa se ne dohvata.
 */
const SAMPLE_TASKS = [
  { id: 'ship', progress: 82, tone: 'primary' as const },
  { id: 'review', progress: 46, tone: 'success' as const },
]

interface Thought {
  id: string
  note?: boolean
  body: ReactNode
}

/**
 * Sadržaj misli stoji odvojeno od omotača, da bi oba rasporeda — lebdeći i slot — crtala
 * **isti** DOM umesto da se markup piše dvaput.
 */
const useThoughts = (technologies: readonly Technology[]): Thought[] => {
  const { t } = useTranslation('landing')

  return [
    {
      id: 'note',
      note: true,
      body: <p className={heroNoteTextVariants()}>{t('hero.cards.note')}</p>,
    },
    {
      id: 'tasks',
      body: (
        <>
          <p className={heroCardTitleVariants()}>{t('hero.cards.tasksTitle')}</p>
          {SAMPLE_TASKS.map((task) => (
            <div key={task.id} className={heroTaskRowVariants()}>
              <span className={heroTaskLabelVariants()}>{t(`hero.cards.task.${task.id}`)}</span>
              <span className={heroTaskBarVariants()}>
                <span
                  className={heroTaskFillVariants({ tone: task.tone })}
                  style={{ width: `${String(task.progress)}%` }}
                />
              </span>
            </div>
          ))}
        </>
      ),
    },
    {
      id: 'deploy',
      body: (
        <>
          <p className={heroCardTitleVariants()}>{t('hero.cards.deployTitle')}</p>
          <div className="flex items-center gap-2">
            <span className={heroStatusDotVariants()} />
            <span className="text-plate-ink text-[13px] font-medium">
              {t('hero.cards.deployStatus')}
            </span>
          </div>
          <p className="text-plate-ink-muted mt-1 font-mono text-[11px]">
            {t('hero.cards.deployMeta')}
          </p>
        </>
      ),
    },
    {
      id: 'stack',
      body: (
        <>
          <p className={heroCardTitleVariants()}>{t('hero.cards.stackTitle')}</p>
          <div className={heroStackRowVariants()}>
            {technologies.slice(0, 3).map((item) => (
              <TechTile key={item.id} label={item.label} icon={item.logoUrl} size="sm" />
            ))}
          </div>
        </>
      ),
    },
    {
      id: 'score',
      body: (
        <>
          <p className={heroCardTitleVariants()}>{t('hero.cards.scoreTitle')}</p>
          <p className={heroStatusValueVariants()}>100</p>
        </>
      ),
    },
  ]
}

interface HeroThoughtsProps {
  /** Prve tri se prikazuju u misli „stack". */
  technologies: readonly Technology[]
}

/**
 * Misli studija oko hero naslova — oblaci, ne kartice (docs/22 §3b).
 *
 * Cela grupa je `aria-hidden`: to je ukras, a ne sadržaj — čitač ekrana bi inače pročitao
 * izmišljene zadatke kao da su stvarni.
 *
 * **Postoje samo na `xl` i naviše.** Ispod toga naslov je centriran preko cele širine, pa za
 * lebdeći raspored nema mesta. Probano je i odbačeno dvoje: vodoravna traka koja se prevlači
 * (sakrivala je tri od pet misli iza pokreta koji većina posetilaca ne napravi) i jedna misao
 * koja plovi preko kadra (jedna od pet je premalo da opravda stalan pokret ispod naslova).
 *
 * Zato se ispod `xl` ne crta **ništa** — bolje nego surogat rasporeda.
 *
 * Granicu bira `useDevice`, a ne Tailwind prefiks: `hidden` bi ostavio pet oblaka u DOM-u da
 * se crtaju i animiraju bez ijednog vidljivog piksela.
 */
export const HeroThoughts = ({ technologies }: HeroThoughtsProps) => {
  const { isWide } = useDevice()
  const thoughts = useThoughts(technologies)

  // Ispod `xl` misli se ne crtaju uopšte — vidi obrazloženje iznad.
  if (!isWide) return null

  return (
    <div aria-hidden className={heroFloatVariants()}>
      {thoughts.map((thought, i) => (
        <ThoughtBubble
          key={thought.id}
          className="absolute"
          style={FLOAT_POSITION[thought.id]?.style}
          tail={FLOAT_POSITION[thought.id]?.tail}
          tone={thought.note ? 'note' : 'paper'}
          step={STEP_ORDER[i] ?? 0}
          drift
        >
          {thought.body}
        </ThoughtBubble>
      ))}
    </div>
  )
}
