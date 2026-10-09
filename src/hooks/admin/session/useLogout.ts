'use client'

import { useRouter } from 'next/navigation'

import { ROUTES } from '@/constants/routes'
import { useLogoutMutation } from '@/store/api/admin/auth'

/** Odjava: server briše refresh token, klijent zaboravlja access token i keš, pa na prijavu. */
export const useLogout = () => {
  const router = useRouter()
  const [logout, { isLoading }] = useLogoutMutation()

  return {
    logout: async () => {
      await logout(undefined)
      router.replace(ROUTES.ADMIN_LOGIN)
    },
    isLoggingOut: isLoading,
  }
}
