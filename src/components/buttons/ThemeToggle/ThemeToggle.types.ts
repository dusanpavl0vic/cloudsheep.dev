export interface ThemeToggleProps {
  isDark: boolean
  /** Dobija dugme — prelaz teme se širi iz njegovog centra. */
  onToggle: (origin: HTMLButtonElement) => void
  label: string
  className?: string
}
