// 'use client'

// import { useEffect, useMemo, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import {
//   getPaymentReportStart,
//   clearReportError,
// } from '../../store/slices/reportSlice'
// import { AppDispatch, RootState } from '../../store/store'

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

// function formatDate(dayKey: string): string {
//   // dayKey = "2026-09-15"
//   const [y, m, d] = dayKey.split('-').map(Number)
//   if (!y || !m || !d) return dayKey
//   return `${MONTH_FULL[m - 1].slice(0, 3)} ${d}, ${y}`
// }

// function formatMoney(n: number): string {
//   return `${n.toLocaleString()} ETB`
// }

// export default function ReportsPage() {
//   const dispatch = useDispatch<AppDispatch>()
//   const { summary, period, byDay, payments, filters, isLoading, error } =
//     useSelector((s: RootState) => s.reports)
//   const { user } = useSelector((s: RootState) => s.auth)

//   const now = new Date()
//   const [year, setYear] = useState(filters.year ?? now.getFullYear())
//   const [month, setMonth] = useState(filters.month ?? now.getMonth() + 1)
//   const [day, setDay] = useState(filters.day ?? '')
//   const [method, setMethod] = useState(filters.method ?? '')
//   const [receivedBy, setReceivedBy] = useState(filters.receivedBy ?? '')

//   useEffect(() => {
//     dispatch(
//       getPaymentReportStart({
//         year,
//         month,
//         day: day || undefined,
//         method: method || undefined,
//         receivedBy: receivedBy || undefined,
//       })
//     )
//   }, [dispatch, year, month, day, method, receivedBy])

//   useEffect(() => {
//     if (error) {
//       const t = setTimeout(() => dispatch(clearReportError()), 6000)
//       return () => clearTimeout(t)
//     }
//   }, [error, dispatch])

//   const canView =
//     user?.role === 'committee_leader' ||
//     user?.role === 'committee_member' ||
//     user?.role === 'director'

//   const yearOptions = useMemo(() => {
//     const current = now.getFullYear()
//     return [current + 1, current, current - 1, current - 2]
//   }, [now])

//   const handlePrint = () => {
//     window.print()
//   }

//   const handleExportCSV = () => {
//     if (!payments.length) return
//     const rows: string[][] = [
//       [
//         'Code',
//         'Name',
//         'Haleqa',
//         'For Months',
//         'Total Amount',
//         'Method',
//         'Date',
//         'Received By',
//       ],
//     ]
//     for (const g of payments) {
//       rows.push([
//         g.student.code,
//         g.student.fullName,
//         g.student.haleqa,
//         g.forMonths.map((m) => m.label).join(' | '),
//         String(g.totalAmount),
//         g.method ?? '',
//         formatDate(g.dayKey),
//         g.receivedBy?.fullName ?? g.receivedBy?.name ?? '',
//       ])
//     }
//     const csv = rows
//       .map((r) =>
//         r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
//       )
//       .join('\n')
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = `report-${period?.year ?? year}-${String(
//       period?.month ?? month
//     ).padStart(2, '0')}.csv`
//     a.click()
//     URL.revokeObjectURL(url)
//   }

//   if (!canView) {
//     return (
//       <div className='text-center py-12'>
//         <p className='text-red-600'>Access denied</p>
//       </div>
//     )
//   }

//   return (
//     <div>
//       {/* Header */}
//       <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
//         <div>
//           <h1 className='text-2xl font-bold text-gray-900'>Reports</h1>
//           <p className='text-gray-600 mt-1'>
//             Income by collection date and the months they paid for
//           </p>
//         </div>
//         <div className='flex gap-2 flex-shrink-0'>
//           <button
//             onClick={handlePrint}
//             className='px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50'
//           >
//             Print
//           </button>
//           <button
//             onClick={handleExportCSV}
//             disabled={!payments.length}
//             className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50'
//           >
//             Export CSV
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600'>
//           {error}
//         </div>
//       )}

