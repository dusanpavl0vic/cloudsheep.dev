import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { THEMES, themeToggled } from '@/store/slices/themeSlice'
import { Button } from '@app/ui'

export const ThemeToggle = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.theme.theme)

  const isDark = theme === THEMES.DARK
  const label = isDark ? t('theme.switchToLight') : t('theme.switchToDark')

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full"
      onClick={() => dispatch(themeToggled())}
      aria-label={label}
      title={label}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  )
}
