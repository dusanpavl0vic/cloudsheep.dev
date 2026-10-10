'use client'

import { useTranslations } from 'next-intl'

import { parseApiError } from '@/helpers/apiError'

import { useApiErrorMessage } from '../useApiErrorMessage'
import { useConfirm } from '../useConfirm'
import { useToast } from '../useToast'

type Success = 'saved' | 'deleted'

/**
 * Admin akcija sa povratnom informacijom: uspeh → toast („Sačuvano."), greška sa servera →
 * toast sa prevedenom porukom. `remove` prvo pita (dijalog potvrde), pa briše.
 */
export const useAdminAction = () => {
  const t = useTranslations('admin.common')
  const toast = useToast()
  const errorMessage = useApiErrorMessage()
  const confirm = useConfirm()

  const run = async <T>(action: () => Promise<T>, success?: Success): Promise<T | undefined> => {
    try {
      const result = await action()
      if (success) toast.show(t(success), 'success')
      return result
    } catch (caught) {
      toast.show(errorMessage(parseApiError(caught)) ?? t('loadFailed'), 'danger')
      return undefined
    }
  }

  const remove = async (message: string, action: () => Promise<unknown>) => {
    if (await confirm({ message, confirmLabel: t('delete'), danger: true })) await run(action, 'deleted')
  }

  return { run, remove, confirm }
}
