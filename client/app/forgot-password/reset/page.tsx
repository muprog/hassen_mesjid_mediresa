'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import {
  resetPasswordStart,
  clearError,
  clearSuccess,
} from '../../store/slices/authSlice'
import { AppDispatch, RootState } from '../../store/store'

export default function ResetPasswordPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { isLoading, error, successMessage, resetToken, forgotEmail } =
    useSelector((s: RootState) => s.auth)

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  // Wait a short moment before deciding whether to bounce
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50)
    return () => clearTimeout(t)
  }, [])

  // Only redirect once we're ready and truly missing state
  useEffect(() => {
    if (!ready) return
    if (!forgotEmail || !resetToken) {
      router.replace('/forgot-password')
    }
  }, [ready, forgotEmail, resetToken, router])

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => {
        dispatch(clearSuccess())
        router.push('/login')
      }, 1500)
      return () => clearTimeout(t)
    }
  }, [successMessage, dispatch, router])

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => dispatch(clearError()), 5000)
      return () => clearTimeout(t)
    }
  }, [error, dispatch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    if (password !== confirm) {
      setLocalError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return
    }
    if (!resetToken) return
    dispatch(resetPasswordStart({ resetToken, newPassword: password }))
  }

  if (!ready) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600'></div>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4'>
      <div className='max-w-md w-full bg-white p-8 rounded-xl shadow-2xl'>
        <div className='text-center mb-6'>
          <div className='mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center'>
            <span className='text-2xl'>🔒</span>
          </div>
          <h2 className='mt-4 text-2xl font-bold text-gray-900'>
            Set New Password
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            Choose a strong password you'll remember
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {(error || localError) && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600'>
              {error || localError}
            </div>
          )}
          {successMessage && (
            <div className='p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700'>
              {successMessage} — redirecting...
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              New Password
            </label>
            <input
              type='password'
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='••••••••'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Confirm Password
            </label>
            <input
              type='password'
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='••••••••'
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium'
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
