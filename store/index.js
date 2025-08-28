
export { store, persistor } from './store'

export {
  setAuth,
  setUser
} from './slices/userSlice'
export {
  setTheme,
  setPopupState,
  setToggleState
} from './slices/uiSlice'


export {
  useLoginMutation,
  useLogoutMutation,
  useVerifyEmailTokenMutation,
  useVerifyEmailOTPMutation,
  useResendVerifyEmailMutation
} from './api/userApi'

export {
  usePendingCallQuery,
  useCallInitiateMutation,
  useUploadMutation,
  useUdpateCallMutation,
  useDeleteCallMutation,
  useCallkpiQuery,
  useCallListQuery,
  useUpdateCallStatusMutation,
  useHandUpCallMutation,
  useCallFeedbackMutation,
  useCallDataExportMutation,
  useRemoveCallMutation
} from './api/callApi'

export {
  useGetQueueStatusQuery,
  useStartQueueMutation,
  useStopQueueMutation,
  useGetStaticsQuery,
  useUpdateConfigMutation
} from './api/staticApi'

export {
  useGetCallAttemptsQuery,
  useGetCallReportQuery,
  useGetCallStatusReportQuery
} from './api/chartApi'
export { useTemplateListQuery } from './api/templateApi'

