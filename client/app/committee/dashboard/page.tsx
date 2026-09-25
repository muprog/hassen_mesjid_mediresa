// 'use client'

// import { useSelector } from 'react-redux'
// import { RootState } from '../../store/store'

// export default function CommitteeDashboard() {
//   const { user } = useSelector((state: RootState) => state.auth)

//   return (
//     <div>
//       <div className='mb-6 md:mb-8'>
//         <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
//           Committee Dashboard
//         </h1>
//         <p className='text-gray-600 mt-2'>
//           Welcome back, <span className='font-medium'>{user?.name}</span>!
//         </p>
//         <p className='text-sm text-gray-500'>
//           You are logged in as{' '}
//           <span className='font-medium text-indigo-600'>Committee Leader</span>
//         </p>
//       </div>

//       {/* Statistics Cards */}
//       <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8'>
//         <div className='bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-md transition-shadow'>
//           <div className='flex items-center justify-between'>
//             <div className='min-w-0'>
//               <p className='text-xs sm:text-sm text-gray-600 truncate'>
//                 Total Students
//               </p>
//               <p className='text-xl sm:text-2xl font-bold text-gray-900'>0</p>
//             </div>
//             <div className='flex-shrink-0 p-2 sm:p-3 bg-blue-100 rounded-full'>
//               <span className='text-xl sm:text-2xl'>👨‍🎓</span>
//             </div>
//           </div>
//         </div>

//         <div className='bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-md transition-shadow'>
//           <div className='flex items-center justify-between'>
//             <div className='min-w-0'>
//               <p className='text-xs sm:text-sm text-gray-600 truncate'>
//                 Total Teachers
//               </p>
//               <p className='text-xl sm:text-2xl font-bold text-gray-900'>0</p>
//             </div>
//             <div className='flex-shrink-0 p-2 sm:p-3 bg-green-100 rounded-full'>
//               <span className='text-xl sm:text-2xl'>👨‍🏫</span>
//             </div>
//           </div>
//         </div>

//         <div className='bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-md transition-shadow'>
//           <div className='flex items-center justify-between'>
//             <div className='min-w-0'>
//               <p className='text-xs sm:text-sm text-gray-600 truncate'>
//                 Committee Members
//               </p>
//               <p className='text-xl sm:text-2xl font-bold text-gray-900'>1</p>
//             </div>
//             <div className='flex-shrink-0 p-2 sm:p-3 bg-purple-100 rounded-full'>
//               <span className='text-xl sm:text-2xl'>👥</span>
//             </div>
//           </div>
//         </div>

//         <div className='bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-md transition-shadow'>
//           <div className='flex items-center justify-between'>
//             <div className='min-w-0'>
//               <p className='text-xs sm:text-sm text-gray-600 truncate'>
//                 Total Revenue
//               </p>
//               <p className='text-xl sm:text-2xl font-bold text-gray-900'>$0</p>
//             </div>
//             <div className='flex-shrink-0 p-2 sm:p-3 bg-yellow-100 rounded-full'>
//               <span className='text-xl sm:text-2xl'>💰</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
//         <div className='bg-white p-4 md:p-6 rounded-lg shadow'>
//           <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4'>
//             Quick Actions
//           </h3>
//           <div className='space-y-2 md:space-y-3'>
//             <button
//               onClick={() =>
//                 (window.location.href = '/committee/students/create')
//               }
//               className='w-full text-left px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors truncate'
//             >
//               ➕ Register New Student
//             </button>
//             <button
//               onClick={() =>
//                 (window.location.href = '/committee/teachers/create')
//               }
//               className='w-full text-left px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors truncate'
//             >
//               ➕ Register New Teacher
//             </button>
//             <button className='w-full text-left px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors truncate'>
//               👥 Manage Committee
//             </button>
//             <button className='w-full text-left px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors truncate'>
//               💰 Record Payment
//             </button>
//           </div>
//         </div>

//         <div className='bg-white p-4 md:p-6 rounded-lg shadow'>
//           <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4'>
//             Recent Activity
//           </h3>
//           <div className='space-y-3'>
//             <div className='text-sm text-gray-500 text-center py-6 md:py-8'>
//               No recent activity to display
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState, AppDispatch } from '../../store/store'
import { getPaymentStatsStart } from '../../store/slices/paymentSlice'

