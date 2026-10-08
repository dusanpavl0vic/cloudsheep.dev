import 'server-only'

import { Prisma } from '@prisma/client'
import { NextResponse, type NextRequest } from 'next/server'
import type { ZodType } from 'zod'

import { HTTP_STATUS } from '@/constants/http'

import { log } from './log'

/** Šta klijent dobija uz grešku: ključ prevoda i, kad se zna, polje forme koje je krivo. */
export interface ErrorDetails {
  field?: string
  /** Predlog ispravke (npr. „gmail.com" za „gmial.com"). */
  suggestion?: string
}

/**
 * Greška sa namernim statusom i i18n ključem (`messageKey` je ključ, ne tekst — prevod bira
 * klijent, jedini koji zna izabran jezik). `details.field` klijent prosleđuje `setError`-u na
 * to polje: greška NA POLJU, ne toast (docs/10-forms-validation.md).
 */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly messageKey: string,
    readonly details?: ErrorDetails,
  ) {
    super(messageKey)
    this.name = 'HttpError'
  }
}

/** Prisma greške koje ZAISTA znače nešto klijentu; sve ostalo je 500 i ide u log. */
const fromPrisma = (error: Prisma.PrismaClientKnownRequestError): HttpError | null => {
  switch (error.code) {
    case 'P2002': {
      const target = error.meta?.target
      const field = Array.isArray(target) ? String(target[0]) : undefined
      return new HttpError(HTTP_STATUS.CONFLICT, 'errors.conflict', field ? { field } : undefined)
    }
    case 'P2025':
      return new HttpError(HTTP_STATUS.NOT_FOUND, 'errors.notFound')
    case 'P2003':
      return new HttpError(HTTP_STATUS.BAD_REQUEST, 'errors.badRequest')
    default:
      return null
  }
}

/**
 * Poslednji sloj: detalj greške ide u log, klijentu samo ključ. Poruka iz baze ili stack u
 * odgovoru je curenje informacija (docs/20-security.md) — i ranije je baš takav tekst Google
 * indeksirao kao „stranice".
 */
export const toErrorResponse = (error: unknown) => {
  const known =
    error instanceof HttpError
      ? error
      : error instanceof Prisma.PrismaClientKnownRequestError
        ? fromPrisma(error)
        : null

  if (known) {
    return NextResponse.json(
      { messageKey: known.messageKey, ...(known.details ? { details: known.details } : {}) },
      { status: known.status },
    )
  }

  log.error('neuhvaćena greška u API-ju', error)
  return NextResponse.json({ messageKey: 'errors.unexpected' }, { status: HTTP_STATUS.INTERNAL })
}

export type RouteParams = Record<string, string | string[]>

export interface RouteContext<P extends RouteParams = RouteParams> {
  params: Promise<P>
}

type Handler<P extends RouteParams> = (
  request: NextRequest,
  context: RouteContext<P>,
) => Promise<Response>

/** Omotač za svaki route handler — nijedna greška ne izlazi kao stack trace. */
export const handle =
  <P extends RouteParams = RouteParams>(handler: Handler<P>) =>
  async (request: NextRequest, context: RouteContext<P>) => {
    try {
      return await handler(request, context)
    } catch (error) {
      return toErrorResponse(error)
    }
  }

export const json = (data: unknown, status: number = HTTP_STATUS.OK) =>
  NextResponse.json(data, { status })

export const noContent = () => new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT })

/** Najveće JSON telo koje prihvatamo (forma upita je najveća, ispod 10 KB). */
const MAX_JSON_BYTES = 100_000

/**
 * Pročita JSON telo i proveri ga šemom. Neispravno telo je 400 sa ključem `invalidKey`;
 * prvo neispravno polje ide u `details.field`.
 */
export const readJson = async <T>(
  request: NextRequest,
  schema: ZodType<T>,
  invalidKey = 'errors.badRequest',
) => {
  const length = Number(request.headers.get('content-length') ?? 0)
  if (length > MAX_JSON_BYTES)
    throw new HttpError(HTTP_STATUS.PAYLOAD_TOO_LARGE, 'errors.payloadTooLarge')

  let body: unknown
  try {
    const text = await request.text()
    if (text.length > MAX_JSON_BYTES)
      throw new HttpError(HTTP_STATUS.PAYLOAD_TOO_LARGE, 'errors.payloadTooLarge')
    body = text ? JSON.parse(text) : {}
  } catch (error) {
    if (error instanceof HttpError) throw error
    throw new HttpError(HTTP_STATUS.BAD_REQUEST, invalidKey)
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0]
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      invalidKey,
      typeof field === 'string' ? { field } : undefined,
    )
  }
  return parsed.data
}

/** Query parametri kroz šemu (`?status=unread`). */
export const readQuery = <T>(request: NextRequest, schema: ZodType<T>) => {
  const parsed = schema.safeParse(Object.fromEntries(request.nextUrl.searchParams))
  if (!parsed.success) throw new HttpError(HTTP_STATUS.BAD_REQUEST, 'errors.badRequest')
  return parsed.data
}
