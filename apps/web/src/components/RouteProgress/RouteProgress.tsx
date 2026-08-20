import { useTranslation } from 'react-i18next'
import { useNavigation } from 'react-router'

import { ProgressBar } from '@app/ui'

/**
 * Traka napretka za navigaciju. **List u stablu, ne omotač** — i to je cela poenta.
 *
 * `useNavigation()` menja vrednost dva puta po navigaciji (`idle → loading → idle`). Da se
 * hook zvao u komponenti koja renderuje `<Outlet />`, svaka navigacija bi dvaput ponovo
 * renderovala celo podstablo aplikacije. Ovako se ponovo renderuje samo ova traka.
 *
 * Zašto uopšte postoji: svaka ruta je lazy i čeka `Promise.all([chunk, prevodi, podaci])`,
 * a React Router za to vreme drži staru stranicu na ekranu. Bez ovoga klik po navigaciji
 * izgleda kao da nije registrovan (`routes/loaders.ts` to pominje kao nameru od ADR 0009).
 */
export const RouteProgress = () => {
  const { state } = useNavigation()
  const { t } = useTranslation('common')

  return <ProgressBar active={state !== 'idle'} label={t('common.loading')} />
}
