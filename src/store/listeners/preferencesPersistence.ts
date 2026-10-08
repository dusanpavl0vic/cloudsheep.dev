import { createListenerMiddleware } from '@reduxjs/toolkit'

import {
  applyThemeAttribute,
  saveAdminLocale,
  saveThemeCookie,
} from '../persistence/preferencesStorage'
import { setAdminLocale, setTheme } from '../slices/preferences/actions'

export const preferencesPersistenceListener = createListenerMiddleware()

/** Izabrana tema: atribut na `<html>` odmah, kolačić za sledeći render na serveru. */
preferencesPersistenceListener.startListening({
  actionCreator: setTheme,
  effect: ({ payload }) => {
    applyThemeAttribute(payload)
    saveThemeCookie(payload)
  },
})

/** Jezik admin panela pamti se u ovom pregledaču. */
preferencesPersistenceListener.startListening({
  actionCreator: setAdminLocale,
  effect: ({ payload }) => {
    saveAdminLocale(payload)
  },
})
