import { useCallback } from 'react'

import { useAppDispatch } from '@/store/hooks'

import { useLoginMutation } from '../api/authApi'
import type { LoginInput } from '../schemas/login.schema'
import { sessionEstablished } from '../store/auth.slice'

/**
 * Odvojen od `useAuth` jer radi drugu stvar — hook koji radi više stvari se deli (docs/13).
 */
export function useLogin() {
  const dispatch = useAppDispatch()
  const [loginMutation, { isLoading, error }] = useLoginMutation()

  const login = useCallback(
    async (input: LoginInput) => {
      const result = await loginMutation(input)

      if (result.data) {
        dispatch(sessionEstablished(result.data))
        return { ok: true as const }
      }

      return { ok: false as const, error: result.error }
    },
    [dispatch, loginMutation],
  )

  return { login, isLoading, error }
}
