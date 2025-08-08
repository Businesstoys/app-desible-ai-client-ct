import api from './index'

const staticApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCallAttempts: builder.query({
            query: (params) => ({
                url: '/chart/attempts',
                params
            })
        }),
        getCallReport: builder.query({
            query: (params) => ({
                url: `/chart/report`,
                params
            })
        }),
        getCallStatusReport: builder.query({
            query: (params) => ({
                url: `/chart/status-report`,
                params
            })
        }),
    }),
    overrideExisting: true
})

export const {
    useGetCallAttemptsQuery,
    useGetCallReportQuery,
    useGetCallStatusReportQuery
} = staticApi