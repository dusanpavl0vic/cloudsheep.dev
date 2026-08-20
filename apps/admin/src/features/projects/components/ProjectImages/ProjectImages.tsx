import { useTranslation } from 'react-i18next'

import { ImageUpload } from '@/components/ImageUpload'
import { Button, Input, Label } from '@app/ui'

import { useProjectImages } from '../../hooks/useProjectImages'
import type { ProjectImage } from '../../types'

interface ProjectImagesProps {
  projectId: string | undefined
  images: readonly ProjectImage[]
}

/**
 * Galerija projekta u adminu: otpremanje, opis po jeziku, redosled, brisanje.
 *
 * Slike se čuvaju ODMAH, nezavisno od dugmeta „Sačuvaj" na formi. Razlog je što otpremanje
 * već jeste mrežna radnja sa svojim ishodom — vezivati je za čuvanje forme značilo bi da
 * otpremljena datoteka visi bez zapisa ako korisnik odustane.
 */
export const ProjectImages = ({ projectId, images }: ProjectImagesProps) => {
  const { t } = useTranslation(['projects', 'common'])
  const { add, setAlt, move, removeImage, isBusy } = useProjectImages(projectId)

  if (!projectId) {
    return <p className="text-muted-foreground text-[15px]">{t('projects.images.saveFirst')}</p>
  }

  return (
    <div className="flex flex-col gap-5">
      <ImageUpload
        label={t('projects.images.add')}
        value={null}
        alt=""
        isUploading={isBusy}
        chooseLabel={t('projects.images.choose')}
        removeLabel={t('common:common.delete')}
        uploadingLabel={t('projects.images.uploading')}
        hint={t('projects.images.hint')}
        onFile={(file) => {
          void add(file)
        }}
      />

      {images.length > 0 && (
        <ul className="flex flex-col gap-4">
          {images.map((image, index) => (
            <li
              key={image.id}
              className="border-border flex flex-wrap items-start gap-4 rounded-xl border p-4"
            >
              <img
                src={image.url}
                alt=""
                width={image.width}
                height={image.height}
                className="border-border h-20 w-28 shrink-0 rounded-lg border object-cover"
              />

              <div className="flex min-w-[220px] flex-1 flex-col gap-2">
                {(['Sr', 'En'] as const).map((locale) => {
                  const key = `alt${locale}` as const
                  return (
                    <div key={locale} className="flex items-center gap-2">
                      <Label htmlFor={`${image.id}-${key}`} className="mb-0 w-16 shrink-0">
                        {t(`projects.images.alt${locale}`)}
                      </Label>
                      <Input
                        id={`${image.id}-${key}`}
                        defaultValue={image[key]}
                        // `onBlur`, ne `onChange`: upis na svaki pritisak tastera bio bi
                        // zahtev po znaku
                        onBlur={(event) => {
                          if (event.target.value !== image[key]) {
                            setAlt(image.id, { [key]: event.target.value })
                          }
                        }}
                      />
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={index === 0}
                  aria-label={t('projects.images.moveUp')}
                  onClick={() => {
                    move(images, index, -1)
                  }}
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={index === images.length - 1}
                  aria-label={t('projects.images.moveDown')}
                  onClick={() => {
                    move(images, index, 1)
                  }}
                >
                  ↓
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    removeImage(image.id)
                  }}
                >
                  {t('common:common.delete')}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
