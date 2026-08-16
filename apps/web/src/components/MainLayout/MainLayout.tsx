import { Outlet } from 'react-router'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { useDocumentHead } from '@/hooks/useDocumentHead'
import { useRouteScroll } from '@/hooks/useRouteScroll'

import { appBackdropVariants, appFrameVariants } from './MainLayout.variants'

interface MainLayoutProps {
  /** Landing koristi puni footer; podstranice tanki. */
  footer?: 'full' | 'slim'
}

export const MainLayout = ({ footer = 'full' }: MainLayoutProps) => {
  useRouteScroll()
  useDocumentHead()

  return (
    <div className={appBackdropVariants()}>
      <div className={appFrameVariants()}>
        <SiteHeader />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <SiteFooter variant={footer} />
      </div>
    </div>
  )
}
