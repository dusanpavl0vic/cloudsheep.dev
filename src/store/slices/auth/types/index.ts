import type { SessionUser } from '@/types/auth'

/**
 * `unknown` — stranica tek učitana, sesija se obnavlja iz httpOnly kolačića;
 * `anonymous` — nema sesije (ide se na prijavu); `authenticated` — access token je u memoriji.
 */
export type SessionStatus = 'unknown' | 'authenticated' | 'anonymous'

export interface AuthState {
  status: SessionStatus
  user: SessionUser | null
  /** Access token SAMO u memoriji — nikad u localStorage-u (docs/20 §1). */
  accessToken: string | null
}
