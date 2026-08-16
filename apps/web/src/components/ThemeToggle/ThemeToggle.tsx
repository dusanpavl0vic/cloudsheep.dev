import { useTranslation } from 'react-i18next'

import { MoonIcon, SunIcon } from '@/components/BrandIcon'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { THEMES, themeToggled } from '@/store/slices/themeSlice'

import { themeGlowVariants, themeIconVariants, themeToggleVariants } from './ThemeToggle.variants'

/**
 * Prekidač teme.
 *
 * Obe ikone su UVEK u DOM-u i samo se animira koja je vidljiva — da su uslovno
 * renderovane, prelaz bi bio skok, jer element koji izlazi nema šta da animira.
 * Zato i `aria-hidden` na obe: pristupačno ime nosi dugme, ne ikone.
 */
export const ThemeToggle = () => {
  const { t } = useTranslation('common')
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.theme.theme)

  const isDark = theme === THEMES.DARK
  const label = isDark ? t('theme.switchToLight') : t('theme.switchToDark')

  return (
    <button
      type="button"
      onClick={() => dispatch(themeToggled())}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      className={themeToggleVariants()}
    >
      <span aria-hidden className={themeGlowVariants({ state: isDark ? 'visible' : 'hidden' })} />
      <SunIcon
        aria-hidden
        className={themeIconVariants({ state: isDark ? 'visible' : 'hidden' })}
      />
      <MoonIcon
        aria-hidden
        className={themeIconVariants({ state: isDark ? 'hidden' : 'visible' })}
      />
    </button>
  )
}
