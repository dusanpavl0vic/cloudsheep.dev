import type { RootState } from '../../../index'

export const selectTheme = (state: RootState) => state.preferences.theme
