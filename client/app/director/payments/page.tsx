// 'use client'

// import { useEffect, useMemo, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useRouter } from 'next/navigation'
// import {
//   getGridStart,
//   shiftWindow,
//   setWindow,
//   setPaymentFilters,
//   markPaidStart,
//   undoPaymentStart,
//   generateForMonthStart,
//   createForMonthStart,
//   clearPaymentError,
//   clearPaymentSuccess,
//   markMonthPaidStart,
//   type GridPayment,
//   type GridStudent,
// } from '../../store/slices/paymentSlice'
// import { AppDispatch, RootState } from '../../store/store'
// import PaymentCellPopover from '../../components/PaymentCellPopover'

// const MONTH_SHORT = [
//   'Jan',
//   'Feb',
//   'Mar',
//   'Apr',
//   'May',
//   'Jun',
//   'Jul',
//   'Aug',
//   'Sep',
//   'Oct',
//   'Nov',
//   'Dec',
// ]
// const MONTH_FULL = [
//   'January',
//   'February',
//   'March',
//   'April',
//   'May',
//   'June',
//   'July',
//   'August',
//   'September',
//   'October',
//   'November',
//   'December',
// ]

// function monthLabel(y: number, m: number, short = true): string {
//   return short ? `${MONTH_SHORT[m - 1]} ${y}` : `${MONTH_FULL[m - 1]} ${y}`
// }

// interface Column {
//   year: number
//   month: number
//   key: number
// }

// function buildColumns(w: {
//   fromYear: number
//   fromMonth: number
//   toYear: number
//   toMonth: number
// }): Column[] {
//   const cols: Column[] = []
//   let y = w.fromYear
//   let m = w.fromMonth
//   while (y * 100 + m <= w.toYear * 100 + w.toMonth) {
//     cols.push({ year: y, month: m, key: y * 100 + m })
//     m += 1
//     if (m > 12) {
//       m = 1
//       y += 1
//     }
//   }
//   return cols
// }

// function findPayment(
//   payments: GridPayment[],
//   studentId: string,
//   year: number,
//   month: number
// ): GridPayment | undefined {
//   return payments.find(
//     (p) =>
//       p.student === studentId &&
//       p.periodYear === year &&
//       p.periodMonth === month
//   )
// }

// function beforeEnrollment(
//   student: GridStudent,
//   year: number,
//   month: number
// ): boolean {
//   const created = new Date(student.createdAt)
//   const createdKey = created.getFullYear() * 100 + (created.getMonth() + 1)
//   return year * 100 + month < createdKey
// }

// export default function DirectorPaymentsGridPage() {
//   const dispatch = useDispatch<AppDispatch>()
//   const router = useRouter()
//   const {
//     gridStudents,
//     gridPayments,
//     window: win,
//     isLoading,
//     error,
//     successMessage,
//     filters,
//   } = useSelector((s: RootState) => s.payments)
//   const { user } = useSelector((s: RootState) => s.auth)

//   const canWrite =
//     user?.role === 'committee_leader' || user?.role === 'director'

//   const [searchInput, setSearchInput] = useState(filters.search ?? '')
//   const [haleqaInput, setHaleqaInput] = useState(filters.haleqa ?? '')
//   const [sectionInput, setSectionInput] = useState(filters.section ?? '')

//   const [rangeOpen, setRangeOpen] = useState(false)
//   const [genOpen, setGenOpen] = useState(false)

//   const [fromY, setFromY] = useState(win.fromYear)
//   const [fromM, setFromM] = useState(win.fromMonth)
//   const [toY, setToY] = useState(win.toYear)
//   const [toM, setToM] = useState(win.toMonth)

//   const now = new Date()
//   const [genY, setGenY] = useState(now.getFullYear())
//   const [genM, setGenM] = useState(now.getMonth() + 1)

//   const columns = useMemo(() => buildColumns(win), [win])

//   const { fromYear, fromMonth, toYear, toMonth } = win
//   const {
//     search: filterSearch,
//     haleqa: filterHaleqa,
//     section: filterSection,
//   } = filters

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       sessionStorage.setItem('payments_window', JSON.stringify(win))
//     }
//   }, [win])

