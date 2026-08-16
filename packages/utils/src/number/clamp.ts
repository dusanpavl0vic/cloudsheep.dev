/** Vraća vrednost ograničenu na opseg [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) throw new RangeError(`clamp: min (${String(min)}) je veći od max (${String(max)})`);
  return Math.min(Math.max(value, min), max);
}
