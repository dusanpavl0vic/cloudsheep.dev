'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { ROUTES } from '@/constants/routes'

import { useAdminSession } from './useAdminSession'

/** Admin stranice traže sesiju: bez nje (ili kad istekne) — na prijavu, sa porukom o isteku. */
export const useRequireAdmin = () => {
  const session = useAdminSession()
  const router = useRouter()

  // effect: navigacija posle promene sesije (spoljni sistem: ruter)
  useEffect(() => {
    if (session.status === 'anonymous') router.replace(`${ROUTES.ADMIN_LOGIN}?expired=1`)
  }, [session.status, router])

  return session
}
