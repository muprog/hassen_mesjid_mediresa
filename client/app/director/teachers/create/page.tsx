'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import {
  createTeacherStart,
  clearTeacherError,
} from '../../../store/slices/teacherSlice'
import { AppDispatch, RootState } from '../../../store/store'

export default function CreateTeacherPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { isLoading, error } = useSelector((state: RootState) => state.teachers)
  const { user } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    experience: '',
    kitabLearned: [''],
    status: 'active',
  })

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearTeacherError()), 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const canCreate =
    user?.role === 'committee_leader' ||
    user?.role === 'committee_member' ||
    user?.role === 'director'

  if (!canCreate) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-600'>Access Denied</h1>
          <p className='text-gray-600 mt-2'>
            You don't have permission to create teachers.
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const teacherData = {
      ...formData,
      age: parseInt(formData.age),
      experience: parseInt(formData.experience),
      kitabLearned: formData.kitabLearned.filter((k) => k.trim() !== ''),
    }

    dispatch(createTeacherStart(teacherData))
    router.push('/committee/teachers')
  }

  const handleKitabChange = (index: number, value: string) => {
    const newKitab = [...formData.kitabLearned]
    newKitab[index] = value
    setFormData({ ...formData, kitabLearned: newKitab })
  }

  const addKitab = () => {
    setFormData({ ...formData, kitabLearned: [...formData.kitabLearned, ''] })
  }

  const removeKitab = (index: number) => {
    if (formData.kitabLearned.length > 1) {
      const newKitab = formData.kitabLearned.filter((_, i) => i !== index)
      setFormData({ ...formData, kitabLearned: newKitab })
    }
  }

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>
          Register New Teacher
        </h1>
        <p className='text-gray-600 mt-1'>
          Add a new teacher to the Mediresa system
        </p>
      </div>

      <form onSubmit={handleSubmit} className='bg-white rounded-lg shadow p-6'>
        {error && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-sm text-red-600'>{error}</p>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Full Name *
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
              Age *
            </label>
            <input
              type='number'
              required
              min='18'
              max='100'
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='30'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Phone *
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
              Experience (Years) *
            </label>
            <input
              type='number'
              required
              min='0'
              value={formData.experience}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='5'
            />
          </div>

          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Kitab Learned (Books)
            </label>
            <p className='text-xs text-gray-500 mb-2'>
              Add all the books/kitabs this teacher has learned or teaches
            </p>

            {formData.kitabLearned.map((kitab, index) => (
              <div key={index} className='flex gap-2 mb-2'>
                <input
                  type='text'
                  value={kitab}
                  onChange={(e) => handleKitabChange(index, e.target.value)}
                  className='flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder={`Kitab ${index + 1}`}
                />
                <button
                  type='button'
                  onClick={() => removeKitab(index)}
                  className='px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200'
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type='button'
              onClick={addKitab}
              className='text-sm text-indigo-600 hover:text-indigo-800'
            >
              + Add Kitab
            </button>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'active' | 'inactive' | 'on_leave',
                })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            >
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
              <option value='on_leave'>On Leave</option>
            </select>
          </div>
        </div>

        <div className='mt-6 flex justify-end space-x-3'>
          <button
            type='button'
            onClick={() => router.push('/committee/teachers')}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
          >
            {isLoading ? 'Registering...' : 'Register Teacher'}
          </button>
        </div>
      </form>
    </div>
  )
}
