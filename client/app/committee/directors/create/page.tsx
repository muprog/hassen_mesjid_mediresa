'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import {
  createDirectorStart,
  clearDirectorError,
} from '../../../store/slices/directorSlice'
import { AppDispatch, RootState } from '../../../store/store'

export default function CreateDirectorPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { isLoading, error } = useSelector(
    (state: RootState) => state.directors
  )
  const { user } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [passwordError, setPasswordError] = useState<string | null>(null)

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearDirectorError()), 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  // Only Committee Leader can access this page
  const isCommitteeLeader = user?.role === 'committee_leader'

  if (!isCommitteeLeader) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-600'>Access Denied</h1>
          <p className='text-gray-600 mt-2'>
            Only the Committee Leader can register new directors.
          </p>
        </div>
      </div>
    )
  }

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

    const directorData = {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
    }

    dispatch(createDirectorStart(directorData))
    router.push('/committee/directors')
  }

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Add Director</h1>
        <p className='text-gray-600 mt-1'>
          Register a new director to manage the Mediresa
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-lg shadow p-6 max-w-2xl'
      >
        {(error || passwordError) && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-sm text-red-600'>{error || passwordError}</p>
          </div>
        )}

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Full Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='Ahmed Mohammed'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Phone Number <span className='text-red-500'>*</span>
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
              Email <span className='text-red-500'>*</span>
            </label>
            <input
              type='email'
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='director@mediresa.com'
            />
            <p className='mt-1 text-xs text-gray-500'>
              This email will be used for login
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Password <span className='text-red-500'>*</span>
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
            <p className='mt-1 text-xs text-gray-500'>Minimum 6 characters</p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Confirm Password <span className='text-red-500'>*</span>
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

          <div className='bg-blue-50 p-4 rounded-md'>
            <p className='text-sm text-blue-800'>
              <span className='font-semibold'>Director Permissions:</span>
            </p>
            <ul className='mt-2 text-sm text-blue-700 space-y-1 list-disc list-inside'>
              <li>✅ Register and update students</li>
              <li>❌ Cannot delete students</li>
              <li>✅ Register and update teachers</li>
              <li>❌ Cannot delete teachers</li>
            </ul>
          </div>
        </div>

        <div className='mt-6 flex justify-end space-x-3'>
          <button
            type='button'
            onClick={() => router.push('/committee/directors')}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
          >
            {isLoading ? 'Registering...' : 'Register Director'}
          </button>
        </div>
      </form>
    </div>
  )
}
