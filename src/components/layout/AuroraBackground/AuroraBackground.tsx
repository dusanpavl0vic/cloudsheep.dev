import { AURORA_BLOBS } from './AuroraBackground.constants'
import { Blob, Root, Veil } from './AuroraBackground.styles'

/** Ambijentalno svetlo iza stakla — fiksirano, dekorativno, bez JS-a. */
const AuroraBackground = () => (
  <Root aria-hidden="true">
    {AURORA_BLOBS.map((blob) => (
      <Blob key={blob.durationS} $blob={blob} />
    ))}
    <Veil />
  </Root>
)

export default AuroraBackground
