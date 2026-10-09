'use client'

import { usePathname } from 'next/navigation'

import { ADMIN_NAV_ITEMS } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'

/** Stavke admin menija sa aktivnom: pregled samo na `/admin`, ostale i na podstranicama. */
export const useAdminNav = () => {
  const pathname = usePathname()
  return ADMIN_NAV_ITEMS.map((item) => ({
    ...item,
    isActive: item.href === ROUTES.ADMIN ? pathname === ROUTES.ADMIN : pathname === item.href || pathname.startsWith(`${item.href}/`),
  }))
}
