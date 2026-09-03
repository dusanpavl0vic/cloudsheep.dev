import { useTranslation } from 'react-i18next'

import { ThoughtBubble } from '@/components/ThoughtBubble'

import {
  cardTitleVariants,
  logCodeVariants,
  logPathVariants,
  logRowVariants,
  noteTextVariants,
  statusMetaVariants,
  statusValueVariants,
  thoughtLayerVariants,
} from './NotFoundThoughts.variants'
import { REQUEST_LOG, THOUGHT_POSITION } from '../../notFound.constants'

/**
 * Lebdeće misli oko naslova, kao u hero-u — ali sa sadržajem koji pripada ovoj strani.
 *
 * Hero misli govore šta studio radi (zadaci, deploy, ocena). Ovde bi to bilo neumesno: na
 * strani greške posetiocu treba objašnjenje, a ne portfolio. Zato oblačići pokazuju **šta se
 * upravo desilo** — dve rute su odgovorile, treća nije.
 *
 * Cela grupa je `aria-hidden`: ukras, ne sadržaj. Sve što oblačići tvrde piše i u terminal
 * redu iznad naslova, pa bi ih čitač ekrana pročitao dvaput.
 *
 * `hidden xl:block`: ispod te širine naslov ide preko cele širine, pa bi oblačić pao preko
 * njega. Hero tada prelazi na slot koji se smenjuje — ovde se to NE radi, jer bi slot dodao
 * visinu, a ova strana mora da stane u jedan ekran bez skrola.
 */
export const NotFoundThoughts = () => {
  const { t } = useTranslation('common')

  return (
    <div aria-hidden className={thoughtLayerVariants()}>
      <ThoughtBubble
        className="absolute"
        style={THOUGHT_POSITION.note?.style}
        tail={THOUGHT_POSITION.note?.tail}
        tone="note"
        step={0}
        drift
      >
        <p className={noteTextVariants()}>{t('notFound.cards.note')}</p>
      </ThoughtBubble>

      <ThoughtBubble
        className="absolute"
        style={THOUGHT_POSITION.status?.style}
        tail={THOUGHT_POSITION.status?.tail}
        step={1}
        drift
      >
        <p className={cardTitleVariants()}>{t('notFound.cards.statusTitle')}</p>
        <p className={statusValueVariants()}>404</p>
        <p className={statusMetaVariants()}>{t('notFound.cards.statusMeta')}</p>
      </ThoughtBubble>

      <ThoughtBubble
        className="absolute"
        style={THOUGHT_POSITION.log?.style}
        tail={THOUGHT_POSITION.log?.tail}
        step={2}
        drift
      >
        <p className={cardTitleVariants()}>{t('notFound.cards.logTitle')}</p>
        {REQUEST_LOG.map((row) => (
          <div key={row.path} className={logRowVariants()}>
            <span className={logPathVariants()}>{row.path}</span>
            <span className={logCodeVariants({ failed: row.failed })}>{row.code}</span>
          </div>
        ))}
      </ThoughtBubble>
    </div>
  )
}
