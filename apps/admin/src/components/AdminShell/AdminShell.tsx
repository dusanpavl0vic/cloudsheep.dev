import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'

import { Button, Logo } from '@app/ui'

import { AdminNav } from './AdminNav'
import { NAV } from './AdminShell.constants'
import {
  brandVariants,
  contentVariants,
  mainVariants,
  navLinkVariants,
  shellVariants,
  sidebarVariants,
  topbarLeadVariants,
  topbarTailVariants,
  topbarVariants,
  userNameVariants,
} from './AdminShell.variants'

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
 *
 * **Dva rasporeda, jedan izvor navigacije.** Od `lg` naviše stoji bočna traka; ispod nje
 * `AdminNav` prikazuje hamburger i panel. Obe čitaju isti `NAV` niz, pa nova stranica ne
 * može da se pojavi na jednom mestu a izostane na drugom.
 *
 * Znak se ne ponavlja: na desktopu je u traci, na mobilnom u zaglavlju — nikad oba
 * istovremeno, jer bi to bio isti podatak dvaput na istom ekranu.
 */
export const AdminShell = ({ userName, onSignOut, isSigningOut, children }: AdminShellProps) => {
  const { t } = useTranslation('common')

  return (
    <div className={shellVariants()}>
      <nav className={sidebarVariants()} aria-label={t('nav.label')}>
        <span className={brandVariants()}>
          <Logo size="sm" label={t('common.appNameLower')} />
        </span>
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
          <div className={topbarLeadVariants()}>
            <AdminNav />
            <Logo size="sm" showWordmark={false} label={t('common.appNameLower')} />
          </div>

          <div className={topbarTailVariants()}>
            <span className={userNameVariants()}>{userName}</span>
            <Button variant="ghost" size="sm" disabled={isSigningOut} onClick={onSignOut}>
              {t('common.signOut')}
            </Button>
          </div>
        </header>

        <main className={contentVariants()}>{children}</main>
      </div>
    </div>
  )
}
