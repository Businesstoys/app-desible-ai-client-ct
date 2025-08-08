import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: 'light',
    isSettingPopupOpen: false,
    isUpdatePasswordOpen: false,
    isForgotPasswordOpen: false,
    isSecondOpinionPopupOpen: false,
    pinnedApps: []
  },
  reducers: {
    setTheme (state, action) {
      state.theme = action.payload || 'light'
    },
    setPopupState (state, action) {
      return {
        ...state,
        [action.payload.popup]: action.payload.state || false
      }
    },
    setToggleState (state, action) {
      return {
        ...state,
        [action.payload]: !state[action.payload]
      }
    },
    setPinnedApp (state, action) {
      const { payload } = action
      const { pinnedApps } = state
      const index = pinnedApps.indexOf(payload)
      let newPinnedApps
      if (index === -1) {
        newPinnedApps = [...pinnedApps, payload]
      } else {
        newPinnedApps = pinnedApps.filter((item) => item !== payload)
      }
      return {
        ...state,
        pinnedApps: newPinnedApps
      }
    }
  }
})

export const { setTheme, setPopupState, setToggleState, setPinnedApp } = uiSlice.actions

export { uiSlice }
