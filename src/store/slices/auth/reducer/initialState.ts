import type { AuthState } from '../types'

export const initialState: AuthState = {
  status: 'unknown',
  user: null,
  accessToken: null,
}
