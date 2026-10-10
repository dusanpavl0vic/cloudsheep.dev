import { Frame, Image } from './Cover.styles'
import type { CoverProps } from './Cover.types'

/** Naslovna slika kartice u okviru zadatog odnosa stranica; bez slike — gradijent. */
const Cover = ({ image, fallbackAlt, ratio = '16 / 11', radius = 16, eager = false, className }: CoverProps) => (
  <Frame $ratio={ratio} $radius={radius} className={className}>
    {image && (
      <Image
        src={image.url}
        alt={image.alt || fallbackAlt}
        width={image.width}
        height={image.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    )}
  </Frame>
)

export default Cover
