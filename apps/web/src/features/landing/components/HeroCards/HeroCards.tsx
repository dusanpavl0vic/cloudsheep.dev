import { useTranslation } from 'react-i18next'

import { TechTile } from '@/components/TechTile'
import { TECH_ITEMS } from '@/lib/tech'

import {
  heroCardTitleVariants,
  heroCardVariants,
  heroNoteTextVariants,
  heroNoteVariants,
  heroStatusDotVariants,
  heroStatusValueVariants,
  heroTaskBarVariants,
  heroTaskFillVariants,
  heroTaskLabelVariants,
  heroTaskRowVariants,
} from './HeroCards.variants'

/** Prve tri tehnologije idu u pločice pored hero-a; ostatak nosi traka ispod. */
const FEATURED_TECH = TECH_ITEMS.slice(0, 3)

/**
 * Zadaci u kartici su **primer izgleda proizvoda**, ne stvarni podaci.
 * Zato imena idu kroz i18n, a procenti su konstante — ništa se ne dohvata.
 */
const SAMPLE_TASKS = [
  { id: 'ship', progress: 82, tone: 'primary' as const },
  { id: 'review', progress: 46, tone: 'success' as const },
]

/**
 * Lebdeće kartice oko hero naslova.
 *
 * Cela grupa je `aria-hidden`: to je ukras koji nagoveštava šta studio radi, a ne sadržaj.
 * Screen reader bi inače pročitao izmišljene zadatke kao da su stvarni.
 *
 * Vidljive su tek od `xl` naviše — ispod toga nema mesta, a guranje pod tekst bi napravilo
 * zbrku umesto utiska.
 */
export function HeroCards() {
  const { t } = useTranslation('landing')

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      {/* Gore levo — beleška */}
      <div className={heroNoteVariants()} style={{ top: '14%', left: '4%', rotate: '-6deg' }}>
        <p className={heroNoteTextVariants()}>{t('hero.cards.note')}</p>
      </div>

      {/* Dole levo — zadaci u toku */}
      <div className={heroCardVariants()} style={{ bottom: '9%', left: '3%', rotate: '3deg' }}>
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
      </div>

      {/* Gore desno — status poslednjeg deploy-a */}
      <div className={heroCardVariants()} style={{ top: '16%', right: '4%', rotate: '4deg' }}>
        <p className={heroCardTitleVariants()}>{t('hero.cards.deployTitle')}</p>
        <div className="flex items-center gap-2">
          <span className={heroStatusDotVariants()} />
          <span className="text-foreground text-[13px] font-medium">
            {t('hero.cards.deployStatus')}
          </span>
        </div>
        <p className="text-faint mt-1 font-mono text-[11px]">{t('hero.cards.deployMeta')}</p>
      </div>

      {/* Dole desno — stack u pločicama */}
      <div className={heroCardVariants()} style={{ bottom: '12%', right: '3%', rotate: '-4deg' }}>
        <p className={heroCardTitleVariants()}>{t('hero.cards.stackTitle')}</p>
        <div className="flex gap-2">
          {FEATURED_TECH.map((item) => (
            <TechTile key={item.id} label={item.label} icon={item.icon} size="sm" />
          ))}
        </div>
      </div>

      {/* Sredina desno — Lighthouse ocena */}
      <div className={heroCardVariants()} style={{ top: '44%', right: '9%', rotate: '-3deg' }}>
        <p className={heroCardTitleVariants()}>{t('hero.cards.scoreTitle')}</p>
        <p className={heroStatusValueVariants()}>100</p>
      </div>
    </div>
  )
}
