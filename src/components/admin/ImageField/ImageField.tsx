'use client'

import { useTranslations } from 'next-intl'
import { useId } from 'react'

import Button from '@/components/buttons/Button'
import Icon from '@/components/foundations/Icon'
import { useImageUpload } from '@/hooks/admin'
import type { Asset } from '@/types/media'

import { FileInput, Label, Preview, Root, Row } from './ImageField.styles'

interface ImageFieldProps {
  label: string
  /** Trenutna slika (URL za pregled); `null` — nema je. */
  url: string | null
  onChange: (asset: Asset | null) => void
  /** Okrugao pregled (avatar). */
  round?: boolean
}

/** Slika u admin formi: pregled + otpremi/zameni/ukloni. Otpremanje odmah, čuvanje sa formom. */
const ImageField = ({ label, url, onChange, round = false }: ImageFieldProps) => {
  const t = useTranslations('admin.common')
  const inputId = useId()
  const { pick, isUploading } = useImageUpload(onChange)

  return (
    <Root>
      <Label id={`${inputId}-label`}>{label}</Label>
      <Row>
        <Preview $round={round}>{url ? <img src={url} alt="" /> : <Icon name="upload" size={20} />}</Preview>
        <FileInput
          id={inputId}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          aria-labelledby={`${inputId}-label`}
          onChange={(event) => {
            void pick(event.currentTarget.files?.[0])
            event.currentTarget.value = ''
          }}
        />
        <Button
          variant="secondary"
          size="s"
          loading={isUploading}
          onClick={() => {
            document.getElementById(inputId)?.click()
          }}
        >
          {t(url ? 'replace' : 'upload')}
        </Button>
        {url && (
          <Button
            variant="ghost"
            size="s"
            onClick={() => {
              onChange(null)
            }}
          >
            {t('remove')}
          </Button>
        )}
      </Row>
    </Root>
  )
}

export default ImageField
