'use client'

import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

import { Status } from './ListStatus.styles'

interface ListStatusProps {
  isLoading: boolean
  isError: boolean
  children: ReactNode
}

/** Učitavanje / greška umesto liste; inače sama lista. */
const ListStatus = ({ isLoading, isError, children }: ListStatusProps) => {
  const t = useTranslations('admin.common')
  if (isError) return <Status role="alert">{t('loadFailed')}</Status>
  if (isLoading) return <Status role="status">{t('loading')}</Status>
  return children
}

export default ListStatus
