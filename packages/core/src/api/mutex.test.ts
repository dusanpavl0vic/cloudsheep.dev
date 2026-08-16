import { describe, expect, it } from 'vitest'

import { Mutex } from './mutex'

describe('Mutex', () => {
  it('slobodna je na početku', () => {
    expect(new Mutex().isLocked).toBe(false)
  })

  it('zauzeta je posle acquire', async () => {
    const mutex = new Mutex()
    await mutex.acquire()
    expect(mutex.isLocked).toBe(true)
  })

  it('oslobađa se posle release', async () => {
    const mutex = new Mutex()
    const release = await mutex.acquire()
    release()
    expect(mutex.isLocked).toBe(false)
  })

  it('serijalizuje pristup — ovo je ceo razlog postojanja', async () => {
    const mutex = new Mutex()
    const order: string[] = []

    const task = async (name: string) => {
      const release = await mutex.acquire()
      order.push(`${name}:ulaz`)
      await Promise.resolve()
      order.push(`${name}:izlaz`)
      release()
    }

    await Promise.all([task('a'), task('b'), task('c')])

    // Nijedan ulaz ne sme upasti između tuđeg ulaza i izlaza
    expect(order).toEqual([
      'a:ulaz', 'a:izlaz',
      'b:ulaz', 'b:izlaz',
      'c:ulaz', 'c:izlaz',
    ])
  })

  it('samo jedan zadatak radi refresh dok ostali čekaju', async () => {
    const mutex = new Mutex()
    let refreshCount = 0

    const maybeRefresh = async () => {
      if (mutex.isLocked) {
        await mutex.waitForUnlock()
        return
      }
      const release = await mutex.acquire()
      refreshCount += 1
      await Promise.resolve()
      release()
    }

    await Promise.all(Array.from({ length: 5 }, () => maybeRefresh()))
    expect(refreshCount).toBe(1)
  })

  it('waitForUnlock se odmah vraća kad je brava slobodna', async () => {
    await expect(new Mutex().waitForUnlock()).resolves.toBeUndefined()
  })

  it('waitForUnlock čeka otpuštanje', async () => {
    const mutex = new Mutex()
    const release = await mutex.acquire()

    let unlocked = false
    const waiter = mutex.waitForUnlock().then(() => { unlocked = true })

    await Promise.resolve()
    expect(unlocked).toBe(false)

    release()
    await waiter
    expect(unlocked).toBe(true)
  })

  it('dvostruko otpuštanje ne pušta dva čekaoca odjednom', async () => {
    const mutex = new Mutex()
    const release = await mutex.acquire()

    release()
    release()

    expect(mutex.isLocked).toBe(false)

    const second = await mutex.acquire()
    expect(mutex.isLocked).toBe(true)
    second()
  })

  it('brava se može ponovo zauzeti posle otpuštanja', async () => {
    const mutex = new Mutex()
    for (let i = 0; i < 3; i += 1) {
      const release = await mutex.acquire()
      expect(mutex.isLocked).toBe(true)
      release()
      expect(mutex.isLocked).toBe(false)
    }
  })
})
