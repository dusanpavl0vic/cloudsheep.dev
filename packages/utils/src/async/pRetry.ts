import { sleep } from './sleep';

interface RetryOptions {
  /** Broj ponovnih pokušaja posle prvog neuspeha. */
  retries?: number;
  /** Početno čekanje u ms; udvostručuje se posle svakog pokušaja. */
  backoff?: number;
  /** Vraća false da bi se odustalo bez daljih pokušaja (npr. 4xx nema smisla ponavljati). */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

/** Ponavlja operaciju uz eksponencijalno čekanje. */
export async function pRetry<T>(
  operation: () => Promise<T>,
  { retries = 3, backoff = 100, shouldRetry = () => true }: RetryOptions = {},
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === retries || !shouldRetry(error, attempt)) break;
      await sleep(backoff * 2 ** attempt);
    }
  }

  throw lastError;
}
