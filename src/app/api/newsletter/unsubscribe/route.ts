import { NextResponse } from 'next/server'

import { handle } from '@/server/http'
import { unsubscribe } from '@/server/services/newsletter'

/** Odjava jednim klikom iz linka u mejlu. Nepoznat token daje isti odgovor. */
export const GET = handle(async (request) => {
  const token = request.nextUrl.searchParams.get('token')
  if (token) await unsubscribe(token)

  return new NextResponse('Odjavljeni ste · You are unsubscribed — cloudsheep.dev', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex' },
  })
})
