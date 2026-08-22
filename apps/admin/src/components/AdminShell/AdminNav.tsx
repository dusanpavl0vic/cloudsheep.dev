import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'

import { useMediaQuery, useNativeDialog } from '@app/hooks'
import { CloseIcon, Logo, MenuIcon } from '@app/ui'

import {
  navCloseVariants,
  navSheetHeadVariants,
  navSheetInnerVariants,
  navSheetLinkVariants,
  navSheetListVariants,
  navSheetVariants,
  navTriggerVariants,
} from './AdminNav.variants'
import { NAV } from './AdminShell.constants'

const SHEET_ID = 'admin-nav-sheet'

/**
 * Navigacija ispod `lg`, gde bočna traka ne staje.
 *
 * Panel je **native `<dialog>`** otvoren kroz `showModal()` — zamka fokusa, `Esc` i inertna
 * pozadina dolaze od platforme, pa ovde nema nijedne linije koja to ručno radi. Isto rešenje
 * i isti CSS (`@app/tailwind-config/sheet.css`) kao na javnom sajtu: dve app-e koje se
 * ponašaju različito pri istoj širini deluju kao dva proizvoda.
 *
 * `useNativeDialog` zatvara panel kad se pređe u desktop širinu — bez toga bi otvoren panel
 * na tabletu ostao otvoren posle rotacije, a sa njim i inertna pozadina: stranica bi
 * izgledala živo i ne bi primala klikove.
 */
export const AdminNav = () => {
  const { t } = useTranslation('common')
  const isPhone = useMediaQuery('(max-width: 639px)')
  const { ref, open, show, close } = useNativeDialog('(min-width: 1024px)')

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-label={t('nav.openMenu')}
        aria-expanded={open}
        aria-controls={SHEET_ID}
        className={navTriggerVariants()}
      >
        <MenuIcon className="size-5" />
      </button>

      <dialog
        id={SHEET_ID}
        ref={ref}
        aria-label={t('nav.label')}
        className={navSheetVariants({ layout: isPhone ? 'full' : 'side' })}
      >
        <div className={navSheetInnerVariants()}>
          <div className={navSheetHeadVariants()}>
            <Logo size="sm" label={t('common.appNameLower')} />
            <button
              type="button"
              onClick={close}
              aria-label={t('nav.closeMenu')}
              className={navCloseVariants()}
            >
              <CloseIcon className="size-5" />
            </button>
          </div>

          <nav aria-label={t('nav.label')} className={navSheetListVariants()}>
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={close}
                className={({ isActive }) => navSheetLinkVariants({ active: isActive })}
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>
        </div>
      </dialog>
    </>
  )
}
