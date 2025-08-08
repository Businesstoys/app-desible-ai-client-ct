import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    _id: null,
    isLoggedIn: false,
    token: '',
    email: '',
    name: ''
  },
  reducers: {
    setAuth(state, action) {
      return {
        isLoggedIn: action.payload.isLoggedIn || false,
        token: action.payload.token || ''
      }
    },
    setUser(state, action) {
      return { ...state, ...action.payload }
    }
  }
})

export const {
  setAuth,
  setUser
} = userSlice.actions

export { userSlice }
