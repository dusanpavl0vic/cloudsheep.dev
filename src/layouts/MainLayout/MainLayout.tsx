import { Outlet } from 'react-router'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

export const MainLayout = () => (
  <div className="flex flex-1 flex-col">
    <SiteHeader />
    <main className="flex-1">
      <Outlet />
    </main>
    <SiteFooter />
  </div>
)
