'use client'

import { useTranslations } from 'next-intl'

import Button from '@/components/buttons/Button'
import Overlay from '@/components/overlays/Overlay'
import { settleConfirm } from '@/hooks/useConfirm'

import { Actions, Body, Message } from './ConfirmDialog.styles'
import type { OverlayModalProps } from '../shared/types'

export interface ConfirmDialogProps {
  [key: string]: string | boolean | undefined
  requestId: string
  /** Već preveden tekst pitanja. */
  message: string
  confirmLabel?: string
  danger?: boolean
}

/** „Obrisati X?" — odgovor ide nazad kroz `useConfirm` (Promise). Zatvaranje = ne. */
const ConfirmDialog = ({ props, onClose }: OverlayModalProps<ConfirmDialogProps>) => {
  const t = useTranslations('admin.common')
  const answer = (confirmed: boolean) => {
    if (props.requestId) settleConfirm(props.requestId, confirmed)
    onClose()
  }

  return (
    <Overlay label={props.message ?? ''} onClose={() => { answer(false) }}>
      <Body>
        <Message>{props.message}</Message>
        <Actions>
          <Button variant="ghost" onClick={() => { answer(false) }}>
            {t('cancel')}
          </Button>
          <Button variant={props.danger ? 'danger' : 'primary'} onClick={() => { answer(true) }}>
            {props.confirmLabel ?? t('confirm')}
          </Button>
        </Actions>
      </Body>
    </Overlay>
  )
}

export default ConfirmDialog
