/** Adresa studija iz `mailto:` linka profila (podnožje, CTA traka); `null` kad je nema. */
export const emailFrom = (links: readonly { platform: string; url: string }[]) =>
  links.find((link) => link.platform === 'email')?.url.replace(/^mailto:/, '') ?? null
