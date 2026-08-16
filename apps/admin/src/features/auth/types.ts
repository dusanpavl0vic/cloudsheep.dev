export type AuthRole = 'admin' | 'member' | 'viewer'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: AuthRole
}

export interface Session {
  user: AuthUser
  /** Access token živi SAMO u memoriji. Refresh je u httpOnly cookie-ju (docs/20). */
  accessToken: string
}
