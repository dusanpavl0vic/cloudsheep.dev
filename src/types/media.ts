/** Slika sa dimenzijama — bez njih `<img>` poskakuje dok se učitava (CLS, docs/07 §7). */
export interface ImageRef {
  url: string
  width: number
  height: number
  alt: string
}

/** Otpremljena datoteka u admin-u. */
export interface Asset {
  id: string
  url: string
  mimeType: string
  sizeBytes: number
  width: number
  height: number
  label: string
}
