'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useParams } from 'next/navigation'
import {
  getDirectorByIdStart,
  updateDirectorStart,
  clearDirectorError,
  clearSelectedDirector,
} from '../../../../store/slices/directorSlice'
import { AppDispatch, RootState } from '../../../../store/store'

export default function EditDirectorPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const params = useParams()
  const directorId = params.id as string

  const { selectedDirector, isLoading, error } = useSelector(
    (state: RootState) => state.directors
  )
  const { user } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    status: 'active',
  })

  const [isLoadingData, setIsLoadingData] = useState(true)

  // Only Committee Leader can access this page
  const isCommitteeLeader = user?.role === 'committee_leader'

  useEffect(() => {
    if (!isCommitteeLeader) {
      router.push('/unauthorized')
      return
    }

    // Fetch director data
    dispatch(getDirectorByIdStart(directorId))
  }, [dispatch, directorId, isCommitteeLeader, router])

  // Populate form when data is loaded
  useEffect(() => {
    if (selectedDirector) {
      setFormData({
        fullName: selectedDirector.fullName || '',
        phone: selectedDirector.phone || '',
        email: selectedDirector.email || '',
        status: selectedDirector.status || 'active',
      })
      setIsLoadingData(false)
    }
  }, [selectedDirector])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearDirectorError()), 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearSelectedDirector())
    }
  }, [dispatch])

  if (!isCommitteeLeader) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const directorData = {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      status: formData.status,
    }

    dispatch(updateDirectorStart({ id: directorId, data: directorData }))
    router.push('/committee/directors')
  }

  if (isLoadingData || isLoading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
      </div>
    )
  }

  if (!selectedDirector) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500'>Director not found</p>
        <button
          onClick={() => router.push('/committee/directors')}
          className='mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
        >
          Back to Directors
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Edit Director</h1>
        <p className='text-gray-600 mt-1'>Update director information</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-lg shadow p-6 max-w-2xl'
      >
        {error && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-sm text-red-600'>{error}</p>
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
              Changing email will update the login credentials
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            >
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>
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
            {isLoading ? 'Updating...' : 'Update Director'}
          </button>
        </div>
      </form>
    </div>
  )
}
