import { useTranslation } from 'react-i18next'

import {
  cardLayerVariants,
  cardTitleVariants,
  cardVariants,
  logCodeVariants,
  logPathVariants,
  logRowVariants,
  noteTextVariants,
  noteVariants,
  statusMetaVariants,
  statusValueVariants,
} from './NotFoundCards.variants'
import { CARD_POSITION, REQUEST_LOG } from '../../notFound.constants'

/**
 * Lebdeće kartice oko naslova, kao u hero-u — ali sa sadržajem koji pripada ovoj strani.
 *
 * Hero kartice govore šta studio radi (zadaci, deploy, ocena). Ovde bi to bilo neumesno: na
 * strani greške posetiocu treba objašnjenje, a ne portfolio. Zato kartice pokazuju **šta se
 * upravo desilo** — dve rute su odgovorile, treća nije.
 *
 * Cela grupa je `aria-hidden`: ukras, ne sadržaj. Sve što kartice tvrde piše i u terminal
 * redu iznad naslova, pa bi ih čitač ekrana pročitao dvaput.
 *
 * `hidden xl:block`: ispod te širine naslov ide preko cele širine, pa bi kartica pala preko
 * njega. Hero ih tada slaže u vodoravnu traku ispod CTA-a — ovde se to NE radi, jer bi traka
 * dodala visinu, a ova strana mora da stane u jedan ekran bez skrola.
 */
export const NotFoundCards = () => {
  const { t } = useTranslation('common')

  return (
    <div aria-hidden className={cardLayerVariants()}>
      <div style={CARD_POSITION.note} className={noteVariants()}>
        <p className={noteTextVariants()}>{t('notFound.cards.note')}</p>
      </div>

      <div style={CARD_POSITION.status} className={cardVariants()}>
        <p className={cardTitleVariants()}>{t('notFound.cards.statusTitle')}</p>
        <p className={statusValueVariants()}>404</p>
        <p className={statusMetaVariants()}>{t('notFound.cards.statusMeta')}</p>
      </div>

      <div style={CARD_POSITION.log} className={cardVariants()}>
        <p className={cardTitleVariants()}>{t('notFound.cards.logTitle')}</p>
        {REQUEST_LOG.map((row) => (
          <div key={row.path} className={logRowVariants()}>
            <span className={logPathVariants()}>{row.path}</span>
            <span className={logCodeVariants({ failed: row.failed })}>{row.code}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
