export type LogoTone = 'default' | 'inverse'

export interface LogoProps {
  /** Visina marke u px (dizajn: 36 u headeru i podnožju, 64 u CTA traci). */
  size?: number
  /** Bez reči — samo ovca (CTA traka). */
  markOnly?: boolean
  /** `inverse` za uvek tamne površine (podnožje). */
  tone?: LogoTone
  /** Lagano ljuljanje marke (`csBob` iz dizajna). */
  animated?: boolean
  className?: string
}
