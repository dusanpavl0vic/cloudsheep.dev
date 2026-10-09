'use client'

import { useTranslations } from 'next-intl'

import Icon from '@/components/foundations/Icon'
import { useToastTimer, type Toast } from '@/hooks/useToast'

import { Close, Item } from './ToastContainer.styles'

/** Jedna poruka: nestaje sama, ili na ×. */
const ToastItem = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
  const t = useTranslations('common')
  useToastTimer(toast.id)

  return (
    <Item $variant={toast.variant} role={toast.variant === 'danger' ? 'alert' : undefined}>
      <span>{toast.message}</span>
      <Close type="button" aria-label={t('close')} onClick={onClose}>
        <Icon name="close" size={16} />
      </Close>
    </Item>
  )
}

export default ToastItem
