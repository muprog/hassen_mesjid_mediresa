'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import {
  createPaymentTypeStart,
  clearPaymentTypeError,
} from '../../../store/slices/paymentTypeSlice'
import { AppDispatch, RootState } from '../../../store/store'

export default function CreatePaymentTypePage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { isLoading, error } = useSelector(
    (state: RootState) => state.paymentTypes
  )
  const { user } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    name: '',
    defaultAmount: '',
    period: 'monthly' as 'monthly' | 'one-time' | 'yearly',
  })

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearPaymentTypeError()), 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  if (user?.role !== 'committee_leader') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-600'>Access Denied</h1>
          <p className='text-gray-600 mt-2'>
            Only the Committee Leader can create payment types.
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(
      createPaymentTypeStart({
        name: formData.name,
        defaultAmount: parseFloat(formData.defaultAmount),
        period: formData.period,
      })
    )
    router.push('/committee/payment-types')
  }

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Add Payment Type</h1>
        <p className='text-gray-600 mt-1'>
          Define a reusable payment (e.g., Monthly Fee, Summer Program)
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-lg shadow p-6 max-w-lg'
      >
        {error && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-sm text-red-600'>{error}</p>
          </div>
        )}

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
              placeholder='Monthly Fee'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Default Amount (ETB) <span className='text-red-500'>*</span>
            </label>
            <input
              type='number'
              required
              min={0}
              step='0.01'
              value={formData.defaultAmount}
              onChange={(e) =>
                setFormData({ ...formData, defaultAmount: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
              placeholder='500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Period <span className='text-red-500'>*</span>
            </label>
            <select
              required
              value={formData.period}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  period: e.target.value as 'monthly' | 'one-time' | 'yearly',
                })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
            >
              <option value='monthly'>Monthly</option>
              <option value='one-time'>One-time</option>
              <option value='yearly'>Yearly</option>
            </select>
          </div>
        </div>

        <div className='mt-6 flex justify-end space-x-3'>
          <button
            type='button'
            onClick={() => router.push('/committee/payment-types')}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50'
          >
            {isLoading ? 'Creating...' : 'Create Payment Type'}
          </button>
        </div>
      </form>
    </div>
  )
}