//   useEffect(() => {
//     dispatch(getGridStart({}))
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     fromYear,
//     fromMonth,
//     toYear,
//     toMonth,
//     filterSearch,
//     filterHaleqa,
//     filterSection,
//     dispatch,
//   ])

//   useEffect(() => {
//     const t = setTimeout(() => {
//       dispatch(
//         setPaymentFilters({
//           search: searchInput || undefined,
//           haleqa: haleqaInput || undefined,
//           section: sectionInput || undefined,
//         })
//       )
//     }, 400)
//     return () => clearTimeout(t)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [searchInput, haleqaInput, sectionInput])

//   useEffect(() => {
//     if (error) {
//       const t = setTimeout(() => dispatch(clearPaymentError()), 6000)
//       return () => clearTimeout(t)
//     }
//     if (successMessage) {
//       const t = setTimeout(() => dispatch(clearPaymentSuccess()), 3000)
//       return () => clearTimeout(t)
//     }
//   }, [error, successMessage, dispatch])

//   const handleMarkMonthPaid = (
//     s: GridStudent,
//     y: number,
//     m: number,
//     paymentType: string
//   ) => {
//     dispatch(
//       markMonthPaidStart({
//         studentId: s._id,
//         periodYear: y,
//         periodMonth: m,
//         paymentType,
//       })
//     )
//   }
//   const handleApplyRange = () => {
//     dispatch(
//       setWindow({
//         fromYear: fromY,
//         fromMonth: fromM,
//         toYear: toY,
//         toMonth: toM,
//       })
//     )
//     setRangeOpen(false)
//   }

//   const handleGenerate = () => {
//     dispatch(generateForMonthStart({ year: genY, month: genM }))
//     setGenOpen(false)
//   }

//   const handleCreatePending = (s: GridStudent, y: number, m: number) => {
//     dispatch(
//       createForMonthStart({
//         studentId: s._id,
//         periodYear: y,
//         periodMonth: m,
//         markPaid: false,
//       })
//     )
//   }

//   const handleCreateAndPay = (s: GridStudent, y: number, m: number) => {
//     dispatch(
//       createForMonthStart({
//         studentId: s._id,
//         periodYear: y,
//         periodMonth: m,
//         markPaid: true,
//       })
//     )
//   }

//   return (
//     <div>
//       <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 w-full'>
//         <div className='min-w-0 flex-1'>
//           <h1 className='text-2xl font-bold text-gray-900 truncate'>
//             Payments
//           </h1>
//           <p className='text-gray-600 mt-1 truncate'>
//             One row per student, one column per month
//           </p>
//         </div>

