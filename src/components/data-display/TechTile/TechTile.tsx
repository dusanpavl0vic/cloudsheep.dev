import { Initials, Mark, Root } from './TechTile.styles'

interface TechTileProps {
  label: string
  logoUrl: string | null
  /** Veličina pločice u px; logotip je pola toga. */
  size?: number
  className?: string
}

/** Bela pločica sa logotipom tehnologije; bez logotipa — inicijali. Uvek na beloj podlozi (i u tamnoj temi). */
const TechTile = ({ label, logoUrl, size = 48, className }: TechTileProps) => (
  <Root $size={size} className={className} title={label}>
    {logoUrl ? <Mark src={logoUrl} alt={label} $size={Math.round(size / 2)} loading="lazy" /> : <Initials>{label.slice(0, 2)}</Initials>}
  </Root>
)

export default TechTile
