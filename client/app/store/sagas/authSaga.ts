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
import axios from 'axios'
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
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  verifyOtpStart,
  verifyOtpSuccess,
  verifyOtpFailure,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailure,
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
function* handleForgotPassword(action: {
  type: string
  payload: { email: string }
}) {
  try {
    const res: AxiosResponse<{ success: boolean; message: string }> =
      yield call(() => authAPI.forgotPassword({ email: action.payload.email }))
    yield put(
      forgotPasswordSuccess({
        email: action.payload.email,
        message: res.data.message,
      })
    )
  } catch (err: unknown) {
    let message = 'Failed to send OTP'
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as { message?: string } | undefined
      message = data?.message ?? err.message ?? message
    } else if (err instanceof Error) {
      message = err.message
    }
    yield put(forgotPasswordFailure(message))
  }
}

function* handleVerifyOtp(action: {
  type: string
  payload: { email: string; otp: string }
}) {
  try {
    const res: AxiosResponse<{
      success: boolean
      resetToken: string
      message: string
    }> = yield call(() => authAPI.verifyOtp(action.payload))
    yield put(
      verifyOtpSuccess({
        email: action.payload.email,
        resetToken: res.data.resetToken,
      })
    )
  } catch (err: unknown) {
    let message = 'Invalid OTP'
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as { message?: string } | undefined
      message = data?.message ?? err.message ?? message
    } else if (err instanceof Error) {
      message = err.message
    }
    yield put(verifyOtpFailure(message))
  }
}

function* handleResetPassword(action: {
  type: string
  payload: { resetToken: string; newPassword: string }
}) {
  try {
    const res: AxiosResponse<{ success: boolean; message: string }> =
      yield call(() => authAPI.resetPassword(action.payload))
    yield put(resetPasswordSuccess(res.data.message))
  } catch (err: unknown) {
    let message = 'Failed to reset password'
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as { message?: string } | undefined
      message = data?.message ?? err.message ?? message
    } else if (err instanceof Error) {
      message = err.message
    }
    yield put(resetPasswordFailure(message))
  }
}
export function* authSaga() {
  yield takeLatest(checkRegistrationStatus.type, handleCheckRegistrationStatus)
  yield takeLatest(registerStart.type, handleRegister)
  yield takeLatest(loginStart.type, handleLogin)
  yield takeLatest(checkAuthStart.type, handleCheckAuth)
  yield takeLatest(logoutStart.type, handleLogout)
  yield takeLatest(forgotPasswordStart.type, handleForgotPassword)
  yield takeLatest(verifyOtpStart.type, handleVerifyOtp)
  yield takeLatest(resetPasswordStart.type, handleResetPassword)
}