//         {canWrite && (
//           <div className='relative flex-shrink-0'>
//             <button
//               onClick={() => setGenOpen((v) => !v)}
//               className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap'
//             >
//               Generate Month ▾
//             </button>
//             {genOpen && (
//               <div className='absolute right-0 mt-1 z-30 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4'>
//                 <p className='text-xs font-semibold text-gray-900 mb-2'>
//                   Create pending records for
//                 </p>
//                 <div className='flex gap-2 mb-3'>
//                   <select
//                     value={genM}
//                     onChange={(e) => setGenM(Number(e.target.value))}
//                     className='flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md'
//                   >
//                     {MONTH_FULL.map((l, i) => (
//                       <option key={l} value={i + 1}>
//                         {l}
//                       </option>
//                     ))}
//                   </select>
//                   <input
//                     type='number'
//                     min={2020}
//                     max={2100}
//                     value={genY}
//                     onChange={(e) => setGenY(Number(e.target.value))}
//                     className='w-24 px-2 py-1.5 text-sm border border-gray-300 rounded-md'
//                   />
//                 </div>
//                 <button
//                   onClick={handleGenerate}
//                   className='w-full px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700'
//                 >
//                   Generate
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {successMessage && (
//         <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700'>
//           {successMessage}
//         </div>
//       )}
//       {error && (
//         <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600'>
//           {error}
//         </div>
//       )}

//       <div className='bg-white rounded-lg shadow p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
//         <input
//           type='text'
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//           placeholder='Search name, code, phone...'
//           className='px-3 py-2 border border-gray-300 rounded-md'
//         />
//         <input
//           type='text'
//           value={haleqaInput}
//           onChange={(e) => setHaleqaInput(e.target.value)}
//           placeholder='Filter by haleqa...'
//           className='px-3 py-2 border border-gray-300 rounded-md'
//         />
//         <select
//           value={sectionInput}
//           onChange={(e) => setSectionInput(e.target.value)}
//           className='px-3 py-2 border border-gray-300 rounded-md'
//         >
//           <option value=''>All sections</option>
//           <option value='A'>A</option>
//           <option value='B'>B</option>
//           <option value='C'>C</option>
//           <option value='D'>D</option>
//         </select>
//         <button
//           onClick={() => {
//             setSearchInput('')
//             setHaleqaInput('')
//             setSectionInput('')
//           }}
//           className='text-sm text-gray-600 hover:text-gray-900 justify-self-start self-center'
//         >
//           Clear filters
//         </button>
//       </div>

//       <div className='flex flex-wrap items-center gap-3 mb-4'>
//         <button
//           onClick={() => dispatch(shiftWindow(-1))}
//           className='px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
//         >
//           ←
//         </button>

//         <div className='relative'>
//           <button
//             onClick={() => setRangeOpen((v) => !v)}
//             className='px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100'
//           >
//             {monthLabel(fromYear, fromMonth)} — {monthLabel(toYear, toMonth)}
//           </button>
//           {rangeOpen && (
//             <div className='absolute z-30 left-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4'>
//               <p className='text-xs font-semibold text-gray-900 mb-2'>From</p>
//               <div className='flex gap-2 mb-3'>
//                 <select
//                   value={fromM}
//                   onChange={(e) => setFromM(Number(e.target.value))}
//                   className='flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md'
//                 >
//                   {MONTH_FULL.map((l, i) => (
//                     <option key={l} value={i + 1}>
//                       {l}
//                     </option>
//                   ))}
//                 </select>
//                 <input
//                   type='number'
//                   value={fromY}
//                   onChange={(e) => setFromY(Number(e.target.value))}
//                   className='w-24 px-2 py-1.5 text-sm border border-gray-300 rounded-md'
//                 />
//               </div>
//               <p className='text-xs font-semibold text-gray-900 mb-2'>To</p>
//               <div className='flex gap-2 mb-3'>
//                 <select
//                   value={toM}
//                   onChange={(e) => setToM(Number(e.target.value))}
//                   className='flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md'
//                 >
//                   {MONTH_FULL.map((l, i) => (
//                     <option key={l} value={i + 1}>
//                       {l}
//                     </option>
//                   ))}
//                 </select>
//                 <input
//                   type='number'
//                   value={toY}
//                   onChange={(e) => setToY(Number(e.target.value))}
//                   className='w-24 px-2 py-1.5 text-sm border border-gray-300 rounded-md'
//                 />
//               </div>
//               <button
//                 onClick={handleApplyRange}
//                 className='w-full px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700'
//               >
//                 Apply
//               </button>
//             </div>
//           )}
//         </div>

//         <button
//           onClick={() => dispatch(shiftWindow(1))}
//           className='px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
//         >
//           →
//         </button>
//       </div>

//       {isLoading ? (
//         <div className='flex justify-center py-12'>
//           <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
//         </div>
//       ) : gridStudents.length === 0 ? (
//         <div className='bg-white rounded-lg shadow p-12 text-center text-gray-500'>
//           No paying students found.
//         </div>
//       ) : (
//         <div className='bg-white rounded-lg shadow'>
//           <div className='overflow-x-auto'>
//             <table className='min-w-full divide-y divide-gray-200'>
//               <thead className='bg-gray-50'>
//                 <tr>
//                   <th className='sticky left-0 z-20 bg-gray-50 border-r border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-[90px] min-w-[90px]'>
//                     Code
//                   </th>
//                   <th className='md:sticky md:left-[90px] z-20 bg-gray-50 md:border-r md:border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-[180px] min-w-[180px]'>
//                     Full Name
//                   </th>
//                   <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-[130px] min-w-[130px]'>
//                     Phone
//                   </th>
//                   {columns.map((c) => (
//                     <th
//                       key={c.key}
//                       className='px-2 py-2 text-center text-xs font-medium text-gray-500 whitespace-nowrap w-[80px] min-w-[80px]'
//                     >
//                       <span className='hidden lg:inline'>
//                         {monthLabel(c.year, c.month)}
//                       </span>
//                       <span className='lg:hidden'>
//                         {MONTH_SHORT[c.month - 1]}
//                         <br />
//                         <span className='text-[10px] text-gray-400'>
//                           {c.year}
//                         </span>
//                       </span>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className='bg-white divide-y divide-gray-100'>
//                 {gridStudents.map((s) => {
//                   const phone = s.fatherPhone || s.motherPhone || '—'
//                   return (
//                     <tr key={s._id} className='hover:bg-gray-50'>
//                       <td className='sticky left-0 z-10 bg-white border-r border-gray-200 px-3 py-2 text-sm font-mono text-gray-700 whitespace-nowrap w-[90px] min-w-[90px]'>
//                         {s.code}
//                       </td>
//                       {/* <td className='md:sticky md:left-[90px] z-10 bg-white md:border-r md:border-gray-200 px-3 py-2 text-sm font-medium text-gray-900 whitespace-nowrap w-[180px] min-w-[180px]'>
//                         {s.fullName}
//                       </td> */}
//                       <td className='md:sticky md:left-[90px] z-10 bg-white md:border-r md:border-gray-200 px-3 py-2 text-sm font-medium text-gray-900 whitespace-nowrap w-[180px] min-w-[180px]'>
//                         {s.fullName}
//                         {!s.hasPayment && (
//                           <span className='ml-2 px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-gray-200 text-gray-600'>
//                             No payment
//                           </span>
//                         )}
//                       </td>
//                       <td className='px-3 py-2 text-sm text-gray-700 whitespace-nowrap w-[130px] min-w-[130px]'>
//                         {phone}
//                       </td>
//                       {columns.map((c) => {
//                         if (beforeEnrollment(s, c.year, c.month)) {
//                           return (
//                             <td
//                               key={c.key}
//                               className='px-1 py-2 text-center text-xs text-gray-300 w-[80px]'
//                             >
//                               —
//                             </td>
//                           )
//                         }
//                         const payment = findPayment(
//                           gridPayments,
//                           s._id,
//                           c.year,
//                           c.month
//                         )
//                         return (
//                           <td
//                             key={c.key}
//                             className='px-1 py-2 text-center w-[80px]'
//                           >
//                             {/* <PaymentCellPopover
//                               student={s}
//                               year={c.year}
//                               month={c.month}
//                               payment={payment}
//                               canWrite={canWrite}
//                               simplified={true}
//                               onMarkPaid={(id) => dispatch(markPaidStart(id))}
//                               onUndo={(id) => dispatch(undoPaymentStart(id))}
//                               onEdit={(id) =>
//                                 router.push(`/director/payments/${id}/edit`)
//                               }
//                               onCreatePending={handleCreatePending}
//                               onCreateAndPay={handleCreateAndPay}
//                             /> */}
//                             <PaymentCellPopover
//                               student={s}
//                               year={c.year}
//                               month={c.month}
//                               payment={payment}
//                               canWrite={canWrite}
//                               simplified={true}
//                               onMarkPaid={(id) => dispatch(markPaidStart(id))}
//                               onUndo={(id) => dispatch(undoPaymentStart(id))}
//                               onEdit={(id) =>
//                                 router.push(`/director/payments/${id}/edit`)
//                               }
//                               onCreatePending={handleCreatePending}
//                               onCreateAndPay={handleCreateAndPay}
//                               onMarkMonthPaid={handleMarkMonthPaid}
//                             />
//                           </td>
//                         )
//                       })}
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

'use client'

import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import {
  getGridStart,
  shiftWindow,
  setWindow,
  setPaymentFilters,
  markPaidStart,
  undoPaymentStart,
  generateForMonthStart,
  createForMonthStart,
  clearPaymentError,
  clearPaymentSuccess,
  markMonthPaidStart,
  type GridPayment,
  type GridStudent,
} from '../../store/slices/paymentSlice'
import { getPaymentTypesStart } from '../../store/slices/paymentTypeSlice'
import { AppDispatch, RootState } from '../../store/store'
import PaymentCellPopover from '../../components/PaymentCellPopover'

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const MONTH_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function monthLabel(y: number, m: number, short = true): string {
  return short ? `${MONTH_SHORT[m - 1]} ${y}` : `${MONTH_FULL[m - 1]} ${y}`
}

interface Column {
  year: number
  month: number
  key: number
}

function buildColumns(w: {
  fromYear: number
  fromMonth: number
  toYear: number
  toMonth: number
}): Column[] {
  const cols: Column[] = []
  let y = w.fromYear
  let m = w.fromMonth
  while (y * 100 + m <= w.toYear * 100 + w.toMonth) {
    cols.push({ year: y, month: m, key: y * 100 + m })
    m += 1
    if (m > 12) {
      m = 1
      y += 1
    }
  }
  return cols
}

function findPayment(
  payments: GridPayment[],
  studentId: string,
  year: number,
  month: number
): GridPayment | undefined {
  return payments.find(
    (p) =>
      p.student === studentId &&
      p.periodYear === year &&
      p.periodMonth === month
  )
}

function beforeEnrollment(
  student: GridStudent,
  year: number,
  month: number
): boolean {
  const created = new Date(student.createdAt)
  const createdKey = created.getFullYear() * 100 + (created.getMonth() + 1)
  return year * 100 + month < createdKey
}

export default function DirectorPaymentsGridPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const {
    gridStudents,
    gridPayments,
    window: win,
    isLoading,
    error,
    successMessage,
    filters,
  } = useSelector((s: RootState) => s.payments)
  const { user } = useSelector((s: RootState) => s.auth)

  const canWrite =
    user?.role === 'committee_leader' || user?.role === 'director'

  const [searchInput, setSearchInput] = useState(filters.search ?? '')
  const [haleqaInput, setHaleqaInput] = useState(filters.haleqa ?? '')
  const [sectionInput, setSectionInput] = useState(filters.section ?? '')

  const [rangeOpen, setRangeOpen] = useState(false)
  const [genOpen, setGenOpen] = useState(false)

  const [fromY, setFromY] = useState(win.fromYear)
  const [fromM, setFromM] = useState(win.fromMonth)
  const [toY, setToY] = useState(win.toYear)
  const [toM, setToM] = useState(win.toMonth)

  const now = new Date()
  const [genY, setGenY] = useState(now.getFullYear())
  const [genM, setGenM] = useState(now.getMonth() + 1)

  const columns = useMemo(() => buildColumns(win), [win])

  const { fromYear, fromMonth, toYear, toMonth } = win
  const {
    search: filterSearch,
    haleqa: filterHaleqa,
    section: filterSection,
  } = filters

  // Load payment types once so the popover dropdown has options
  useEffect(() => {
    dispatch(getPaymentTypesStart({ filters: { activeOnly: 'true' } }))
  }, [dispatch])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('payments_window', JSON.stringify(win))
    }
  }, [win])

  useEffect(() => {
    dispatch(getGridStart({}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fromYear,
    fromMonth,
    toYear,
    toMonth,
    filterSearch,
    filterHaleqa,
    filterSection,
    dispatch,
  ])

  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(
        setPaymentFilters({
          search: searchInput || undefined,
          haleqa: haleqaInput || undefined,
          section: sectionInput || undefined,
        })
      )
    }, 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, haleqaInput, sectionInput])

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => dispatch(clearPaymentError()), 6000)
      return () => clearTimeout(t)
    }
    if (successMessage) {
      const t = setTimeout(() => dispatch(clearPaymentSuccess()), 3000)
      return () => clearTimeout(t)
    }
  }, [error, successMessage, dispatch])

  const handleMarkMonthPaid = (
    s: GridStudent,
    y: number,
    m: number,
    paymentType: string
  ) => {
    dispatch(
      markMonthPaidStart({
        studentId: s._id,
        periodYear: y,
        periodMonth: m,
        paymentType,
      })
    )
  }

  const handleApplyRange = () => {
    dispatch(
      setWindow({
        fromYear: fromY,
        fromMonth: fromM,
        toYear: toY,
        toMonth: toM,
      })
    )
    setRangeOpen(false)
  }

  const handleGenerate = () => {
    dispatch(generateForMonthStart({ year: genY, month: genM }))
    setGenOpen(false)
  }

  const handleCreatePending = (s: GridStudent, y: number, m: number) => {
    dispatch(
      createForMonthStart({
        studentId: s._id,
        periodYear: y,
        periodMonth: m,
        markPaid: false,
      })
    )
  }

  const handleCreateAndPay = (s: GridStudent, y: number, m: number) => {
    dispatch(
      createForMonthStart({
        studentId: s._id,
        periodYear: y,
        periodMonth: m,
        markPaid: true,
      })
    )
  }

  return (
    <div>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 w-full'>
        <div className='min-w-0 flex-1'>
          <h1 className='text-2xl font-bold text-gray-900 truncate'>
            Payments
          </h1>
          <p className='text-gray-600 mt-1 truncate'>
            One row per student, one column per month
          </p>
        </div>

        {canWrite && (
          <div className='relative flex-shrink-0'>
            <button
              onClick={() => setGenOpen((v) => !v)}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap'
            >
              Generate Month ▾
            </button>
            {genOpen && (
              <div className='absolute right-0 mt-1 z-30 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4'>
                <p className='text-xs font-semibold text-gray-900 mb-2'>
                  Create pending records for
                </p>
                <div className='flex gap-2 mb-3'>
                  <select
                    value={genM}
                    onChange={(e) => setGenM(Number(e.target.value))}
                    className='flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md'
                  >
                    {MONTH_FULL.map((l, i) => (
                      <option key={l} value={i + 1}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <input
                    type='number'
                    min={2020}
                    max={2100}
                    value={genY}
                    onChange={(e) => setGenY(Number(e.target.value))}
                    className='w-24 px-2 py-1.5 text-sm border border-gray-300 rounded-md'
                  />
                </div>
                <button
                  onClick={handleGenerate}
                  className='w-full px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700'
                >
                  Generate
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {successMessage && (
        <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700'>
          {successMessage}
        </div>
      )}
      {error && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600'>
          {error}
        </div>
      )}

      <div className='bg-white rounded-lg shadow p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
        <input
          type='text'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder='Search name, code, phone...'
          className='px-3 py-2 border border-gray-300 rounded-md'
        />
        <input
          type='text'
          value={haleqaInput}
          onChange={(e) => setHaleqaInput(e.target.value)}
          placeholder='Filter by haleqa...'
          className='px-3 py-2 border border-gray-300 rounded-md'
        />
        <select
          value={sectionInput}
          onChange={(e) => setSectionInput(e.target.value)}
          className='px-3 py-2 border border-gray-300 rounded-md'
        >
          <option value=''>All sections</option>
          <option value='A'>A</option>
          <option value='B'>B</option>
          <option value='C'>C</option>
          <option value='D'>D</option>
        </select>
        <button
          onClick={() => {
            setSearchInput('')
            setHaleqaInput('')
            setSectionInput('')
          }}
          className='text-sm text-gray-600 hover:text-gray-900 justify-self-start self-center'
        >
          Clear filters
        </button>
      </div>

      <div className='flex flex-wrap items-center gap-3 mb-4'>
        <button
          onClick={() => dispatch(shiftWindow(-1))}
          className='px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
        >
          ←
        </button>

        <div className='relative'>
          <button
            onClick={() => setRangeOpen((v) => !v)}
            className='px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100'
          >
            {monthLabel(fromYear, fromMonth)} — {monthLabel(toYear, toMonth)}
          </button>
          {rangeOpen && (
            <div className='absolute z-30 left-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4'>
              <p className='text-xs font-semibold text-gray-900 mb-2'>From</p>
              <div className='flex gap-2 mb-3'>
                <select
                  value={fromM}
                  onChange={(e) => setFromM(Number(e.target.value))}
                  className='flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md'
                >
                  {MONTH_FULL.map((l, i) => (
                    <option key={l} value={i + 1}>
                      {l}
                    </option>
                  ))}
                </select>
                <input
                  type='number'
                  value={fromY}
                  onChange={(e) => setFromY(Number(e.target.value))}
                  className='w-24 px-2 py-1.5 text-sm border border-gray-300 rounded-md'
                />
              </div>
              <p className='text-xs font-semibold text-gray-900 mb-2'>To</p>
              <div className='flex gap-2 mb-3'>
                <select
                  value={toM}
                  onChange={(e) => setToM(Number(e.target.value))}
                  className='flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md'
                >
                  {MONTH_FULL.map((l, i) => (
                    <option key={l} value={i + 1}>
                      {l}
                    </option>
                  ))}
                </select>
                <input
                  type='number'
                  value={toY}
                  onChange={(e) => setToY(Number(e.target.value))}
                  className='w-24 px-2 py-1.5 text-sm border border-gray-300 rounded-md'
                />
              </div>
              <button
                onClick={handleApplyRange}
                className='w-full px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700'
              >
                Apply
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => dispatch(shiftWindow(1))}
          className='px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
        >
          →
        </button>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        </div>
      ) : gridStudents.length === 0 ? (
        <div className='bg-white rounded-lg shadow p-12 text-center text-gray-500'>
          No paying students found.
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='sticky left-0 z-20 bg-gray-50 border-r border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-[90px] min-w-[90px]'>
                    Code
                  </th>
                  <th className='md:sticky md:left-[90px] z-20 bg-gray-50 md:border-r md:border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-[180px] min-w-[180px]'>
                    Full Name
                  </th>
                  <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-[130px] min-w-[130px]'>
                    Phone
                  </th>
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      className='px-2 py-2 text-center text-xs font-medium text-gray-500 whitespace-nowrap w-[80px] min-w-[80px]'
                    >
                      <span className='hidden lg:inline'>
                        {monthLabel(c.year, c.month)}
                      </span>
                      <span className='lg:hidden'>
                        {MONTH_SHORT[c.month - 1]}
                        <br />
                        <span className='text-[10px] text-gray-400'>
                          {c.year}
                        </span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-100'>
                {gridStudents.map((s) => {
                  const phone = s.fatherPhone || s.motherPhone || '—'
                  return (
                    <tr key={s._id} className='hover:bg-gray-50'>
                      <td className='sticky left-0 z-10 bg-white border-r border-gray-200 px-3 py-2 text-sm font-mono text-gray-700 whitespace-nowrap w-[90px] min-w-[90px]'>
                        {s.code}
                      </td>
                      <td className='md:sticky md:left-[90px] z-10 bg-white md:border-r md:border-gray-200 px-3 py-2 text-sm font-medium text-gray-900 whitespace-nowrap w-[180px] min-w-[180px]'>
                        {s.fullName}
                        {!s.hasPayment && (
                          <span className='ml-2 px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-gray-200 text-gray-600'>
                            No payment
                          </span>
                        )}
                      </td>
                      <td className='px-3 py-2 text-sm text-gray-700 whitespace-nowrap w-[130px] min-w-[130px]'>
                        {phone}
                      </td>
                      {columns.map((c) => {
                        if (beforeEnrollment(s, c.year, c.month)) {
                          return (
                            <td
                              key={c.key}
                              className='px-1 py-2 text-center text-xs text-gray-300 w-[80px]'
                            >
                              —
                            </td>
                          )
                        }
                        const payment = findPayment(
                          gridPayments,
                          s._id,
                          c.year,
                          c.month
                        )
                        return (
                          <td
                            key={c.key}
                            className='px-1 py-2 text-center w-[80px]'
                          >
                            <PaymentCellPopover
                              student={s}
                              year={c.year}
                              month={c.month}
                              payment={payment}
                              canWrite={canWrite}
                              simplified={true}
                              onMarkPaid={(id) => dispatch(markPaidStart(id))}
                              onUndo={(id) => dispatch(undoPaymentStart(id))}
                              onEdit={(id) =>
                                router.push(`/director/payments/${id}/edit`)
                              }
                              onCreatePending={handleCreatePending}
                              onCreateAndPay={handleCreateAndPay}
                              onMarkMonthPaid={handleMarkMonthPaid}
                            />
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
