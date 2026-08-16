/**
 * Najmanji mogući mutex.
 *
 * Postoji zbog jednog konkretnog scenarija (docs/11-data-fetching.md): pet paralelnih
 * zahteva dobije 401 u isto vreme. Bez brave svih pet pokrene refresh, backend izda pet
 * novih tokena, i četiri poništavaju peti — korisnik biva odjavljen usred rada.
 *
 * Sa bravom prvi radi refresh, ostali čekaju pa ponove originalni zahtev.
 * Paket `async-mutex` bi bio ~3 KB za ovo.
 */
export class Mutex {
  /** Promise koji se razrešava kad se trenutna brava otpusti; `null` kad je slobodna. */
  #current: Promise<void> | null = null

  get isLocked(): boolean {
    return this.#current !== null
  }

  /** Zauzima bravu, čekajući red. Vraća funkciju za otpuštanje (bezbedna na dvostruki poziv). */
  async acquire(): Promise<() => void> {
    // `while`, ne `if` — između buđenja i zauzimanja neko drugi može preuzeti bravu
    while (this.#current) {
      await this.#current
    }

    let resolveCurrent!: () => void
    const held = new Promise<void>((resolve) => {
      resolveCurrent = resolve
    })
    this.#current = held

    let released = false
    return () => {
      if (released) return
      released = true
      // Oslobodi samo ako je i dalje naša brava
      if (this.#current === held) this.#current = null
      resolveCurrent()
    }
  }

  /** Čeka da brava bude slobodna, bez zauzimanja. */
  async waitForUnlock(): Promise<void> {
    while (this.#current) {
      await this.#current
    }
  }
}
