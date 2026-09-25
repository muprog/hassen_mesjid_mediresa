'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import {
  checkRegistrationStatus,
  registerStart,
  clearError,
} from '../store/slices/authSlice'
import { AppDispatch, RootState } from '../store/store'

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const {
    isLoading,
    error,
    isRegistrationDisabled,
    hasCommitteeLeader,
    isAuthenticated,
  } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    gender: 'male',
    age: '',
  })

  const [passwordError, setPasswordError] = useState<string | null>(null)

  // Check registration status on page load
  useEffect(() => {
    dispatch(checkRegistrationStatus())
  }, [dispatch])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    // Dispatch register action with the form data
    dispatch(
      registerStart({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        age: parseInt(formData.age),
      })
    )
  }

  // If registration is disabled, show message
  if (isRegistrationDisabled || hasCommitteeLeader) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg'>
          <div className='text-center'>
            <div className='mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center'>
              <svg
                className='h-8 w-8 text-red-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>
            <h2 className='mt-4 text-2xl font-bold text-gray-900'>
              Registration Disabled
            </h2>
            <p className='mt-2 text-gray-600'>
              The system already has a Committee Leader registered.
            </p>
            <p className='mt-1 text-sm text-gray-500'>
              Please login to access the system.
            </p>
            <button
              onClick={() => router.push('/login')}
              className='mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
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
                  d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                />
              </svg>
            </div>
            <h2 className='mt-4 text-3xl font-bold text-gray-900'>
              Committee Leader Registration
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              This is a one-time setup. Register as the Committee Leader to get
              started.
            </p>
          </div>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {/* Show errors */}
          {(error || passwordError) && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
              <p className='text-sm text-red-600'>{error || passwordError}</p>
            </div>
          )}

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Full Name
              </label>
              <input
                type='text'
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Full Name'
              />
            </div>

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
                Phone
              </label>
              <input
                type='tel'
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='+251911111111'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Age
              </label>
              <input
                type='number'
                required
                min='18'
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='35'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              >
                <option value='male'>Male</option>
                <option value='female'>Female</option>
              </select>
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
                minLength={6}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Confirm Password
              </label>
              <input
                type='password'
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='••••••••'
                minLength={6}
              />
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
                Registering...
              </span>
            ) : (
              'Register as Committee Leader'
            )}
          </button>

          <div className='text-center'>
            <p className='text-sm text-gray-600'>
              Already registered?{' '}
              <button
                type='button'
                onClick={() => router.push('/login')}
                className='text-indigo-600 hover:text-indigo-500 font-medium'
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