//       {/* Top cards */}
//       {summary && (
//         <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
//           <div className='bg-white p-5 rounded-lg shadow'>
//             <p className='text-xs text-gray-600'>Today</p>
//             <p className='text-2xl font-bold text-green-700 mt-1'>
//               {formatMoney(summary.today.amount)}
//             </p>
//             <p className='text-xs text-gray-500 mt-1'>
//               {summary.today.count} payments
//             </p>
//           </div>
//           <div className='bg-white p-5 rounded-lg shadow'>
//             <p className='text-xs text-gray-600'>
//               This month ({MONTH_FULL[now.getMonth()]} {now.getFullYear()})
//             </p>
//             <p className='text-2xl font-bold text-green-700 mt-1'>
//               {formatMoney(summary.thisMonth.amount)}
//             </p>
//             <p className='text-xs text-gray-500 mt-1'>
//               {summary.thisMonth.count} payments
//             </p>
//           </div>
//           <div className='bg-white p-5 rounded-lg shadow'>
//             <p className='text-xs text-gray-600'>
//               This year ({now.getFullYear()})
//             </p>
//             <p className='text-2xl font-bold text-green-700 mt-1'>
//               {formatMoney(summary.thisYear.amount)}
//             </p>
//             <p className='text-xs text-gray-500 mt-1'>
//               {summary.thisYear.count} payments
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Filters */}
//       <div className='bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3'>
//         <div>
//           <label className='block text-xs font-medium text-gray-600 mb-1'>
//             Month
//           </label>
//           <select
//             value={month}
//             onChange={(e) => setMonth(Number(e.target.value))}
//             className='w-full px-3 py-2 border border-gray-300 rounded-md'
//           >
//             {MONTH_FULL.map((l, i) => (
//               <option key={l} value={i + 1}>
//                 {l}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className='block text-xs font-medium text-gray-600 mb-1'>
//             Year
//           </label>
//           <select
//             value={year}
//             onChange={(e) => setYear(Number(e.target.value))}
//             className='w-full px-3 py-2 border border-gray-300 rounded-md'
//           >
//             {yearOptions.map((y) => (
//               <option key={y} value={y}>
//                 {y}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className='block text-xs font-medium text-gray-600 mb-1'>
//             Day (optional)
//           </label>
//           <input
//             type='date'
//             value={day}
//             onChange={(e) => setDay(e.target.value)}
//             className='w-full px-3 py-2 border border-gray-300 rounded-md'
//           />
//         </div>
//         <div>
//           <label className='block text-xs font-medium text-gray-600 mb-1'>
//             Method
//           </label>
//           <select
//             value={method}
//             onChange={(e) => setMethod(e.target.value)}
//             className='w-full px-3 py-2 border border-gray-300 rounded-md'
//           >
//             <option value=''>All</option>
//             <option value='cash'>Cash</option>
//             <option value='bank'>Bank</option>
//             <option value='mobile_money'>Mobile Money</option>
//             <option value='other'>Other</option>
//           </select>
//         </div>
//         <div className='flex items-end'>
//           <button
//             onClick={() => {
//               setDay('')
//               setMethod('')
//               setReceivedBy('')
//             }}
//             className='text-sm text-gray-600 hover:text-gray-900'
//           >
//             Clear extra filters
//           </button>
//         </div>
//       </div>

