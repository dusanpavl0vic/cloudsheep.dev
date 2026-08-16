/** Mapa naših dijakritika — `String.normalize` ne razlaže đ/Đ. */
const DIACRITICS: readonly (readonly [string, string])[] = [
  ['č', 'c'], ['ć', 'c'], ['š', 's'], ['ž', 'z'], ['đ', 'dj'],
  ['Č', 'c'], ['Ć', 'c'], ['Š', 's'], ['Ž', 'z'], ['Đ', 'dj'],
];

/** Pretvara tekst u URL-bezbedan slug, uz transliteraciju srpskih dijakritika. */
export function slugify(input: string): string {
  let result = input;
  for (const [from, to] of DIACRITICS) {
    result = result.replaceAll(from, to);
  }

  return result
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
