import { NextResponse } from 'next/server'

import { HTTP_STATUS } from '@/constants/http'
import { handleAdmin } from '@/server/auth/session'
import { HttpError } from '@/server/http'
import { renderCvPdf } from '@/server/services/team'

/** pdfkit traži Node runtime (fs za fontove). */
export const runtime = 'nodejs'

export const GET = handleAdmin<{ id: string }>(async (request, { params }) => {
  const lang = request.nextUrl.searchParams.get('lang') === 'en' ? 'en' : 'sr'
  const result = await renderCvPdf((await params).id, lang)
  if (!result) throw new HttpError(HTTP_STATUS.NOT_FOUND, 'errors.notFound')

  return new NextResponse(new Uint8Array(result.pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': String(result.pdf.length),
      'Content-Disposition': `attachment; filename="${result.filename}"`,
    },
  })
})
