import type { ReactNode } from 'react'

import type { Locale } from '@/constants/i18n'
import type { ThemeMode } from '@/constants/preferences'

export interface DocumentProps {
  children: ReactNode
  locale: Locale
  /** `null` — tema prati sistem; inače vrednost iz kolačića. */
  theme: ThemeMode | null
}
