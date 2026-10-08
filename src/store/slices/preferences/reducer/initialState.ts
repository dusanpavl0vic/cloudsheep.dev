import { DEFAULT_LOCALE } from '@/constants/i18n'

import type { PreferencesState } from '../types'

export const initialState: PreferencesState = {
  theme: null,
  adminLocale: DEFAULT_LOCALE,
}
