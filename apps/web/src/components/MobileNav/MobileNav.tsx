import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { CloseIcon, MenuIcon } from '@/components/BrandIcon'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useDevice } from '@/hooks/useDevice'
import { useNativeDialog } from '@/hooks/useNativeDialog'
import { MAIN_NAV } from '@/lib/navigation'
import { ROUTES } from '@/lib/routes'
import { Button } from '@app/ui'

import {
  navCloseVariants,
  navSheetFootVariants,
  navSheetHeadVariants,
  navSheetInnerVariants,
  navSheetLinkVariants,
  navSheetListVariants,
  navSheetVariants,
  navTriggerVariants,
} from './MobileNav.variants'

const SHEET_ID = 'nav-sheet'

interface MobileNavProps {
  /** Sekcija koja je trenutno na ekranu — računa je zaglavlje, panel je samo prikazuje. */
  activeSection: string | null
}

/**
 * Navigacija na mobilnom i tabletu: sve iz zaglavlja osim logotipa seli u bočni panel.
 *
 * Panel je **native `<dialog>`** otvoren kroz `showModal()` — zamka fokusa, `Esc` i inertna
 * pozadina dolaze od platforme, pa ovde nema nijedne linije koja to ručno radi. Obrazloženje
 * zašto ne Radix je u `useNativeDialog`.
 *
 * Na vrhu panela stoji **samo reč, bez znaka**: znak stoji levo u zaglavlju i vidi se iznad
 * otvorenog panela, pa bi drugi bio isti podatak dvaput na istom ekranu.
 */
export const MobileNav = ({ activeSection }: MobileNavProps) => {
  const { t } = useTranslation('common')
  const { isMobile } = useDevice()
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
        className={navSheetVariants({ layout: isMobile ? 'full' : 'side' })}
      >
        <div className={navSheetInnerVariants()}>
          <div className={navSheetHeadVariants()}>
            <Logo size="sm" showMark={false} label={t('common.appNameLower')} />
            <button
              type="button"
              onClick={close}
              aria-label={t('nav.closeMenu')}
              className={navCloseVariants()}
            >
              <CloseIcon className="size-5" />
            </button>
          </div>

          <nav className={navSheetListVariants()}>
            {MAIN_NAV.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                onClick={close}
                aria-current={item.sectionId === activeSection ? 'location' : undefined}
                className={navSheetLinkVariants({ active: item.sectionId === activeSection })}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <Button asChild size="lg" className="w-full">
            <Link to={ROUTES.CONTACT} onClick={close}>
              {t('nav.getStarted')}
            </Link>
          </Button>

          <div className={navSheetFootVariants()}>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </dialog>
    </>
  )
}
