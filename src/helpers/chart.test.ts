import { describe, expect, it } from 'vitest'

import { sparkGeometry } from './chart'

const box = { width: 640, height: 220, padding: 16, headroom: 20 }

describe('sparkGeometry', () => {
  it('manje od dve tačke — nema grafikona', () => {
    expect(sparkGeometry([5], box)).toBeNull()
  })

  it('prva tačka levo, poslednja desno; maksimum na vrhu prostora za crtanje', () => {
    const geometry = sparkGeometry([0, 50, 100], box)
    expect(geometry?.line.startsWith('M16,204')).toBe(true)
    expect(geometry?.last).toEqual({ x: 624, y: 36 })
    expect(geometry?.area.endsWith('L624,204 L16,204 Z')).toBe(true)
  })

  it('dužina je zbir segmenata, mreža ima 4 linije od vrha do dna', () => {
    const geometry = sparkGeometry([10, 10], box)
    expect(geometry?.length).toBe(608)
    expect(geometry?.grid).toEqual([36, 92, 148, 204])
  })
})
