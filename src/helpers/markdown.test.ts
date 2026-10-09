import { describe, expect, it } from 'vitest'

import { countWords, renderMarkdown } from './markdown'

describe('renderMarkdown', () => {
  it('renderuje osnovni markdown', () => {
    expect(renderMarkdown('# Naslov\n\nTekst **bold**.')).toContain('<strong>bold</strong>')
  })

  it('ekranira sirov HTML iz izvora', () => {
    const html = renderMarkdown('<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>')
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('<img')
    expect(html).toContain('&lt;script&gt;')
  })

  it('ne pravi link od javascript: sheme', () => {
    expect(renderMarkdown('[klik](javascript:alert(1))')).toContain('href="#"')
  })

  it('spoljni link otvara novi tab bez pristupa opener-u', () => {
    expect(renderMarkdown('[sajt](https://cloudsheep.dev)')).toContain('rel="noopener noreferrer"')
  })

  it('broji reči', () => {
    expect(countWords('  jedan  dva\ntri ')).toBe(3)
  })
})
