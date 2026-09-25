'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useParams } from 'next/navigation'
import {
  getStudentByIdStart,
  updateStudentStart,
  clearStudentError,
  clearSelectedStudent,
  clearStudentSuccess,
} from '../../../../store/slices/studentSlice'
import { AppDispatch, RootState } from '../../../../store/store'

export default function EditStudentPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const params = useParams()
  const studentId = params.id as string

  const { selectedStudent, isLoading, error, successMessage } = useSelector(
    (state: RootState) => state.students
  )
  const { user } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    code: '',
    fullName: '',
    age: '',
    gender: 'male',
    haleqa: '',
    section: 'A',
    status: 'active',
  })

  const [isLoadingData, setIsLoadingData] = useState(true)

  const isCommitteeLeader =
    user?.role === 'committee_leader' || user?.role === 'committee_member'
  const canEdit = isCommitteeLeader || user?.role === 'director'

  useEffect(() => {
    if (successMessage) {
      dispatch(clearStudentSuccess())
      router.push('/committee/students')
    }
  }, [successMessage, dispatch, router])
  useEffect(() => {
    if (!canEdit) {
      router.push('/unauthorized')
      return
    }

    dispatch(getStudentByIdStart(studentId))
  }, [dispatch, studentId, canEdit, router])

  useEffect(() => {
    if (selectedStudent) {
      setFormData({
        code: selectedStudent.code || '',
        fullName: selectedStudent.fullName || '',
        age: selectedStudent.age?.toString() || '',
        gender: selectedStudent.gender || 'male',
        haleqa: selectedStudent.haleqa || '',
        section: selectedStudent.section || 'A',
        status: selectedStudent.status || 'active',
      })
      setIsLoadingData(false)
    }
  }, [selectedStudent])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearStudentError()), 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  useEffect(() => {
    return () => {
      dispatch(clearSelectedStudent())
    }
  }, [dispatch])

  if (!canEdit) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const studentData = {
      code: formData.code,
      fullName: formData.fullName,
      age: parseInt(formData.age),
      gender: formData.gender,
      haleqa: formData.haleqa,
      section: formData.section,
      status: formData.status,
    }

    dispatch(updateStudentStart({ id: studentId, data: studentData }))
    // router.push('/committee/students')
  }

  if (isLoadingData || isLoading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
      </div>
    )
  }

  if (!selectedStudent) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500'>Student not found</p>
        <button
          onClick={() => router.push('/committee/students')}
          className='mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
        >
          Back to Students
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Edit Student</h1>
        <p className='text-gray-600 mt-1'>Update student information</p>
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
              Student Code <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              required
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 uppercase'
              placeholder='STU-001'
            />
            <p className='mt-1 text-xs text-gray-500'>
              Must be unique. Uppercase letters and numbers.
            </p>
          </div>
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
              Age <span className='text-red-500'>*</span>
            </label>
            <input
              type='number'
              required
              min='4'
              max='100'
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='10'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Gender <span className='text-red-500'>*</span>
            </label>
            <select
              required
              value={formData.gender}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gender: e.target.value as 'male' | 'female',
                })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            >
              <option value='male'>Male</option>
              <option value='female'>Female</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Haleqa (Class) <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              required
              value={formData.haleqa}
              onChange={(e) =>
                setFormData({ ...formData, haleqa: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='Haleqa A'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Section <span className='text-red-500'>*</span>
            </label>
            <select
              required
              value={formData.section}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  section: e.target.value as 'A' | 'B' | 'C' | 'D',
                })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            >
              <option value='A'>A</option>
              <option value='B'>B</option>
              <option value='C'>C</option>
              <option value='D'>D</option>
            </select>
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
              <option value='graduated'>Graduated</option>
              <option value='transferred'>Transferred</option>
            </select>
          </div>
        </div>

        <div className='mt-6 flex justify-end space-x-3'>
          <button
            type='button'
            onClick={() => router.push('/committee/students')}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
          >
            {isLoading ? 'Updating...' : 'Update Student'}
          </button>
        </div>
      </form>
    </div>
  )
}
