import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TimeoutError, withTimeout } from './withTimeout';

describe('withTimeout', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('propušta rezultat kad stigne na vreme', async () => {
    await expect(withTimeout(Promise.resolve('ok'), 100)).resolves.toBe('ok');
  });

  it('propušta grešku iz originalnog promise-a', async () => {
    await expect(withTimeout(Promise.reject(new Error('pukao')), 100)).rejects.toThrow('pukao');
  });

  it('odbija sa TimeoutError kad rok istekne', async () => {
    const never = new Promise<string>(() => undefined);
    const promise = withTimeout(never, 50);
    const assertion = expect(promise).rejects.toBeInstanceOf(TimeoutError);
    await vi.advanceTimersByTimeAsync(50);
    await assertion;
  });

  it('poruka greške sadrži rok', async () => {
    const never = new Promise<string>(() => undefined);
    const promise = withTimeout(never, 30);
    const assertion = expect(promise).rejects.toThrow('30 ms');
    await vi.advanceTimersByTimeAsync(30);
    await assertion;
  });
});
