'use client'

import { MAIN_NAV_ITEMS, TRACKED_SECTIONS, type NavKey } from '@/constants/navigation'
import { homeSectionHref, ROUTES } from '@/constants/routes'
import { usePathname } from '@/i18n/navigation'

import { useActiveSection } from './useActiveSection'

export interface MainNavLink {
  key: NavKey
  href: string
  isActive: boolean
}

/**
 * Stavke glavne navigacije sa aktivnim stanjem (dizajn): na početnoj — sekcija pod headerom;
 * na podstranici — stranica („Radovi" je aktivno i na studiji slučaja).
 */
export const useMainNav = () => {
  const pathname = usePathname()
  const isHome = pathname === ROUTES.HOME
  const activeSection = useActiveSection(TRACKED_SECTIONS, isHome)

  const isPageActive = (key: NavKey) =>
    (key === 'notes' && pathname.startsWith(ROUTES.NOTES)) || (key === 'work' && pathname.startsWith(ROUTES.PROJECTS))

  const links: MainNavLink[] = MAIN_NAV_ITEMS.map((item) => ({
    key: item.key,
    href: item.section ? homeSectionHref(item.section) : (item.href ?? ROUTES.HOME),
    isActive: item.section && isHome ? activeSection === item.section : isPageActive(item.key),
  }))

  return { links, isHome }
}
