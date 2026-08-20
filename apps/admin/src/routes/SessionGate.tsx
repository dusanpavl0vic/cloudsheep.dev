import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'

import { useSessionBootstrap } from '@/features/auth'
import { Spinner } from '@app/ui'

/**
 * Čeka da se sesija obnovi pre nego što ijedna ruta odluči šta da prikaže.
 *
 * Stoji IZNAD i `RequireAuth`-a i `/login`-a, kao bezputna korenska ruta. Da stoji samo oko
 * zaštićenih ruta, `/login` bi se prikazao i onome ko već ima važeću sesiju — pa bi se
 * prijavljivao bez potrebe.
 *
 * `RequireAuth` zbog ovoga ostaje sinhron: kad on renderuje, provera je već gotova.
 */
export function SessionGate() {
  const { isRestoring } = useSessionBootstrap()
  const { t } = useTranslation('common')

  if (isRestoring) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner size="lg" label={t('common.loading')} />
      </div>
    )
  }

  return <Outlet />
}
