export interface CarouselControlsProps {
  count: number
  active: number
  onPrev: () => void
  onNext: () => void
  onPick: (index: number) => void
  /** Natpisi za čitač ekrana. `dotLabel(i)` → „Prikaži Dušana". */
  prevLabel: string
  nextLabel: string
  dotLabel: (index: number) => string
  className?: string
}
