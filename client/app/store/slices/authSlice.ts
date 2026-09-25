// import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// interface User {
//   _id: string
//   email: string
//   name: string
//   role: string
//   phone: string
//   gender: string
//   age: number
//   isActive: boolean
// }

// interface AuthState {
//   user: User | null
//   isAuthenticated: boolean
//   isLoading: boolean
//   error: string | null
//   isRegistrationDisabled: boolean
//   hasCommitteeLeader: boolean
// }

// const initialState: AuthState = {
//   user: null,
//   isAuthenticated: false,
//   isLoading: false,
//   error: null,
//   isRegistrationDisabled: false,
//   hasCommitteeLeader: false,
// }

// // Define the registration data type
// interface RegisterData {
//   email: string
//   password: string
//   name: string
//   phone: string
//   gender: string
//   age: number
// }

// // Define the login data type
// interface LoginData {
//   email: string
//   password: string
// }

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     // Check Registration Status
//     checkRegistrationStatus: (state) => {
//       state.isLoading = true
//     },
//     checkRegistrationStatusSuccess: (
//       state,
//       action: PayloadAction<{
//         isRegistrationDisabled: boolean
//         hasCommitteeLeader: boolean
//       }>
//     ) => {
//       state.isLoading = false
//       state.isRegistrationDisabled = action.payload.isRegistrationDisabled
//       state.hasCommitteeLeader = action.payload.hasCommitteeLeader
//     },
//     checkRegistrationStatusFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Register Committee Leader - NOW ACCEPTS RegisterData
//     registerStart: (state, action: PayloadAction<RegisterData>) => {
//       state.isLoading = true
//       state.error = null
//     },
//     registerSuccess: (state, action: PayloadAction<{ user: User }>) => {
//       state.isLoading = false
//       state.user = action.payload.user
//       state.isAuthenticated = true
//       state.error = null
//       state.isRegistrationDisabled = true
//       state.hasCommitteeLeader = true
//     },
//     registerFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Login - NOW ACCEPTS LoginData
//     loginStart: (state, action: PayloadAction<LoginData>) => {
//       state.isLoading = true
//       state.error = null
//     },
//     loginSuccess: (state, action: PayloadAction<{ user: User }>) => {
//       state.isLoading = false
//       state.user = action.payload.user
//       state.isAuthenticated = true
//       state.error = null
//     },
//     loginFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Check Auth Status
//     checkAuthStart: (state) => {
//       state.isLoading = true
//     },
//     checkAuthSuccess: (
//       state,
//       action: PayloadAction<{ isAuthenticated: boolean; user?: User }>
//     ) => {
//       state.isLoading = false
//       state.isAuthenticated = action.payload.isAuthenticated
//       state.user = action.payload.user || null
//     },
//     checkAuthFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Logout
//     logoutStart: (state) => {
//       state.isLoading = true
//     },
//     logoutSuccess: (state) => {
//       state.isLoading = false
//       state.user = null
//       state.isAuthenticated = false
//       state.error = null
//     },
//     logoutFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Clear Error
//     clearError: (state) => {
//       state.error = null
//     },
//   },
// })

// export const {
//   checkRegistrationStatus,
//   checkRegistrationStatusSuccess,
//   checkRegistrationStatusFailure,
//   registerStart,
//   registerSuccess,
//   registerFailure,
//   loginStart,
//   loginSuccess,
//   loginFailure,
//   checkAuthStart,
//   checkAuthSuccess,
//   checkAuthFailure,
//   logoutStart,
//   logoutSuccess,
//   logoutFailure,
//   clearError,
// } = authSlice.actions

// export default authSlice.reducer

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  _id: string
  email: string
  name: string
  role: string
  phone: string
  gender: string
  age: number
  isActive: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isRegistrationDisabled: boolean
  hasCommitteeLeader: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isRegistrationDisabled: false,
  hasCommitteeLeader: false,
}

interface RegisterData {
  email: string
  password: string
  name: string
  phone: string
  gender: string
  age: number
}

interface LoginData {
  email: string
  password: string
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Check Registration Status
    checkRegistrationStatus: (state) => {
      state.isLoading = true
    },
    checkRegistrationStatusSuccess: (
      state,
      action: PayloadAction<{
        isRegistrationDisabled: boolean
        hasCommitteeLeader: boolean
      }>
    ) => {
      state.isLoading = false
      state.isRegistrationDisabled = action.payload.isRegistrationDisabled
      state.hasCommitteeLeader = action.payload.hasCommitteeLeader
    },
    checkRegistrationStatusFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Register Committee Leader
    registerStart: (state, action: PayloadAction<RegisterData>) => {
      state.isLoading = true
      state.error = null
    },
    registerSuccess: (state, action: PayloadAction<{ user: User }>) => {
      state.isLoading = false
      state.user = action.payload.user
      state.isAuthenticated = true
      state.error = null
      state.isRegistrationDisabled = true
      state.hasCommitteeLeader = true
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Login
    loginStart: (state, action: PayloadAction<LoginData>) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<{ user: User }>) => {
      state.isLoading = false
      state.user = action.payload.user
      state.isAuthenticated = true
      state.error = null
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Check Auth Status
    checkAuthStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    checkAuthSuccess: (
      state,
      action: PayloadAction<{ isAuthenticated: boolean; user?: User }>
    ) => {
      state.isLoading = false
      state.isAuthenticated = action.payload.isAuthenticated
      state.user = action.payload.user || null
      state.error = null
    },
    checkAuthFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.isAuthenticated = false
      state.user = null
      state.error = action.payload
    },

    // Logout
    logoutStart: (state) => {
      state.isLoading = true
    },
    logoutSuccess: (state) => {
      state.isLoading = false
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Clear Error
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  checkRegistrationStatus,
  checkRegistrationStatusSuccess,
  checkRegistrationStatusFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  checkAuthStart,
  checkAuthSuccess,
  checkAuthFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  clearError,
} = authSlice.actions

export default authSlice.reducer
