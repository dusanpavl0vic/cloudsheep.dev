import { NextResponse } from 'next/server'

import { handleAdmin } from '@/server/auth/session'
import { exportSubscribersCsv } from '@/server/services/newsletter'

export const GET = handleAdmin(
  async () =>
    new NextResponse(await exportSubscribersCsv(), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="newsletter.csv"',
      },
    }),
)
