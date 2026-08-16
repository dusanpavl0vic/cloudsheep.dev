import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { pRetry } from './pRetry';

describe('pRetry', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('vraća rezultat iz prvog uspešnog pokušaja', async () => {
    const op = vi.fn().mockResolvedValue('ok');
    await expect(pRetry(op)).resolves.toBe('ok');
    expect(op).toHaveBeenCalledTimes(1);
  });

  it('ponavlja dok ne uspe', async () => {
    const op = vi
      .fn()
      .mockRejectedValueOnce(new Error('1'))
      .mockRejectedValueOnce(new Error('2'))
      .mockResolvedValue('ok');

    const promise = pRetry(op, { backoff: 10 });
    await vi.runAllTimersAsync();

    await expect(promise).resolves.toBe('ok');
    expect(op).toHaveBeenCalledTimes(3);
  });

  it('baca poslednju grešku kad se pokušaji potroše', async () => {
    const op = vi.fn().mockRejectedValue(new Error('uvek pada'));
    const promise = pRetry(op, { retries: 2, backoff: 10 });
    const assertion = expect(promise).rejects.toThrow('uvek pada');
    await vi.runAllTimersAsync();
    await assertion;
    expect(op).toHaveBeenCalledTimes(3);
  });

  it('odustaje odmah kad shouldRetry vrati false', async () => {
    const op = vi.fn().mockRejectedValue(new Error('4xx'));
    const promise = pRetry(op, { retries: 5, backoff: 10, shouldRetry: () => false });
    const assertion = expect(promise).rejects.toThrow('4xx');
    await vi.runAllTimersAsync();
    await assertion;
    expect(op).toHaveBeenCalledTimes(1);
  });

  it('čeka eksponencijalno duže između pokušaja', async () => {
    const op = vi.fn().mockRejectedValue(new Error('x'));
    const promise = pRetry(op, { retries: 2, backoff: 100 });
    const assertion = expect(promise).rejects.toThrow();

    await vi.advanceTimersByTimeAsync(100); // prvi backoff
    expect(op).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(200); // drugi backoff, udvostručen
    expect(op).toHaveBeenCalledTimes(3);

    await assertion;
  });
});
