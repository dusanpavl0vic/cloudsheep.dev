import { Outlet } from 'react-router'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { useRouteScroll } from '@/hooks/useRouteScroll'

interface MainLayoutProps {
  /** Landing koristi puni footer; podstranice tanki. */
  footer?: 'full' | 'slim'
}

export const MainLayout = ({ footer = 'full' }: MainLayoutProps) => {
  useRouteScroll()

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter variant={footer} />
    </div>
  )
}
