import { describe, expect, it } from 'vitest'

import {
  authReducer,
  loggedOut,
  selectAccessToken,
  selectCurrentUser,
  selectIsAuthenticated,
  sessionEstablished,
  sessionRefreshed,
  type AuthState,
} from './auth.slice'
import type { Session } from '../types'

const session: Session = {
  user: { id: 'usr_1', email: 'a@b.rs', name: 'Marko', role: 'admin' },
  accessToken: 'token-1',
}

const empty: AuthState = { session: null }

describe('auth reducer', () => {
  it('kreće bez sesije', () => {
    expect(authReducer(undefined, { type: 'init' })).toEqual(empty)
  })

  it('sessionEstablished upisuje sesiju', () => {
    expect(authReducer(empty, sessionEstablished(session)).session).toEqual(session)
  })

  it('sessionRefreshed zamenjuje token', () => {
    const refreshed: Session = { ...session, accessToken: 'token-2' }
    const state = authReducer({ session }, sessionRefreshed(refreshed))

    expect(state.session?.accessToken).toBe('token-2')
  })

  it('loggedOut briše sesiju u celosti', () => {
    expect(authReducer({ session }, loggedOut())).toEqual(empty)
  })

  it('loggedOut je idempotentan', () => {
    expect(authReducer(empty, loggedOut())).toEqual(empty)
  })
})

describe('auth selektori', () => {
  const withSession = { auth: { session } }
  const withoutSession = { auth: empty }

  it('selectCurrentUser', () => {
    expect(selectCurrentUser(withSession)?.name).toBe('Marko')
    expect(selectCurrentUser(withoutSession)).toBeNull()
  })

  it('selectAccessToken', () => {
    expect(selectAccessToken(withSession)).toBe('token-1')
    expect(selectAccessToken(withoutSession)).toBeNull()
  })

  it('selectIsAuthenticated', () => {
    expect(selectIsAuthenticated(withSession)).toBe(true)
    expect(selectIsAuthenticated(withoutSession)).toBe(false)
  })
})
