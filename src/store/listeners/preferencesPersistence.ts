import { createListenerMiddleware } from '@reduxjs/toolkit'

import { applyThemeAttribute, saveThemeCookie } from '../persistence/preferencesStorage'
import { setTheme } from '../slices/preferences/actions'

export const preferencesPersistenceListener = createListenerMiddleware()

/** Izabrana tema: atribut na `<html>` odmah, kolačić za sledeći render na serveru. */
preferencesPersistenceListener.startListening({
  actionCreator: setTheme,
  effect: ({ payload }) => {
    applyThemeAttribute(payload)
    saveThemeCookie(payload)
  },
})
