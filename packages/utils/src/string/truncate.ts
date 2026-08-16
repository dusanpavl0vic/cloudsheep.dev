/** Skraćuje tekst na `max` znakova, uz sufiks koji se računa u dužinu. */
export function truncate(input: string, max: number, suffix = '…'): string {
  if (max <= 0) return '';
  if (input.length <= max) return input;
  if (suffix.length >= max) return suffix.slice(0, max);
  return input.slice(0, max - suffix.length).trimEnd() + suffix;
}
