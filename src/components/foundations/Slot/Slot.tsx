import type { SlotProps } from './Slot.types'

/** Renderuje `component` sa ostalim prop-ovima — zamena za `as` u next-yak-u. */
const Slot = ({ component: Component, ...rest }: SlotProps) => <Component {...rest} />

export default Slot
