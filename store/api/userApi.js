import api from './index'

const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (_data) => ({
        url: '/user/login',
        method: 'POST',
        body: _data
      })
    }),
    logout: build.mutation({
      query: () => ({
        url: '/user/logout',
        method: 'GET'
      })
    }),
    verifyEmailToken: build.mutation({
      query: ({ token }) => ({
        url: `/user/email/verify/${token}`,
        method: 'GET'
      })
    }),
    verifyEmailOTP: build.mutation({
      query: ({ token, _data }) => ({
        url: `/user/email/verify/${token}`,
        method: 'POST',
        body: _data
      })
    }),
    resendVerifyEmail: build.mutation({
      query: ({ token }) => ({
        url: `/user/email/verify/${token}`,
        method: 'GET',
      })
    })
  }),
  overrideExisting: true
})

export const {
  useLoginMutation,
  useLogoutMutation,
  useVerifyEmailTokenMutation,
  useVerifyEmailOTPMutation,
  useResendVerifyEmailMutation
} = userApi
