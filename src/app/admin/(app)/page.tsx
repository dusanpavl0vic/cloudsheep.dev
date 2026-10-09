import { getTranslations } from 'next-intl/server'

import PageHeader from '@/components/admin/PageHeader'

/** `/admin` — pregled. */
const DashboardPage = async () => {
  const t = await getTranslations('admin.nav')
  return <PageHeader title={t('dashboard')} />
}

export default DashboardPage
