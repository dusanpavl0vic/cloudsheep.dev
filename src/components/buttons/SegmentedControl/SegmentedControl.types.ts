export interface SegmentOption<V extends string> {
  value: V
  label: string
  /** Pun naziv za čitač ekrana kad je `label` skraćen („EN" → „English"). */
  ariaLabel?: string
}

export interface SegmentedControlProps<V extends string> {
  options: readonly SegmentOption<V>[]
  value: V
  onChange: (value: V) => void
  /** Ime grupe za čitač ekrana. */
  label: string
  /** `mono` — skraćenice u JetBrains Mono (izbor jezika u headeru). */
  mono?: boolean
  className?: string
}
