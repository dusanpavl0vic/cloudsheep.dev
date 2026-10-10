'use client'

import NextLink from 'next/link'
import { useTranslations } from 'next-intl'

import PageHeader from '@/components/admin/PageHeader'
import Panel from '@/components/admin/Panel'
import { useDashboard } from '@/hooks/admin/dashboard'

import { Alert, Calls, Layout, Muted, Stat, Stats } from './DashboardView.styles'

/** `/admin` — brojke koje traže pažnju i sledeći pozivi. */
const DashboardView = () => {
  const t = useTranslations('admin')
  const { stats, nextCalls } = useDashboard()
  const noFreeSlots = stats.some((stat) => stat.key === 'free' && stat.alert)

  return (
    <>
      <PageHeader title={t('nav.dashboard')} lead={t('dashboard.lead')} />
      <Layout>
        <div>
          <Stats>
            {stats.map((stat) => (
              <li key={stat.key}>
                <Stat component={NextLink} href={stat.href} $alert={stat.alert}>
                  <strong>{stat.value ?? t('common.none')}</strong>
                  <span>{t(`dashboard.${stat.key}`)}</span>
                </Stat>
              </li>
            ))}
          </Stats>
          {noFreeSlots && <Alert role="status">{t('dashboard.freeLow')}</Alert>}
        </div>
        <Panel title={t('dashboard.nextCalls')}>
          {nextCalls.length === 0 ? (
            <Muted>{t('dashboard.noCalls')}</Muted>
          ) : (
            <Calls>
              {nextCalls.map((call) => (
                <li key={call.id}>
                  <time>{call.time}</time>
                  <span>
                    {call.name} <small>{call.email}</small>
                  </span>
                </li>
              ))}
            </Calls>
          )}
        </Panel>
      </Layout>
    </>
  )
}

export default DashboardView
