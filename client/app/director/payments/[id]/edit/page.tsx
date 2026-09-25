'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useRouter } from 'next/navigation'
import {
  updatePaymentStart,
  clearPaymentError,
  clearPaymentSuccess,
  getPaymentStatsStart,
} from '../../../../store/slices/paymentSlice'
import { getPaymentTypesStart } from '../../../../store/slices/paymentTypeSlice'
import { AppDispatch, RootState } from '../../../../store/store'
import api from '../../../../lib/api'

interface LoadedPayment {
  _id: string
  student: {
    _id: string
    code: string
    fullName: string
    haleqa: string
    section: string
  }
  paymentType?: { _id: string; name: string; defaultAmount: number } | null
  typeName: string
  typeAmount: number
  periodYear: number
  periodMonth: number
  periodLabel: string
  amountDue: number
  amountPaid: number
  status: string
  method?: 'cash' | 'bank' | 'mobile_money' | 'other' | null
  note?: string
}

export default function DirectorEditPaymentPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { isLoading, error, successMessage } = useSelector(
    (s: RootState) => s.payments
  )
  const { paymentTypes } = useSelector((s: RootState) => s.paymentTypes)

  const [payment, setPayment] = useState<LoadedPayment | null>(null)
  const [loadingData, setLoadingData] = useState(true)

  const [paymentType, setPaymentType] = useState('')
  const [amountDue, setAmountDue] = useState('')
  const [amountPaid, setAmountPaid] = useState('')
  const [method, setMethod] = useState<
    'cash' | 'bank' | 'mobile_money' | 'other' | ''
  >('')
  const [note, setNote] = useState('')

  useEffect(() => {
    dispatch(getPaymentTypesStart({ filters: { activeOnly: 'true' } }))
  }, [dispatch])

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const res = await api.get<{ success: boolean; data: LoadedPayment }>(
          `/payments/${id}`
        )
        if (!active) return
        const data = res.data.data
        setPayment(data)
        setPaymentType(data.paymentType?._id ?? '')
        setAmountDue(data.amountDue ? String(data.amountDue) : '')
        setAmountPaid(data.amountPaid ? String(data.amountPaid) : '')
        setMethod((data.method as typeof method) ?? '')
        setNote(data.note ?? '')
      } finally {
        if (active) setLoadingData(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [id])

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => dispatch(clearPaymentError()), 6000)
      return () => clearTimeout(t)
    }
  }, [error, dispatch])

  useEffect(() => {
    if (successMessage) {
      dispatch(clearPaymentSuccess())
      dispatch(getPaymentStatsStart())
      router.push('/director/payments')
    }
  }, [successMessage, dispatch, router])

  useEffect(() => {
    if (!paymentType) return
    const t = paymentTypes.find((pt) => pt._id === paymentType)
    if (t && (!amountDue || amountDue === '0')) {
      setAmountDue(String(t.defaultAmount))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentType, paymentTypes])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(
      updatePaymentStart({
        id,
        data: {
          paymentType: paymentType || null,
          amountDue: amountDue ? Number(amountDue) : 0,
          amountPaid: amountPaid ? Number(amountPaid) : 0,
          method: method || null,
          note,
        },
      })
    )
  }

  if (loadingData || !payment) {
    return (
      <div className='flex justify-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Edit Payment</h1>
        <p className='text-gray-600 mt-1'>
          {payment.student.fullName} — {payment.periodLabel}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-lg shadow p-6 max-w-xl'
      >
        {error && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600'>
            {error}
          </div>
        )}

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Payment Type
            </label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
            >
              <option value=''>— Unassigned —</option>
              {paymentTypes.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} — {t.defaultAmount} ETB
                </option>
              ))}
            </select>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Amount Due
              </label>
              <input
                type='number'
                min={0}
                value={amountDue}
                onChange={(e) => setAmountDue(e.target.value)}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Amount Paid
              </label>
              <input
                type='number'
                min={0}
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as typeof method)}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
            >
              <option value=''>—</option>
              <option value='cash'>Cash</option>
              <option value='bank'>Bank</option>
              <option value='mobile_money'>Mobile Money</option>
              <option value='other'>Other</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Note
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
            />
          </div>
        </div>

        <div className='mt-6 flex justify-end space-x-3'>
          <button
            type='button'
            onClick={() => router.push('/director/payments')}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50'
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
