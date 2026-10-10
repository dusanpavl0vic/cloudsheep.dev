import NotFoundView from '@/components/errors/NotFoundView'
import Document from '@/components/layout/Document'
import { DEFAULT_LOCALE } from '@/constants/i18n'

/**
 * 404 van jezičkog segmenta — putanje koje proxy ne prepisuje (npr. `/nesto.php`).
 * Engleski, jer adresa nema jezik; `i18n/request.ts` tada vraća podrazumevani.
 */
const GlobalNotFound = () => (
  <Document locale={DEFAULT_LOCALE} theme={null}>
    <NotFoundView />
  </Document>
)

export default GlobalNotFound
