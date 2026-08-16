export class TimeoutError extends Error {
  constructor(ms: number) {
    super(`Operacija nije završena u ${String(ms)} ms`);
    this.name = 'TimeoutError';
  }
}

/** Odbija promise ako ne završi u zadatom roku. Tajmer se uvek čisti. */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => { reject(new TimeoutError(ms)); }, ms);
  });

  return Promise.race([promise, timeout]).finally(() => { clearTimeout(timer); });
}
