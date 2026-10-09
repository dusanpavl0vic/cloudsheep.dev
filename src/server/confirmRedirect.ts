import 'server-only'

import { NextResponse, type NextRequest } from 'next/server'

import type { ConfirmStatus } from '@/constants/confirmation'
import { HTTP_STATUS } from '@/constants/http'
import type { Locale } from '@/constants/i18n'
import { localizedPath } from '@/helpers/seo'

/** Token iz obične HTML forme (stranica potvrde radi i bez JS-a). */
export const readFormToken = async (request: NextRequest) => {
  const form = await request.formData().catch(() => null)
  const token = form?.get('token')
  return typeof token === 'string' ? token.slice(0, 200) : ''
}

/**
 * 303 nazad na stranicu potvrde sa ishodom — token više nije u adresi. `Location` je relativan:
 * iza Traefika `request.url` nosi unutrašnji host kontejnera.
 */
export const redirectToStatus = (route: string, locale: Locale, status: ConfirmStatus) =>
  new NextResponse(null, {
    status: HTTP_STATUS.SEE_OTHER,
    headers: { Location: `${localizedPath(route, locale)}?status=${status}` },
  })
