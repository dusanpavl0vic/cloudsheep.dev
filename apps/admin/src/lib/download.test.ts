import { afterEach, describe, expect, it, vi } from 'vitest'

import { downloadBlob } from './download'

describe('downloadBlob', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  const stubObjectUrl = () => {
    const create = vi.fn(() => 'blob:test')
    const revoke = vi.fn()

    vi.stubGlobal('URL', { ...URL, createObjectURL: create, revokeObjectURL: revoke })
    return { create, revoke }
  }

  it('klikće link sa traženim imenom datoteke', () => {
    stubObjectUrl()
    const clicked: HTMLAnchorElement[] = []
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function click(
      this: HTMLAnchorElement,
    ) {
      clicked.push(this)
    })

    downloadBlob(new Blob(['x']), 'Dusan-CV-sr.pdf')

    expect(clicked).toHaveLength(1)
    expect(clicked[0]?.download).toBe('Dusan-CV-sr.pdf')
    expect(clicked[0]?.href).toBe('blob:test')
  })

  it('oslobađa adresu — zaboravljen `revoke` drži ceo PDF u memoriji', () => {
    const { create, revoke } = stubObjectUrl()
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)

    downloadBlob(new Blob(['x']), 'a.pdf')

    expect(create).toHaveBeenCalledTimes(1)
    expect(revoke).toHaveBeenCalledWith('blob:test')
  })

  it('ne ostavlja `<a>` u dokumentu', () => {
    stubObjectUrl()
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)

    downloadBlob(new Blob(['x']), 'a.pdf')

    expect(document.querySelectorAll('a')).toHaveLength(0)
  })
})
