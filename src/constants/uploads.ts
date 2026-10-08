/** Javna putanja otpremljenih slika (servira `app/uploads/[...path]/route.ts`). */
export const UPLOADS_PATH = '/uploads'

/** Tipovi koje admin sme da otpremi — provera je po magičnim bajtovima, ne po imenu. */
export const UPLOAD_ACCEPT = 'image/png,image/jpeg,image/webp,image/avif,image/svg+xml'
