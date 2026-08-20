import { describe, expect, it } from 'vitest'

import { autoReplyHtml } from './mailTemplate.ts'

const copy = {
  greeting: (name: string) => `Zdravo ${name},`,
  lead: 'poruka je stigla',
  note: 'napomena',
  cta: 'Pogledaj radove',
  signoff: 'Srdačno',
}

describe('autoReplyHtml', () => {
  it('umeće ime u pozdrav', () => {
    expect(autoReplyHtml('Marko', copy)).toContain('Zdravo Marko,')
  })

  /*
   * Ime dolazi iz JAVNE forme, od nepoznate osobe.
   *
   * Bez ekraniranja bi `<img src=x onerror=...>` završio kao živ HTML u tuđem sandučetu.
   * Ovo je jedini test u fajlu koji štiti od stvarne štete, ne od ružnog izgleda.
   */
  it('ekranira zlonameran unos umesto da ga izvrši', () => {
    const html = autoReplyHtml('<img src=x onerror="alert(1)">', copy)

    expect(html).toContain('&lt;img')
    expect(html).not.toContain('<img src=x')
    expect(html).not.toContain('onerror="alert')
  })

  it('ekranira navodnike i ampersand', () => {
    const html = autoReplyHtml(`Ana "A" & Co`, copy)

    expect(html).toContain('&quot;')
    expect(html).toContain('&amp;')
  })

  /* Gmail uklanja `<style>` blokove u prosleđenim porukama — stil mora biti inline. */
  it('stil je inline, bez <style> bloka', () => {
    const html = autoReplyHtml('Marko', copy)

    expect(html).toContain('style="')
    expect(html).not.toContain('<style>')
  })

  /* Outlook renderuje Word engine-om i moderan raspored ne razume. */
  it('raspored ide kroz tabelu', () => {
    expect(autoReplyHtml('Marko', copy)).toContain('<table role="presentation"')
  })

  /* Klijenti blokiraju daljinske slike dok ih korisnik ne dozvoli. */
  it('nema spoljnih slika', () => {
    expect(/<img[^>]+src="http/.test(autoReplyHtml('Marko', copy))).toBe(false)
  })

  it('ostaje ispod Gmail granice od 102 KB', () => {
    // Preko toga Gmail seče poruku i dodaje „prikaži ceo sadržaj"
    expect(autoReplyHtml('Marko', copy).length).toBeLessThan(102_400)
  })
})
