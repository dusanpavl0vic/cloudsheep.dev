import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'

import { BRAND } from '@/lib/brand'
import { ROUTES } from '@/lib/routes'
import { Button } from '@app/ui'

import {
  brandVariants,
  contentVariants,
  mainVariants,
  navLinkVariants,
  shellVariants,
  sidebarVariants,
  topbarVariants,
} from './AdminShell.variants'

/** Navigacija kao podaci — dodavanje stranice je red u nizu, ne novi JSX. */
const NAV = [
  { to: ROUTES.DASHBOARD, labelKey: 'nav.dashboard', end: true },
  { to: ROUTES.PROJECTS, labelKey: 'nav.projects', end: false },
  { to: ROUTES.TECHNOLOGIES, labelKey: 'nav.technologies', end: false },
  { to: ROUTES.PROFILE, labelKey: 'nav.profile', end: false },
  { to: ROUTES.TEAM, labelKey: 'nav.team', end: false },
  { to: ROUTES.MESSAGES, labelKey: 'nav.messages', end: false },
] as const

interface AdminShellProps {
  userName: string
  onSignOut: () => void
  isSigningOut: boolean
  children: ReactNode
}

/**
 * Ljuska admin panela — bočna navigacija i zaglavlje.
 *
 * **Ne zna za auth.** `components/` ne sme da uvozi feature (docs/01 §2), pa ime korisnika
 * i odjavu dobija kroz props od `routes/AdminLayout`, koji sme. Ista podela kao svuda:
 * komponenta je glupa, ožičenje je sloj iznad.
 */
export const AdminShell = ({ userName, onSignOut, isSigningOut, children }: AdminShellProps) => {
  const { t } = useTranslation('common')

  return (
    <div className={shellVariants()}>
      <nav className={sidebarVariants()} aria-label={t('nav.dashboard')}>
        <span className={brandVariants()}>{BRAND.NAME}</span>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => navLinkVariants({ active: isActive })}
          >
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>

      <div className={mainVariants()}>
        <header className={topbarVariants()}>
          <span className="text-muted-foreground text-[15px]">{userName}</span>
          <Button variant="ghost" size="sm" disabled={isSigningOut} onClick={onSignOut}>
            {t('common.signOut')}
          </Button>
        </header>

        <main className={contentVariants()}>{children}</main>
      </div>
    </div>
  )
}
