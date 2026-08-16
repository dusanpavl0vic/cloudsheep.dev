import { describe, expect, it, vi } from 'vitest'

import { createLogger, type LogLevel, type LogTransport } from './logger'

function spyTransport() {
  const calls: { level: LogLevel; message: string; context?: Record<string, unknown> }[] = []
  const transport: LogTransport = {
    log: (level, message, context) => {
      calls.push(context === undefined ? { level, message } : { level, message, context })
    },
  }
  return { transport, calls }
}

describe('createLogger', () => {
  it.each(['debug', 'info', 'warn', 'error'] as const)('prosleđuje %s transportu', (level) => {
    const { transport, calls } = spyTransport()
    createLogger(transport)[level]('poruka')

    expect(calls).toEqual([{ level, message: 'poruka' }])
  })

  it('prosleđuje kontekst', () => {
    const { transport, calls } = spyTransport()
    createLogger(transport).error('pao zahtev', { status: 500 })

    expect(calls[0]?.context).toEqual({ status: 500 })
  })

  it('filtrira ispod minimalnog nivoa', () => {
    const { transport, calls } = spyTransport()
    const logger = createLogger(transport, 'warn')

    logger.debug('a')
    logger.info('b')
    logger.warn('c')
    logger.error('d')

    expect(calls.map((call) => call.level)).toEqual(['warn', 'error'])
  })

  it('podrazumevani nivo propušta sve', () => {
    const { transport, calls } = spyTransport()
    const logger = createLogger(transport)

    logger.debug('a')
    logger.error('b')

    expect(calls).toHaveLength(2)
  })

  it('podrazumevani transport piše u console', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    createLogger().warn('upozorenje')

    expect(spy).toHaveBeenCalledWith('upozorenje', '')
    spy.mockRestore()
  })

  it('debug ide na console.log — console.debug je sakriven u većini browsera', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    createLogger().debug('detalj')

    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
