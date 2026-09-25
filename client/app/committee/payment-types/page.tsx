'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import {
  getPaymentTypesStart,
  deletePaymentTypeStart,
  togglePaymentTypeStatusStart,
} from '../../store/slices/paymentTypeSlice'
import { AppDispatch, RootState } from '../../store/store'

export default function PaymentTypesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { paymentTypes, isLoading } = useSelector(
    (state: RootState) => state.paymentTypes
  )
  const { user } = useSelector((state: RootState) => state.auth)
  const [search, setSearch] = useState('')

  const isLeader = user?.role === 'committee_leader'

  useEffect(() => {
    dispatch(getPaymentTypesStart({ filters: { search } }))
  }, [dispatch, search])

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        'Delete this payment type? Past payments keep their old type/amount.'
      )
    ) {
      dispatch(deletePaymentTypeStart(id))
    }
  }

  const handleToggle = (id: string) => {
    dispatch(togglePaymentTypeStatusStart(id))
  }

  return (
    <div>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Payment Types</h1>
          <p className='text-gray-600 mt-1'>
            Reusable payment definitions (Monthly Fee, Summer Program, etc.)
          </p>
        </div>
        {isLeader && (
          <button
            onClick={() => router.push('/committee/payment-types/create')}
            className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
          >
            + Add Payment Type
          </button>
        )}
      </div>

      <div className='bg-white rounded-lg shadow p-4 mb-6'>
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search by name...'
          className='w-full px-3 py-2 border border-gray-300 rounded-md'
        />
      </div>

      <div className='bg-white rounded-lg shadow overflow-hidden'>
        {isLoading ? (
          <div className='flex justify-center items-center py-12'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
          </div>
        ) : paymentTypes.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500'>No payment types yet</p>
            {isLeader && (
              <button
                onClick={() => router.push('/committee/payment-types/create')}
                className='mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
              >
                Create your first payment type
              </button>
            )}
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Default Amount
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Period
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {paymentTypes.map((t) => (
                  <tr key={t._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {t.name}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {t.defaultAmount} ETB
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {t.period}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          t.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {t.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
                      {isLeader && (
                        <>
                          <button
                            onClick={() =>
                              router.push(
                                `/committee/payment-types/${t._id}/edit`
                              )
                            }
                            className='text-blue-600 hover:text-blue-900'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggle(t._id)}
                            className={
                              t.isActive
                                ? 'text-yellow-600 hover:text-yellow-900'
                                : 'text-green-600 hover:text-green-900'
                            }
                          >
                            {t.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(t._id)}
                            className='text-red-600 hover:text-red-900'
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
