import type { CSSProperties, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { TechTile } from '@/components/TechTile'
import type { Technology } from '@/features/projects'
import { useDevice } from '@/hooks/useDevice'
import { useDragScroll } from '@/hooks/useDragScroll'

import {
  heroCardTitleVariants,
  heroCardVariants,
  heroFloatVariants,
  heroNoteTextVariants,
  heroNoteVariants,
  heroStatusDotVariants,
  heroStatusValueVariants,
  heroStripItemVariants,
  heroStripVariants,
  heroTaskBarVariants,
  heroTaskFillVariants,
  heroTaskLabelVariants,
  heroTaskRowVariants,
} from './HeroCards.variants'

/** Prve tri tehnologije idu u karticu sa stack-om; ostatak nosi traka logotipa ispod hero-a. */

/**
 * Zadaci u kartici su **primer izgleda proizvoda**, ne stvarni podaci.
 * Zato imena idu kroz i18n, a procenti su konstante — ništa se ne dohvata.
 */
const SAMPLE_TASKS = [
  { id: 'ship', progress: 82, tone: 'primary' as const },
  { id: 'review', progress: 46, tone: 'success' as const },
]

/** Pozicije važe samo za lebdeći raspored; traka ih ignoriše. */
const FLOAT_POSITION: Record<string, CSSProperties> = {
  note: { top: '14%', left: '4%', rotate: '-6deg' },
  tasks: { bottom: '9%', left: '3%', rotate: '3deg' },
  deploy: { top: '16%', right: '4%', rotate: '4deg' },
  stack: { bottom: '12%', right: '3%', rotate: '-4deg' },
  score: { top: '44%', right: '9%', rotate: '-3deg' },
}

interface Card {
  id: string
  note?: boolean
  body: ReactNode
}

/**
 * Sadržaj kartica stoji odvojeno od omotača, da bi oba rasporeda — lebdeći i traka —
 * crtala **isti** DOM umesto da se markup piše dvaput.
 */
const useCardContent = (technologies: readonly Technology[]): Card[] => {
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
          <div className="flex gap-2">
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

/**
 * Kartice koje nagoveštavaju šta studio radi.
 *
 * Cela grupa je `aria-hidden`: to je ukras, a ne sadržaj — screen reader bi inače pročitao
 * izmišljene zadatke kao da su stvarni.
 *
 * **Dva rasporeda, isti sadržaj.** Na `xl` lebde oko naslova; ispod toga za to nema mesta —
 * naslov je centriran i preko cele širine, pa bi svaka pozicija sa strane pala preko njega.
 * Zato se tamo slažu u traku ispod poziva na akciju, koja se lista vodoravno i na telefonu i
 * na tabletu. Ranije su ispod `xl` bile prosto sakrivene, pa ih većina posetilaca nikad nije
 * videla.
 *
 * Granicu bira `useDevice`, a ne samo Tailwind prefiks, jer se razlikuje **struktura**
 * (apsolutni sloj naspram trake u toku), ne samo vidljivost.
 */
interface HeroCardsProps {
  /** Prve tri se prikazuju u kartici „stack". */
  technologies: readonly Technology[]
}

export const HeroCards = ({ technologies }: HeroCardsProps) => {
  const { isWide } = useDevice()
  const cards = useCardContent(technologies)
  // Prst i trackpad pokriva `overflow-x-auto`; ovo dodaje prevlačenje MIŠEM, jer je skrol
  // traka namerno sakrivena pa je mišem inače nema čime pomeriti.
  //
  // `startAt: 'center'` jer kartice nemaju redosled — one su ukras. Sa početka se vidi samo
  // prva i deo druge, pa traka izgleda kao da tu i počinje i završava se.
  const drag = useDragScroll<HTMLDivElement>({ startAt: 'center' })

  if (isWide) {
    return (
      <div aria-hidden className={heroFloatVariants()}>
        {cards.map((card) => (
          <div
            key={card.id}
            style={FLOAT_POSITION[card.id]}
            className={`absolute ${card.note ? heroNoteVariants() : heroCardVariants()}`}
          >
            {card.body}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div aria-hidden className={heroStripVariants()} {...drag}>
      {cards.map((card) => (
        <div
          key={card.id}
          className={`${heroStripItemVariants()} ${card.note ? heroNoteVariants() : heroCardVariants()}`}
        >
          {card.body}
        </div>
      ))}
    </div>
  )
}
