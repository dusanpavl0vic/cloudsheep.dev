import { Initials, Mark, Root } from './TechTile.styles'

interface TechTileProps {
  label: string
  logoUrl: string | null
  /** Veličina pločice u px; logotip je pola toga. */
  size?: number
  className?: string
  /** Naziv je već ispisan pored pločice — logotip je tada ukras (`alt=""`), da se ne čita dvaput. */
  captioned?: boolean
}

/** Bela pločica sa logotipom tehnologije; bez logotipa — inicijali. Uvek na beloj podlozi (i u tamnoj temi). */
const TechTile = ({ label, logoUrl, size = 48, className, captioned = false }: TechTileProps) => (
  <Root $size={size} className={className} title={label}>
    {logoUrl ? (
      <Mark
        src={logoUrl}
        alt={captioned ? '' : label}
        $size={Math.round(size / 2)}
        loading="lazy"
      />
    ) : (
      <Initials>{label.slice(0, 2)}</Initials>
    )}
  </Root>
)

export default TechTile