//       {/* Period summary */}
//       {period && (
//         <div className='bg-white rounded-lg shadow p-5 mb-6'>
//           <h2 className='text-lg font-semibold text-gray-900'>
//             {period.label} Income
//           </h2>
//           <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3'>
//             <div>
//               <p className='text-xs text-gray-600'>Total collected</p>
//               <p className='text-xl font-bold text-green-700'>
//                 {formatMoney(period.collected)}
//               </p>
//             </div>
//             <div>
//               <p className='text-xs text-gray-600'>Payments</p>
//               <p className='text-xl font-bold text-gray-900'>{period.count}</p>
//             </div>
//             <div>
//               <p className='text-xs text-gray-600'>Unique students</p>
//               <p className='text-xl font-bold text-gray-900'>
//                 {period.uniqueStudents}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Day-by-day */}
//       <div className='bg-white rounded-lg shadow mb-6 overflow-hidden'>
//         <div className='px-5 py-3 bg-gray-50 border-b'>
//           <h3 className='text-sm font-semibold text-gray-700'>
//             Day-by-day ({period?.label})
//           </h3>
//         </div>
//         {isLoading ? (
//           <div className='flex justify-center py-8'>
//             <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600'></div>
//           </div>
//         ) : byDay.length === 0 ? (
//           <div className='text-center py-8 text-sm text-gray-500'>
//             No payments this month.
//           </div>
//         ) : (
//           <table className='min-w-full divide-y divide-gray-200'>
//             <thead className='bg-white'>
//               <tr>
//                 <th className='px-5 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
//                   Day
//                 </th>
//                 <th className='px-5 py-2 text-right text-xs font-medium text-gray-500 uppercase'>
//                   Amount
//                 </th>
//                 <th className='px-5 py-2 text-right text-xs font-medium text-gray-500 uppercase'>
//                   Payments
//                 </th>
//               </tr>
//             </thead>
//             <tbody className='divide-y divide-gray-100'>
//               {byDay.map((d) => (
//                 <tr
//                   key={d.day}
//                   className='hover:bg-gray-50 cursor-pointer'
//                   onClick={() => setDay(d.day)}
//                 >
//                   <td className='px-5 py-2 text-sm text-gray-900'>
//                     {formatDate(d.day)}
//                   </td>
//                   <td className='px-5 py-2 text-sm text-right text-gray-900'>
//                     {formatMoney(d.amount)}
//                   </td>
//                   <td className='px-5 py-2 text-sm text-right text-gray-700'>
//                     {d.count}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Payments grouped */}
//       <div className='bg-white rounded-lg shadow overflow-hidden'>
//         <div className='px-5 py-3 bg-gray-50 border-b flex items-center justify-between'>
//           <h3 className='text-sm font-semibold text-gray-700'>
//             Payments {day ? `on ${formatDate(day)}` : `in ${period?.label}`}
//           </h3>
//           {day && (
//             <button
//               onClick={() => setDay('')}
//               className='text-xs text-indigo-600 hover:text-indigo-800'
//             >
//               Show all days
//             </button>
//           )}
//         </div>
//         {isLoading ? (
//           <div className='flex justify-center py-8'>
//             <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600'></div>
//           </div>
//         ) : payments.length === 0 ? (
//           <div className='text-center py-8 text-sm text-gray-500'>
//             No payments to show.
//           </div>
//         ) : (
//           <div className='overflow-x-auto'>
//             <table className='min-w-full divide-y divide-gray-200'>
//               <thead className='bg-white'>
//                 <tr>
//                   <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
//                     Date
//                   </th>
//                   <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
//                     Code
//                   </th>
//                   <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
//                     Student
//                   </th>
//                   <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
//                     For Months
//                   </th>
//                   <th className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase'>
//                     Total
//                   </th>
//                   <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
//                     Method
//                   </th>
//                   <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
//                     Received By
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className='divide-y divide-gray-100'>
//                 {payments.map((g, idx) => (
//                   <tr key={idx} className='hover:bg-gray-50'>
//                     <td className='px-4 py-2 text-sm text-gray-900 whitespace-nowrap'>
//                       {formatDate(g.dayKey)}
//                     </td>
//                     <td className='px-4 py-2 text-sm font-mono text-gray-700 whitespace-nowrap'>
//                       {g.student.code}
//                     </td>
//                     <td className='px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap'>
//                       {g.student.fullName}
//                     </td>
//                     <td className='px-4 py-2 text-sm text-gray-700'>
//                       {g.forMonths.map((m) => m.label).join(', ')}
//                     </td>
//                     <td className='px-4 py-2 text-sm text-right font-medium text-gray-900'>
//                       {formatMoney(g.totalAmount)}
//                     </td>
//                     <td className='px-4 py-2 text-sm text-gray-700 whitespace-nowrap'>
//                       {g.method ?? '—'}
//                     </td>
//                     <td className='px-4 py-2 text-sm text-gray-700 whitespace-nowrap'>
//                       {g.receivedBy?.fullName ?? g.receivedBy?.name ?? '—'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

