import { API_ENDPOINTS } from '@/constants/api'
import type { BriefInput } from '@/schemas/contact'
import type { EmailCheckResult } from '@/types/contact'

import { baseApi } from '../baseApi'

export const contactApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    sendBrief: build.mutation<{ ok: true }, BriefInput>({
      query: (body) => ({ url: API_ENDPOINTS.CONTACT, method: 'POST', body }),
    }),
    /** Provera adrese dok se kuca — ne kešira se (svaka adresa je nov upit). */
    checkEmail: build.mutation<EmailCheckResult, { email: string; allowTypo?: boolean }>({
      query: (body) => ({ url: API_ENDPOINTS.EMAIL_CHECK, method: 'POST', body }),
    }),
  }),
})

export const { useSendBriefMutation, useCheckEmailMutation } = contactApi
