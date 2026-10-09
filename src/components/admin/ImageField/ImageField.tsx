'use client'

import { useTranslations } from 'next-intl'

import Button from '@/components/buttons/Button'
import Icon from '@/components/foundations/Icon'
import { useImageUpload } from '@/hooks/admin'
import type { Asset } from '@/types/media'

import UploadButton from '../UploadButton'
import { Label, Preview, Root, Row } from './ImageField.styles'

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
  const { pick, isUploading } = useImageUpload(onChange)

  return (
    <Root role="group" aria-label={label}>
      <Label>{label}</Label>
      <Row>
        <Preview $round={round}>{url ? <img src={url} alt="" /> : <Icon name="upload" size={20} />}</Preview>
        <UploadButton label={t(url ? 'replace' : 'upload')} onPick={(file) => void pick(file)} isUploading={isUploading} />
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
