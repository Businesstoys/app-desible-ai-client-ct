import api from './index'

const staticApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getQueueStatus: builder.query({
            query: () => '/static/queue/status',
            providesTags: ['QueueStatus']
        }),
        startQueue: builder.mutation({
            query: () => ({
                url: '/static/queue/start',
                method: 'POST'
            }),
            invalidatesTags: ['QueueStatus']
        }),
        stopQueue: builder.mutation({
            query: () => ({
                url: '/static/queue/stop',
                method: 'POST'
            }),
            invalidatesTags: ['QueueStatus']
        }),
    }),
    overrideExisting: true
})
export const {
    useStopQueueMutation,
    useStartQueueMutation,
    useGetQueueStatusQuery     
} = staticApi