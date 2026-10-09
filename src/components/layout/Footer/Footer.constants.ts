/** Skraćenice u krugovima (dizajn: GH · in · @). Nepoznata platforma → prva dva slova. */
export const SOCIAL_SHORT: Record<string, string> = {
  github: 'GH',
  linkedin: 'in',
  email: '@',
  x: 'X',
  instagram: 'IG',
  dribbble: 'Dr',
}

export const shortFor = (platform: string) => SOCIAL_SHORT[platform] ?? platform.slice(0, 2).toUpperCase()
