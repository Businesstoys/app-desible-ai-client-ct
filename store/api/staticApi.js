import api from './index'

const staticApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getQueueStatus: builder.query({
            query: () => '/static/queue/status'
        }),
        startQueue: builder.mutation({
            query: () => ({
                url: '/static/queue/start',
                method: 'POST'
            }),
        }),
        stopQueue: builder.mutation({
            query: () => ({
                url: '/static/queue/stop',
                method: 'POST'
            }),
        }),
        getStatics: builder.query({
            query: () => '/static/statics-config',
        }),
        updateConfig: builder.mutation({
            query: (data)=> ({
            url : 'static/config',
            method: 'POST',
            body: data,
        })
        })
    }),
    overrideExisting: true
})
export const {
    useStopQueueMutation,
    useStartQueueMutation,
    useGetQueueStatusQuery,
    useGetStaticsQuery,
    useUpdateConfigMutation    
} = staticApi