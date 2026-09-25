// import { call, put, takeLatest } from 'redux-saga/effects'
// import { authAPI } from '@/app/lib/api'
// import {
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
// } from '../slices/authSlice'
// import { AxiosResponse } from 'axios'

// // Check Registration Status
// function* handleCheckRegistrationStatus() {
//   try {
//     const response: AxiosResponse = yield call(authAPI.checkRegistrationStatus)
//     yield put(checkRegistrationStatusSuccess(response.data))
//   } catch (error: any) {
//     yield put(
//       checkRegistrationStatusFailure(
//         error.message || 'Failed to check registration status'
//       )
//     )
//   }
// }

// // Register Committee Leader - NOW ACCEPTS action.payload
// function* handleRegister(action: ReturnType<typeof registerStart>) {
//   try {
//     const response: AxiosResponse = yield call(
//       authAPI.registerCommitteeLeader,
//       action.payload
//     )
//     yield put(registerSuccess(response.data))
//   } catch (error: any) {
//     yield put(
//       registerFailure(error.response?.data?.message || 'Registration failed')
//     )
//   }
// }

// // Login - NOW ACCEPTS action.payload
// function* handleLogin(action: ReturnType<typeof loginStart>) {
//   try {
//     const response: AxiosResponse = yield call(authAPI.login, action.payload)
//     yield put(loginSuccess(response.data))
//   } catch (error: any) {
//     yield put(loginFailure(error.response?.data?.message || 'Login failed'))
//   }
// }

// // Check Auth Status
// function* handleCheckAuth() {
//   try {
//     const response: AxiosResponse = yield call(authAPI.checkAuth)
//     yield put(checkAuthSuccess(response.data))
//   } catch (error: any) {
//     yield put(checkAuthFailure(error.message || 'Failed to check auth status'))
//   }
// }

// // Logout
// function* handleLogout() {
//   try {
//     yield call(authAPI.logout)
//     yield put(logoutSuccess())
//   } catch (error: any) {
//     yield put(logoutFailure(error.message || 'Logout failed'))
//   }
// }

// export function* authSaga() {
//   yield takeLatest(checkRegistrationStatus.type, handleCheckRegistrationStatus)
//   yield takeLatest(registerStart.type, handleRegister)
//   yield takeLatest(loginStart.type, handleLogin)
//   yield takeLatest(checkAuthStart.type, handleCheckAuth)
//   yield takeLatest(logoutStart.type, handleLogout)
// }

import { call, put, takeLatest } from 'redux-saga/effects'
import { authAPI } from '@/app/lib/api'
import {
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
} from '../slices/authSlice'
import { AxiosResponse } from 'axios'

// Check Registration Status
function* handleCheckRegistrationStatus() {
  try {
    const response: AxiosResponse = yield call(authAPI.checkRegistrationStatus)
    yield put(checkRegistrationStatusSuccess(response.data))
  } catch (error: any) {
    yield put(
      checkRegistrationStatusFailure(
        error.message || 'Failed to check registration status'
      )
    )
  }
}

// Register Committee Leader
function* handleRegister(action: any) {
  try {
    const response: AxiosResponse = yield call(
      authAPI.registerCommitteeLeader,
      action.payload
    )
    yield put(registerSuccess(response.data))
  } catch (error: any) {
    yield put(
      registerFailure(error.response?.data?.message || 'Registration failed')
    )
  }
}

// Login
function* handleLogin(action: any) {
  try {
    const response: AxiosResponse = yield call(authAPI.login, action.payload)
    yield put(loginSuccess(response.data))
  } catch (error: any) {
    yield put(loginFailure(error.response?.data?.message || 'Login failed'))
  }
}

// Check Auth Status
// function* handleCheckAuth() {
//   try {
//     const response: AxiosResponse = yield call(authAPI.checkAuth)
//     if (response.data.success && response.data.isAuthenticated) {
//       yield put(
//         checkAuthSuccess({
//           isAuthenticated: true,
//           user: response.data.user,
//         })
//       )
//     } else {
//       yield put(
//         checkAuthSuccess({
//           isAuthenticated: false,
//           user: undefined,
//         })
//       )
//     }
//   } catch (error: any) {
//     yield put(checkAuthFailure(error.message || 'Failed to check auth status'))
//   }
// }
function* handleCheckAuth() {
  try {
    console.log('Checking auth status...')
    const response: AxiosResponse = yield call(authAPI.checkAuth)
    console.log('Auth response:', response.data)
    if (response.data.success && response.data.isAuthenticated) {
      yield put(
        checkAuthSuccess({
          isAuthenticated: true,
          user: response.data.user,
        })
      )
    } else {
      yield put(
        checkAuthSuccess({
          isAuthenticated: false,
          user: undefined,
        })
      )
    }
  } catch (error: any) {
    console.error('Auth check error:', error)
    yield put(checkAuthFailure(error.message || 'Failed to check auth status'))
  }
}
// Logout
function* handleLogout() {
  try {
    yield call(authAPI.logout)
    yield put(logoutSuccess())
  } catch (error: any) {
    yield put(logoutFailure(error.message || 'Logout failed'))
  }
}

export function* authSaga() {
  yield takeLatest(checkRegistrationStatus.type, handleCheckRegistrationStatus)
  yield takeLatest(registerStart.type, handleRegister)
  yield takeLatest(loginStart.type, handleLogin)
  yield takeLatest(checkAuthStart.type, handleCheckAuth)
  yield takeLatest(logoutStart.type, handleLogout)
}
