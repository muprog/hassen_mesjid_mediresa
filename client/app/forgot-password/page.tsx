'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import {
  forgotPasswordStart,
  clearError,
  clearForgotState,
} from '../store/slices/authSlice'
import { AppDispatch, RootState } from '../store/store'

export default function ForgotPasswordPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { isLoading, error, forgotEmail, resetToken } = useSelector(
    (s: RootState) => s.auth
  )

  const [email, setEmail] = useState('')

  useEffect(() => {
    dispatch(clearForgotState())
  }, [dispatch])

  useEffect(() => {
    if (forgotEmail && !resetToken) {
      router.push('/forgot-password/verify')
    }
  }, [forgotEmail, resetToken, router])

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => dispatch(clearError()), 5000)
      return () => clearTimeout(t)
    }
  }, [error, dispatch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(forgotPasswordStart({ email: email.trim().toLowerCase() }))
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4'>
      <div className='max-w-md w-full bg-white p-8 rounded-xl shadow-2xl'>
        <div className='text-center mb-6'>
          <div className='mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center'>
            <span className='text-2xl'>🔐</span>
          </div>
          <h2 className='mt-4 text-2xl font-bold text-gray-900'>
            Forgot Password
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            Enter your email and we'll send you a 6-digit code
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {error && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600'>
              {error}
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='you@example.com'
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium'
          >
            {isLoading ? 'Sending...' : 'Send Code'}
          </button>

          <div className='text-center'>
            <button
              type='button'
              onClick={() => router.push('/login')}
              className='text-sm text-indigo-600 hover:text-indigo-500'
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
