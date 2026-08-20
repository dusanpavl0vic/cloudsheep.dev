import { useTranslation } from 'react-i18next'
import { useNavigation } from 'react-router'

import { ProgressBar } from '@app/ui'

/**
 * Traka napretka za prelazak između stranica panela.
 *
 * Zašto ne `Suspense`: rute u `routes/router.tsx` koriste React Router `lazy:`, koji **nije**
 * `React.lazy`. Router sam čeka modul pre nego što renderuje, pa ga Suspense granica ne
 * presreće — indikator mora doći iz `useNavigation()`.
 *
 * Hook stoji u listu stabla, ne u komponenti koja renderuje `<Outlet />`: inače bi svaka
 * navigacija dvaput ponovo renderovala celu ljusku.
 */
export const RouteProgress = () => {
  const { state } = useNavigation()
  const { t } = useTranslation('common')

  return <ProgressBar active={state !== 'idle'} label={t('common.loading')} />
}
