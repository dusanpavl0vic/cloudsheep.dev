import { Root } from './Spinner.styles'

/** Indikator zauzetosti (dugme koje šalje). Dekorativan — stanje nosi `aria-busy` roditelja. */
const Spinner = ({ size = 16, className }: { size?: number; className?: string }) => (
  <Root $size={size} className={className} aria-hidden="true" />
)

export default Spinner
