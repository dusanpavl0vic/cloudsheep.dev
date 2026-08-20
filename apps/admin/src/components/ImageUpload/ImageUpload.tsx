import { useId, type ReactNode } from 'react'

import { Button, Spinner } from '@app/ui'

import { dropzoneVariants, previewImageVariants, previewVariants } from './ImageUpload.variants'

interface ImageUploadProps {
  label: ReactNode
  /** Adresa trenutne slike, ili `null` kad je nema. */
  value: string | null
  /** Opis za pregled — bez njega je slika za screen reader prazan element. */
  alt: string
  /** Zove se kad korisnik izabere datoteku. Otpremanje radi sloj iznad. */
  onFile: (file: File) => void
  onRemove?: () => void
  isUploading?: boolean
  /** Već prevedena poruka. */
  error?: ReactNode
  /** Tekst dugmeta i pomoćni tekst — komponenta ne zna za i18n (packages/ui pravilo). */
  chooseLabel: string
  removeLabel: string
  hint?: ReactNode
  uploadingLabel: string
}

/**
 * Izbor i pregled jedne slike.
 *
 * Namerno **nije** u `packages/ui`: zna za oblik naših upload odgovora i za dugme
 * „ukloni", pa je deljena komponenta ove app-e (`docs/02` — dva feature-a, jedna app).
 *
 * Sama ne otprema. Otpremanje je mrežna radnja, dakle posao hook-a; komponenta samo javlja
 * koju je datoteku korisnik izabrao.
 */
export const ImageUpload = ({
  label,
  value,
  alt,
  onFile,
  onRemove,
  isUploading = false,
  error,
  chooseLabel,
  removeLabel,
  hint,
  uploadingLabel,
}: ImageUploadProps) => {
  const inputId = useId()
  const errorId = `${inputId}-error`

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-foreground text-[14.5px] font-medium">{label}</span>

      <div className={dropzoneVariants({ state: error ? 'error' : isUploading ? 'busy' : 'idle' })}>
        <div className={previewVariants()}>
          {isUploading ? (
            <Spinner size="sm" label={uploadingLabel} />
          ) : value ? (
            <img src={value} alt={alt} className={previewImageVariants()} />
          ) : (
            <span aria-hidden className="text-muted-foreground text-[11px]">
              —
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              {/* Nativni `<input type="file">` je skriven, a labela je dugme: tako se
                  zadržava tastatura i screen reader, a dobija se izgled dugmeta. */}
              <label htmlFor={inputId}>{chooseLabel}</label>
            </Button>
            {value && onRemove && (
              <Button variant="ghost" size="sm" onClick={onRemove}>
                {removeLabel}
              </Button>
            )}
          </div>
          {hint && <span className="text-muted-foreground text-[13px]">{hint}</span>}
        </div>

        <input
          id={inputId}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
          className="sr-only"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) onFile(file)
            // Reset da izbor ISTE datoteke ponovo okine `change`
            event.target.value = ''
          }}
        />
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  )
}
