import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { CONSTANTS } from '@/constants'
import { getCookie } from 'cookies-next'

const baseQuery = fetchBaseQuery({

  baseUrl: CONSTANTS.apiUrl,
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json')
    headers.set('Cache-Control', 'no-cache')
    headers.set('Pragma', 'no-cache')
    headers.set('Expires', '0')
    headers.set('test', 'test')
    const token = getCookie(CONSTANTS.TOKEN_KEY)

    if (token) {
      headers.set('Authorization', token)
    }

    return headers
  }
})

const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    if (
      !result?.meta?.request?.url.includes('/login') &&
      !result?.meta?.request?.url.includes('/signup')
    ) {
      window.location.href = '/login'
    }
  }
  return result
}

const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  endpoints: () => ({})
})

export default api