'use client'

import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getPaymentReportStart,
  getUnpaidReportStart,
  clearReportError,
} from '../../store/slices/reportSlice'
import { AppDispatch, RootState } from '../../store/store'

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

function formatDate(dayKey: string): string {
  const [y, m, d] = dayKey.split('-').map(Number)
  if (!y || !m || !d) return dayKey
  return `${MONTH_FULL[m - 1].slice(0, 3)} ${d}, ${y}`
}

function formatMoney(n: number): string {
  return `${n.toLocaleString()} ETB`
}

type Tab = 'paid' | 'unpaid'

export default function ReportsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const {
    summary,
    period,
    byDay,
    payments,
    filters,
    isLoading,
    error,
    unpaidSummary,
    unpaidPeriod,
    unpaidList,
    unpaidLoading,
  } = useSelector((s: RootState) => s.reports)
  const { user } = useSelector((s: RootState) => s.auth)

  const now = new Date()
  const [tab, setTab] = useState<Tab>('paid')
  const [year, setYear] = useState(filters.year ?? now.getFullYear())
  const [month, setMonth] = useState(filters.month ?? now.getMonth() + 1)
  const [day, setDay] = useState(filters.day ?? '')
  const [method, setMethod] = useState(filters.method ?? '')
  const [receivedBy, setReceivedBy] = useState(filters.receivedBy ?? '')

  // Load paid report
  useEffect(() => {
    if (tab !== 'paid') return
    dispatch(
      getPaymentReportStart({
        year,
        month,
        day: day || undefined,
        method: method || undefined,
        receivedBy: receivedBy || undefined,
      })
    )
  }, [dispatch, tab, year, month, day, method, receivedBy])

  // Load unpaid report (period = same month/year)
  useEffect(() => {
    if (tab !== 'unpaid') return
    dispatch(getUnpaidReportStart({ year, month }))
  }, [dispatch, tab, year, month])

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => dispatch(clearReportError()), 6000)
      return () => clearTimeout(t)
    }
  }, [error, dispatch])

  const canView =
    user?.role === 'committee_leader' ||
    user?.role === 'committee_member' ||
    user?.role === 'director'

  const yearOptions = useMemo(() => {
    const current = now.getFullYear()
    return [current + 1, current, current - 1, current - 2]
  }, [now])

  const handlePrint = () => {
    window.print()
  }

  const handleExportPaidCSV = () => {
    if (!payments.length) return
    const rows: string[][] = [
      [
        'Code',
        'Name',
        'Haleqa',
        'For Months',
        'Total Amount',
        'Method',
        'Date',
        'Received By',
      ],
    ]
    for (const g of payments) {
      rows.push([
        g.student.code,
        g.student.fullName,
        g.student.haleqa,
        g.forMonths.map((m) => m.label).join(' | '),
        String(g.totalAmount),
        g.method ?? '',
        formatDate(g.dayKey),
        g.receivedBy?.fullName ?? g.receivedBy?.name ?? '',
      ])
    }
    downloadCSV(
      rows,
      `report-${period?.year ?? year}-${String(period?.month ?? month).padStart(
        2,
        '0'
      )}.csv`
    )
  }

  const handleExportUnpaidCSV = () => {
    if (!unpaidList.length) return
    const rows: string[][] = [
      [
        'Code',
        'Name',
        'Haleqa',
        'Section',
        'Fee Month',
        'Due',
        'Paid',
        'Balance',
        'Status',
      ],
    ]
    for (const u of unpaidList) {
      rows.push([
        u.student.code,
        u.student.fullName,
        u.student.haleqa,
        u.student.section,
        unpaidPeriod?.label ?? `${MONTH_FULL[month - 1]} ${year}`,
        String(u.amountDue),
        String(u.amountPaid),
        String(u.balance),
        u.status,
      ])
    }
    downloadCSV(
      rows,
      `unpaid-${unpaidPeriod?.year ?? year}-${String(
        unpaidPeriod?.month ?? month
      ).padStart(2, '0')}.csv`
    )
  }

  const downloadCSV = (rows: string[][], filename: string) => {
    const csv = rows
      .map((r) =>
        r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!canView) {
    return (
      <div className='text-center py-12'>
        <p className='text-red-600'>Access denied</p>
      </div>
    )
  }

  const unpaidCount = unpaidSummary?.studentsOwing ?? 0

  return (
    <div>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Reports</h1>
          <p className='text-gray-600 mt-1'>
            Income and unpaid students by month
          </p>
        </div>
        <div className='flex gap-2 flex-shrink-0'>
          <button
            onClick={handlePrint}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50'
          >
            Print
          </button>
          {tab === 'paid' ? (
            <button
              onClick={handleExportPaidCSV}
              disabled={!payments.length}
              className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50'
            >
              Export CSV
            </button>
          ) : (
            <button
              onClick={handleExportUnpaidCSV}
              disabled={!unpaidList.length}
              className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50'
            >
              Export CSV
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600'>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className='flex border-b border-gray-200 mb-6'>
        <button
          onClick={() => setTab('paid')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === 'paid'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Paid
        </button>
        <button
          onClick={() => setTab('unpaid')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-2 ${
            tab === 'unpaid'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Not Paid
          {unpaidCount > 0 && tab === 'unpaid' && (
            <span className='px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800'>
              {unpaidCount}
            </span>
          )}
        </button>
      </div>

      {/* ---------- PAID TAB ---------- */}
      {tab === 'paid' && (
        <>
          {summary && (
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
              <div className='bg-white p-5 rounded-lg shadow'>
                <p className='text-xs text-gray-600'>Today</p>
                <p className='text-2xl font-bold text-green-700 mt-1'>
                  {formatMoney(summary.today.amount)}
                </p>
                <p className='text-xs text-gray-500 mt-1'>
                  {summary.today.count} payments
                </p>
              </div>
              <div className='bg-white p-5 rounded-lg shadow'>
                <p className='text-xs text-gray-600'>
                  This month ({MONTH_FULL[now.getMonth()]} {now.getFullYear()})
                </p>
                <p className='text-2xl font-bold text-green-700 mt-1'>
                  {formatMoney(summary.thisMonth.amount)}
                </p>
                <p className='text-xs text-gray-500 mt-1'>
                  {summary.thisMonth.count} payments
                </p>
              </div>
              <div className='bg-white p-5 rounded-lg shadow'>
                <p className='text-xs text-gray-600'>
                  This year ({now.getFullYear()})
                </p>
                <p className='text-2xl font-bold text-green-700 mt-1'>
                  {formatMoney(summary.thisYear.amount)}
                </p>
                <p className='text-xs text-gray-500 mt-1'>
                  {summary.thisYear.count} payments
                </p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className='bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3'>
            <div>
              <label className='block text-xs font-medium text-gray-600 mb-1'>
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
              >
                {MONTH_FULL.map((l, i) => (
                  <option key={l} value={i + 1}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-600 mb-1'>
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-600 mb-1'>
                Day (optional)
              </label>
              <input
                type='date'
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
              />
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-600 mb-1'>
                Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
              >
                <option value=''>All</option>
                <option value='cash'>Cash</option>
                <option value='bank'>Bank</option>
                <option value='mobile_money'>Mobile Money</option>
                <option value='other'>Other</option>
              </select>
            </div>
            <div className='flex items-end'>
              <button
                onClick={() => {
                  setDay('')
                  setMethod('')
                  setReceivedBy('')
                }}
                className='text-sm text-gray-600 hover:text-gray-900'
              >
                Clear extra filters
              </button>
            </div>
          </div>

          {/* Period summary */}
          {period && (
            <div className='bg-white rounded-lg shadow p-5 mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                {period.label} Income
              </h2>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3'>
                <div>
                  <p className='text-xs text-gray-600'>Total collected</p>
                  <p className='text-xl font-bold text-green-700'>
                    {formatMoney(period.collected)}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-600'>Payments</p>
                  <p className='text-xl font-bold text-gray-900'>
                    {period.count}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-600'>Unique students</p>
                  <p className='text-xl font-bold text-gray-900'>
                    {period.uniqueStudents}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Day-by-day */}
          <div className='bg-white rounded-lg shadow mb-6 overflow-hidden'>
            <div className='px-5 py-3 bg-gray-50 border-b'>
              <h3 className='text-sm font-semibold text-gray-700'>
                Day-by-day ({period?.label})
              </h3>
            </div>
            {isLoading ? (
              <div className='flex justify-center py-8'>
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600'></div>
              </div>
            ) : byDay.length === 0 ? (
              <div className='text-center py-8 text-sm text-gray-500'>
                No payments this month.
              </div>
            ) : (
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-white'>
                  <tr>
                    <th className='px-5 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                      Day
                    </th>
                    <th className='px-5 py-2 text-right text-xs font-medium text-gray-500 uppercase'>
                      Amount
                    </th>
                    <th className='px-5 py-2 text-right text-xs font-medium text-gray-500 uppercase'>
                      Payments
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {byDay.map((d) => (
                    <tr
                      key={d.day}
                      className='hover:bg-gray-50 cursor-pointer'
                      onClick={() => setDay(d.day)}
                    >
                      <td className='px-5 py-2 text-sm text-gray-900'>
                        {formatDate(d.day)}
                      </td>
                      <td className='px-5 py-2 text-sm text-right text-gray-900'>
                        {formatMoney(d.amount)}
                      </td>
                      <td className='px-5 py-2 text-sm text-right text-gray-700'>
                        {d.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Payments grouped */}
          <div className='bg-white rounded-lg shadow overflow-hidden'>
            <div className='px-5 py-3 bg-gray-50 border-b flex items-center justify-between'>
              <h3 className='text-sm font-semibold text-gray-700'>
                Payments {day ? `on ${formatDate(day)}` : `in ${period?.label}`}
              </h3>
              {day && (
                <button
                  onClick={() => setDay('')}
                  className='text-xs text-indigo-600 hover:text-indigo-800'
                >
                  Show all days
                </button>
              )}
            </div>
            {isLoading ? (
              <div className='flex justify-center py-8'>
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600'></div>
              </div>
            ) : payments.length === 0 ? (
              <div className='text-center py-8 text-sm text-gray-500'>
                No payments to show.
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-white'>
                    <tr>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                        Date
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                        Code
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                        Student
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                        For Months
                      </th>
                      <th className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase'>
                        Total
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                        Method
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                        Received By
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100'>
                    {payments.map((g, idx) => (
                      <tr key={idx} className='hover:bg-gray-50'>
                        <td className='px-4 py-2 text-sm text-gray-900 whitespace-nowrap'>
                          {formatDate(g.dayKey)}
                        </td>
                        <td className='px-4 py-2 text-sm font-mono text-gray-700 whitespace-nowrap'>
                          {g.student.code}
                        </td>
                        <td className='px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap'>
                          {g.student.fullName}
                        </td>
                        <td className='px-4 py-2 text-sm text-gray-700'>
                          {g.forMonths.map((m) => m.label).join(', ')}
                        </td>
                        <td className='px-4 py-2 text-sm text-right font-medium text-gray-900'>
                          {formatMoney(g.totalAmount)}
                        </td>
                        <td className='px-4 py-2 text-sm text-gray-700 whitespace-nowrap'>
                          {g.method ?? '—'}
                        </td>
                        <td className='px-4 py-2 text-sm text-gray-700 whitespace-nowrap'>
                          {g.receivedBy?.fullName ?? g.receivedBy?.name ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ---------- NOT PAID TAB ---------- */}
      {tab === 'unpaid' && (
        <>
          {/* Shared month/year selectors for unpaid tab */}
          <div className='bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3'>
            <div>
              <label className='block text-xs font-medium text-gray-600 mb-1'>
                Fee Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
              >
                {MONTH_FULL.map((l, i) => (
                  <option key={l} value={i + 1}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-600 mb-1'>
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary */}
          {unpaidSummary && (
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6'>
              <div className='bg-white p-5 rounded-lg shadow'>
                <p className='text-xs text-gray-600'>Outstanding</p>
                <p className='text-xl font-bold text-red-700 mt-1'>
                  {formatMoney(unpaidSummary.outstanding)}
                </p>
              </div>
              <div className='bg-white p-5 rounded-lg shadow'>
                <p className='text-xs text-gray-600'>Students owing</p>
                <p className='text-xl font-bold text-gray-900 mt-1'>
                  {unpaidSummary.studentsOwing}
                </p>
              </div>
              <div className='bg-white p-5 rounded-lg shadow'>
                <p className='text-xs text-gray-600'>Fully unpaid</p>
                <p className='text-xl font-bold text-red-700 mt-1'>
                  {unpaidSummary.fullyUnpaid}
                </p>
              </div>
              <div className='bg-white p-5 rounded-lg shadow'>
                <p className='text-xs text-gray-600'>Partial</p>
                <p className='text-xl font-bold text-amber-700 mt-1'>
                  {unpaidSummary.partial}
                </p>
              </div>
            </div>
          )}

          {/* Unpaid table */}
          <div className='bg-white rounded-lg shadow overflow-hidden'>
            <div className='px-5 py-3 bg-gray-50 border-b'>
              <h3 className='text-sm font-semibold text-gray-700'>
                Unpaid students —{' '}
                {unpaidPeriod?.label ?? `${MONTH_FULL[month - 1]} ${year}`}
              </h3>
            </div>
            {unpaidLoading ? (
              <div className='flex justify-center py-8'>
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600'></div>
              </div>
            ) : unpaidList.length === 0 ? (
              <div className='text-center py-8 text-sm text-gray-500'>
                Everyone has paid for this month 🎉
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-white'>
                    <tr>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                        Code
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                        Student
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                        Haleqa
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                        Section
                      </th>
                      <th className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase'>
                        Due
                      </th>
                      <th className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase'>
                        Paid
                      </th>
                      <th className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase'>
                        Balance
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100'>
                    {unpaidList.map((u) => (
                      <tr key={u._id} className='hover:bg-gray-50'>
                        <td className='px-4 py-2 text-sm font-mono text-gray-700 whitespace-nowrap'>
                          {u.student.code}
                        </td>
                        <td className='px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap'>
                          {u.student.fullName}
                        </td>
                        <td className='px-4 py-2 text-sm text-gray-700 whitespace-nowrap'>
                          {u.student.haleqa}
                        </td>
                        <td className='px-4 py-2 text-sm text-gray-700 whitespace-nowrap'>
                          {u.student.section}
                        </td>
                        <td className='px-4 py-2 text-sm text-right text-gray-900'>
                          {formatMoney(u.amountDue)}
                        </td>
                        <td className='px-4 py-2 text-sm text-right text-gray-900'>
                          {formatMoney(u.amountPaid)}
                        </td>
                        <td className='px-4 py-2 text-sm text-right font-medium text-red-700'>
                          {formatMoney(u.balance)}
                        </td>
                        {/* <td className='px-4 py-2'>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              u.status === 'partial'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {u.status === 'partial' ? 'Partial' : 'Pending'}
                          </span>
                        </td> */}
                        <td className='px-4 py-2'>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              u.status === 'partial'
                                ? 'bg-amber-100 text-amber-800'
                                : u.status === 'no-record'
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {u.status === 'partial'
                              ? 'Partial'
                              : u.status === 'no-record'
                              ? 'No record'
                              : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