export default function CommitteeDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.auth)
  const { stats } = useSelector((state: RootState) => state.payments)

  useEffect(() => {
    dispatch(getPaymentStatsStart())
  }, [dispatch])

  const go = (path: string) => router.push(path)

  return (
    <div>
      <div className='mb-6 md:mb-8'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
          Committee Dashboard
        </h1>
        <p className='text-gray-600 mt-2'>
          Welcome back, <span className='font-medium'>{user?.name}</span>!
        </p>
        <p className='text-sm text-gray-500'>
          You are logged in as{' '}
          <span className='font-medium text-indigo-600'>Committee Leader</span>
        </p>
      </div>

      {/* Payment Stats Widget */}
      {stats && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6'>
          <div className='bg-white p-4 md:p-6 rounded-lg shadow'>
            <p className='text-xs sm:text-sm text-gray-600 truncate'>
              Collected ({stats.currentPeriod})
            </p>
            <p className='text-xl sm:text-2xl font-bold text-green-700 mt-1'>
              {stats.collectedThisMonth} ETB
            </p>
          </div>
          <div className='bg-white p-4 md:p-6 rounded-lg shadow'>
            <p className='text-xs sm:text-sm text-gray-600 truncate'>
              Pending this month
            </p>
            <p className='text-xl sm:text-2xl font-bold text-amber-700 mt-1'>
              {stats.pendingThisMonth} ETB
            </p>
          </div>
          <div className='bg-white p-4 md:p-6 rounded-lg shadow'>
            <p className='text-xs sm:text-sm text-gray-600 truncate'>
              Total outstanding
            </p>
            <p className='text-xl sm:text-2xl font-bold text-red-700 mt-1'>
              {stats.totalOutstanding} ETB
            </p>
          </div>
          <div className='bg-white p-4 md:p-6 rounded-lg shadow'>
            <p className='text-xs sm:text-sm text-gray-600 truncate'>
              Students in arrears
            </p>
            <p className='text-xl sm:text-2xl font-bold text-red-700 mt-1'>
              {stats.studentsInArrears}
            </p>
          </div>
        </div>
      )}

      {/* General Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8'>
        <div className='bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-md transition-shadow'>
          <div className='flex items-center justify-between'>
            <div className='min-w-0'>
              <p className='text-xs sm:text-sm text-gray-600 truncate'>
                Total Students
              </p>
              <p className='text-xl sm:text-2xl font-bold text-gray-900'>0</p>
            </div>
            <div className='flex-shrink-0 p-2 sm:p-3 bg-blue-100 rounded-full'>
              <span className='text-xl sm:text-2xl'>👨‍🎓</span>
            </div>
          </div>
        </div>

        <div className='bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-md transition-shadow'>
          <div className='flex items-center justify-between'>
            <div className='min-w-0'>
              <p className='text-xs sm:text-sm text-gray-600 truncate'>
                Total Teachers
              </p>
              <p className='text-xl sm:text-2xl font-bold text-gray-900'>0</p>
            </div>
            <div className='flex-shrink-0 p-2 sm:p-3 bg-green-100 rounded-full'>
              <span className='text-xl sm:text-2xl'>👨‍🏫</span>
            </div>
          </div>
        </div>

        <div className='bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-md transition-shadow'>
          <div className='flex items-center justify-between'>
            <div className='min-w-0'>
              <p className='text-xs sm:text-sm text-gray-600 truncate'>
                Committee Members
              </p>
              <p className='text-xl sm:text-2xl font-bold text-gray-900'>1</p>
            </div>
            <div className='flex-shrink-0 p-2 sm:p-3 bg-purple-100 rounded-full'>
              <span className='text-xl sm:text-2xl'>👥</span>
            </div>
          </div>
        </div>

        <div className='bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-md transition-shadow'>
          <div className='flex items-center justify-between'>
            <div className='min-w-0'>
              <p className='text-xs sm:text-sm text-gray-600 truncate'>
                Total Revenue
              </p>
              <p className='text-xl sm:text-2xl font-bold text-gray-900'>$0</p>
            </div>
            <div className='flex-shrink-0 p-2 sm:p-3 bg-yellow-100 rounded-full'>
              <span className='text-xl sm:text-2xl'>💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
        <div className='bg-white p-4 md:p-6 rounded-lg shadow'>
          <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4'>
            Quick Actions
          </h3>
          <div className='space-y-2 md:space-y-3'>
            <button
              onClick={() => go('/committee/students/create')}
              className='w-full text-left px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors truncate'
            >
              ➕ Register New Student
            </button>
            <button
              onClick={() => go('/committee/teachers/create')}
              className='w-full text-left px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors truncate'
            >
              ➕ Register New Teacher
            </button>
            <button
              onClick={() => go('/committee/committee')}
              className='w-full text-left px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors truncate'
            >
              👥 Manage Committee
            </button>
            <button
              onClick={() => go('/committee/payments')}
              className='w-full text-left px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors truncate'
            >
              💰 Record Payment
            </button>
          </div>
        </div>

        <div className='bg-white p-4 md:p-6 rounded-lg shadow'>
          <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4'>
            Recent Activity
          </h3>
          <div className='space-y-3'>
            <div className='text-sm text-gray-500 text-center py-6 md:py-8'>
              No recent activity to display
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
