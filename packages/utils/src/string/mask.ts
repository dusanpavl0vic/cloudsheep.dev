/** Krije sve osim poslednjih `visible` znakova — za kartice, telefone, tokene u logu. */
export function mask(input: string, visible = 4, maskChar = '*'): string {
  if (visible <= 0) return maskChar.repeat(input.length);
  if (input.length <= visible) return input;
  return maskChar.repeat(input.length - visible) + input.slice(-visible);
}
