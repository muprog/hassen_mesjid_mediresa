'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { loginStart, clearError } from '../store/slices/authSlice'
import { AppDispatch, RootState } from '../store/store'

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { isLoading, error, isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  )

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    if (isAuthenticated && user) {
      const roleRoutes: Record<string, string> = {
        committee_leader: '/committee/dashboard',
        committee_member: '/committee/dashboard',
        director: '/director/dashboard',
        teacher: '/teacher/dashboard',
        student: '/student/dashboard',
      }
      router.push(roleRoutes[user.role] || '/dashboard')
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(loginStart(formData))
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl'>
        <div>
          <div className='text-center'>
            <div className='mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center'>
              <svg
                className='h-8 w-8 text-indigo-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                />
              </svg>
            </div>
            <h2 className='mt-4 text-3xl font-bold text-gray-900'>
              Welcome Back
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              Login to your Mediresa account
            </p>
          </div>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {error && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          )}

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Email
              </label>
              <input
                type='email'
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='admin@mediresa.com'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Password
              </label>
              <input
                type='password'
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='••••••••'
              />
            </div>
            <div className='text-right'>
              <button
                type='button'
                onClick={() => router.push('/forgot-password')}
                className='text-sm text-indigo-600 hover:text-indigo-500'
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {isLoading ? (
              <span className='flex items-center'>
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>

          <div className='text-center'>
            <p className='text-sm text-gray-600'>
              Don't have an account?{' '}
              <button
                type='button'
                onClick={() => router.push('/register')}
                className='text-indigo-600 hover:text-indigo-500 font-medium'
              >
                Register
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
