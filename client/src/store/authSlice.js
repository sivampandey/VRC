import { createSlice } from '@reduxjs/toolkit'

const getInitialUser = () => {
  try {
    const raw = localStorage.getItem('vrc_user')
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    console.error('Error loading user from localStorage', e)
    return null
  }
}

const getInitialToken = () => {
  try {
    return localStorage.getItem('vrc_token') || null
  } catch (e) {
    console.error('Error loading token from localStorage', e)
    return null
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getInitialUser(),
    token: getInitialToken(),
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      try {
        localStorage.setItem('vrc_user', JSON.stringify(user))
        localStorage.setItem('vrc_token', token)
      } catch (e) {
        console.error('Error setting auth to localStorage', e)
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      try {
        localStorage.removeItem('vrc_user')
        localStorage.removeItem('vrc_token')
      } catch (e) {
        console.error('Error removing auth from localStorage', e)
      }
    },
    updateStoredUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      }
      try {
        localStorage.setItem('vrc_user', JSON.stringify(state.user))
      } catch (e) {
        console.error('Error updating user in localStorage', e)
      }
    },
  },
})

export const { setCredentials, logout, updateStoredUser } = authSlice.actions

export const selectCurrentUser = (state) => state.auth.user
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin'

export default authSlice.reducer
