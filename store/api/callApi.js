import api from './index'

const callApi = api.injectEndpoints({
    endpoints: (build) => ({
        upload: build.mutation({
            query: (_data) => ({
                url: '/call/file-upload',
                method: 'POST',
                body: _data
            })
        }),
        callInitiate: build.mutation({
            query: (_data) => ({
                url: '/call/initiate',
                method: 'POST',
                body: _data
            })
        }),
        callData: build.mutation({
            query: (_data) => ({
                url: '/call/data',
                method: 'GET'
            })
        }),
        callDataExport: build.mutation({
            query: (_data) => ({
                url: '/call/export',
                method: 'POST',
                body: _data,
                responseHandler: (response) => response.blob()
            })
        }),
        pendingCall: build.query({
            query: () => ({
                url: '/call/pending',
                method: 'GET'
            })
        }),
        udpateCall: build.mutation({
            query: (_data) => ({
                url: '/call/udpate',
                method: 'POST',
                body: _data
            })
        }),
        removeCalls: build.mutation({
            query: (_data) => ({
                url: `/call/remove`,
                method: 'POST',
                body: _data
            })
        }),
        callkpi: build.query({
            query: (params) => ({
                url: `/call/kpi`,
                method: 'GET',
                params
            })
        }),
        callList: build.query({
            query: (params) => ({
                url: `/call/list`,
                method: 'GET',
                params
            })
        }),
        updateCallStatus: build.mutation({
            query: (_data) => ({
                url: `/call/update-status`,
                method: 'POST',
                body: _data
            })
        }),
        handUpCall: build.mutation({
            query: (_id) => ({
                url: `/call/hang-up/${_id}`,
                method: 'GET',
            })
        }),
        callFeedback: build.mutation({
            query: ({ id, data }) => ({
                url: `/call/feedback/${id}`,
                method: 'POST',
                body: data
            })
        }),
        updateOutcome : build.mutation({
            query: (_data) => ({
                url: `/call/update-outcome`,
                method: 'POST',
                body: _data
            })
        })
    }),
    overrideExisting: true
})

export const {
    useUploadMutation,
    useCallInitiateMutation,
    useCallDataMutation,
    useCallDataExportMutation,
    usePendingCallQuery,
    useUdpateCallMutation,
    useCallkpiQuery,
    useCallListQuery,
    useUpdateCallStatusMutation,
    useHandUpCallMutation,
    useCallFeedbackMutation,
    useRemoveCallsMutation,
    useUpdateOutcomeMutation
} = callApi
