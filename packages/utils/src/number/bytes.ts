const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;

/** Formatira broj bajtova u čitljiv oblik (binarni, 1024). */
export function bytes(value: number, decimals = 1): string {
  if (!Number.isFinite(value)) return '—';
  const negative = value < 0;
  const abs = Math.abs(value);
  if (abs < 1) return `${negative ? '-' : ''}0 B`;

  const exponent = Math.min(Math.floor(Math.log(abs) / Math.log(1024)), UNITS.length - 1);
  /* v8 ignore next -- exponent je Math.min-om ograničen na opseg UNITS, fallback je nedostižan */
  const unit = UNITS[exponent] ?? 'B';
  const size = abs / 1024 ** exponent;
  const factor = 10 ** decimals;
  const rounded = Math.round(size * factor) / factor;

  return `${negative ? '-' : ''}${String(rounded)} ${unit}`;
}
