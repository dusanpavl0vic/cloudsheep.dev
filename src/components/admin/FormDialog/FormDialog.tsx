'use client'

import { useTranslations } from 'next-intl'
import type { ReactNode, SubmitEvent } from 'react'

import Button from '@/components/buttons/Button'
import IconButton from '@/components/buttons/IconButton'
import Overlay from '@/components/overlays/Overlay'

import { Body, Footer, Form, Header, Title } from './FormDialog.styles'

interface FormDialogProps {
  title: string
  onClose: () => void
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void
  isSaving: boolean
  /** Polja; `data-wide` na omotaču raširi polje preko obe kolone. */
  children: ReactNode
}

/** Dijalog sa formom (dodaj/izmeni): naslov, polja u dve kolone, Otkaži/Sačuvaj. */
const FormDialog = ({ title, onClose, onSubmit, isSaving, children }: FormDialogProps) => {
  const t = useTranslations('admin.common')

  return (
    <Overlay label={title} onClose={onClose}>
      <Form noValidate onSubmit={onSubmit}>
        <Header>
          <Title>{title}</Title>
          <IconButton icon="close" label={t('cancel')} onClick={onClose} />
        </Header>
        <Body>{children}</Body>
        <Footer>
          <Button variant="ghost" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button type="submit" loading={isSaving}>
            {t('save')}
          </Button>
        </Footer>
      </Form>
    </Overlay>
  )
}

export default FormDialog
