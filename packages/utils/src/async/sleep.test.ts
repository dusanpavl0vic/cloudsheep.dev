import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sleep } from './sleep';

describe('sleep', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('razrešava se posle zadatog vremena', async () => {
    let done = false;
    const promise = sleep(100).then(() => { done = true; });

    await vi.advanceTimersByTimeAsync(99);
    expect(done).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    await promise;
    expect(done).toBe(true);
  });

  it('nula se razrešava odmah po isteku reda', async () => {
    const promise = sleep(0);
    await vi.advanceTimersByTimeAsync(0);
    await expect(promise).resolves.toBeUndefined();
  });
});
