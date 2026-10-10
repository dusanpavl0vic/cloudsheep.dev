'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => undefined

/**
 * `false` u HTML-u sa servera i do hidratacije, `true` posle. Forma pre hidratacije bi se poslala
 * nativno (`GET` sa poljima u URL-u — lični podaci u logovima), pa je dugme za slanje do tada
 * onemogućeno; onemogućeno podrazumevano dugme blokira i slanje Enter-om (HTML spec).
 */
export const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
