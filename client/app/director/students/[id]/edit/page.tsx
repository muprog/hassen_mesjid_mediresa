'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useParams } from 'next/navigation'
import {
  getStudentByIdStart,
  updateStudentStart,
  clearStudentError,
  clearStudentSuccess,
  clearSelectedStudent,
} from '../../../../store/slices/studentSlice'
import { getPaymentTypesStart } from '../../../../store/slices/paymentTypeSlice'
import { AppDispatch, RootState } from '../../../../store/store'

export default function DirectorEditStudentPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const params = useParams()
  const studentId = params.id as string

  const { selectedStudent, isLoading, error, successMessage } = useSelector(
    (state: RootState) => state.students
  )
  const { paymentTypes } = useSelector((state: RootState) => state.paymentTypes)

  const [formData, setFormData] = useState({
    code: '',
    fullName: '',
    age: '',
    gender: 'male' as 'male' | 'female',
    haleqa: '',
    section: 'A' as 'A' | 'B' | 'C' | 'D',
    status: 'active' as 'active' | 'inactive' | 'graduated' | 'transferred',
    fatherPhone: '',
    motherPhone: '',
    quranLevel: '',
    hasPayment: true,
    paymentType: '',
  })

  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    dispatch(getPaymentTypesStart({ filters: { activeOnly: 'true' } }))
    dispatch(getStudentByIdStart(studentId))
  }, [dispatch, studentId])

  useEffect(() => {
    if (selectedStudent) {
      setFormData({
        code: selectedStudent.code ?? '',
        fullName: selectedStudent.fullName ?? '',
        age: selectedStudent.age?.toString() ?? '',
        gender: selectedStudent.gender ?? 'male',
        haleqa: selectedStudent.haleqa ?? '',
        section: selectedStudent.section ?? 'A',
        status: selectedStudent.status ?? 'active',
        fatherPhone: selectedStudent.fatherPhone ?? '',
        motherPhone: selectedStudent.motherPhone ?? '',
        quranLevel: selectedStudent.quranLevel ?? '',
        hasPayment: selectedStudent.hasPayment ?? true,
        paymentType:
          typeof selectedStudent.paymentType === 'object' &&
          selectedStudent.paymentType !== null
            ? (selectedStudent.paymentType as { _id: string })._id
            : (selectedStudent.paymentType as string | undefined) ?? '',
      })
      setIsLoadingData(false)
    }
  }, [selectedStudent])

  useEffect(() => {
    if (successMessage) {
      dispatch(clearStudentSuccess())
      router.push('/director/students')
    }
  }, [successMessage, dispatch, router])

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => dispatch(clearStudentError()), 6000)
      return () => clearTimeout(t)
    }
  }, [error, dispatch])

  useEffect(() => {
    return () => {
      dispatch(clearSelectedStudent())
    }
  }, [dispatch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.hasPayment && !formData.paymentType) {
      alert('Please select a payment type (or uncheck "Has Payment")')
      return
    }
    dispatch(
      updateStudentStart({
        id: studentId,
        data: {
          code: formData.code.trim().toUpperCase(),
          fullName: formData.fullName.trim(),
          age: parseInt(formData.age),
          gender: formData.gender,
          haleqa: formData.haleqa.trim(),
          section: formData.section,
          status: formData.status,
          fatherPhone: formData.fatherPhone.trim(),
          motherPhone: formData.motherPhone.trim(),
          quranLevel: formData.quranLevel.trim(),
          hasPayment: formData.hasPayment,
          paymentType: formData.hasPayment ? formData.paymentType : null,
        },
      })
    )
  }

  if (isLoadingData || isLoading) {
    return (
      <div className='flex justify-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  if (!selectedStudent) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500'>Student not found</p>
        <button
          onClick={() => router.push('/director/students')}
          className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        >
          Back to Students
        </button>
      </div>
    )
  }

  // Same form fields as the create page — copy the JSX from the create page,
  // only with `updateStudentStart` already dispatched from handleSubmit above.
  // Header says "Edit Student" and Cancel goes to /director/students.

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Edit Student</h1>
        <p className='text-gray-600 mt-1'>Update student information</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-lg shadow p-6 max-w-3xl'
      >
        {error && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600'>
            {error}
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Student Code
            </label>
            <input
              type='text'
              required
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md uppercase'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Full Name
            </label>
            <input
              type='text'
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Age
            </label>
            <input
              type='number'
              required
              min={4}
              max={100}
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gender: e.target.value as 'male' | 'female',
                })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
            >
              <option value='male'>Male</option>
              <option value='female'>Female</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Haleqa
            </label>
            <input
              type='text'
              required
              value={formData.haleqa}
              onChange={(e) =>
                setFormData({ ...formData, haleqa: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Section
            </label>
            <select
              value={formData.section}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  section: e.target.value as 'A' | 'B' | 'C' | 'D',
                })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
            >
              <option value='A'>A</option>
              <option value='B'>B</option>
              <option value='C'>C</option>
              <option value='D'>D</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Father's Phone
            </label>
            <input
              type='tel'
              value={formData.fatherPhone}
              onChange={(e) =>
                setFormData({ ...formData, fatherPhone: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Mother's Phone
            </label>
            <input
              type='tel'
              value={formData.motherPhone}
              onChange={(e) =>
                setFormData({ ...formData, motherPhone: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
            />
          </div>
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Quran Level / Current Studies
            </label>
            <textarea
              rows={3}
              value={formData.quranLevel}
              onChange={(e) =>
                setFormData({ ...formData, quranLevel: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
            />
          </div>

          <div className='md:col-span-2'>
            <div className='flex items-center gap-3 bg-gray-50 p-3 rounded-md'>
              <input
                type='checkbox'
                id='hasPayment'
                checked={formData.hasPayment}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hasPayment: e.target.checked,
                    paymentType: e.target.checked ? formData.paymentType : '',
                  })
                }
                className='h-4 w-4'
              />
              <label htmlFor='hasPayment' className='text-sm text-gray-700'>
                This student pays fees
              </label>
            </div>
          </div>

          {formData.hasPayment && (
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Payment Type
              </label>
              <select
                value={formData.paymentType}
                onChange={(e) =>
                  setFormData({ ...formData, paymentType: e.target.value })
                }
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
              >
                <option value=''>Select a payment type...</option>
                {paymentTypes.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} — {t.defaultAmount} ETB
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as
                    | 'active'
                    | 'inactive'
                    | 'graduated'
                    | 'transferred',
                })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
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
            onClick={() => router.push('/director/students')}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50'
          >
            {isLoading ? 'Updating...' : 'Update Student'}
          </button>
        </div>
      </form>
    </div>
  )
}
