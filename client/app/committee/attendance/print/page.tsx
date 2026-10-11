// 'use client'

// import { useEffect, useMemo, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useRouter } from 'next/navigation'
// import { AppDispatch, RootState } from '../../../store/store'
// import api from '../../../lib/api'

// interface Student {
//   _id: string
//   code: string
//   fullName: string
//   haleqa: string
//   section: string
// }

// const ROWS_PER_PAGE = 35
// const DAYS_PER_MONTH = 30

// export default function AttendancePrintPage() {
//   const dispatch = useDispatch<AppDispatch>()
//   const router = useRouter()
//   const { user } = useSelector((s: RootState) => s.auth)

//   const [haleqa, setHaleqa] = useState('')
//   const [section, setSection] = useState<'A' | 'B' | 'C' | 'D' | ''>('')
//   const [students, setStudents] = useState<Student[]>([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   // Only Committee Leader
//   useEffect(() => {
//     if (user && user.role !== 'committee_leader') {
//       router.replace('/unauthorized')
//     }
//   }, [user, router])

//   // Fetch students when both haleqa and section are set
//   useEffect(() => {
//     if (!haleqa || !section) {
//       setStudents([])
//       return
//     }
//     let cancelled = false
//     setLoading(true)
//     setError(null)
//     api
//       .get<{ success: boolean; data: Student[] }>('/students', {
//         params: { haleqa, section },
//       })
//       .then((res) => {
//         if (cancelled) return
//         setStudents(res.data.data ?? [])
//       })
//       .catch(() => {
//         if (cancelled) return
//         setError('Failed to load students')
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false)
//       })
//     return () => {
//       cancelled = true
//     }
//   }, [haleqa, section])

//   // Split students into pages of 35
//   const pages = useMemo(() => {
//     const result: Student[][] = []
//     for (let i = 0; i < students.length; i += ROWS_PER_PAGE) {
//       result.push(students.slice(i, i + ROWS_PER_PAGE))
//     }
//     return result.length > 0 ? result : [[]]
//   }, [students])

//   if (!user || user.role !== 'committee_leader') {
//     return null
//   }

//   const handlePrint = () => {
//     window.print()
//   }

//   return (
//     <div>
//       {/* On-screen controls — hidden in print */}
//       <div className='no-print'>
//         <div className='mb-6'>
//           <h1 className='text-2xl font-bold text-gray-900'>
//             Attendance Sheet Print
//           </h1>
//           <p className='text-gray-600 mt-1'>
//             Choose a haleqa and section, then print the blank attendance sheet
//           </p>
//         </div>

//         <div className='bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap items-end gap-3'>
//           <div>
//             <label className='block text-sm font-medium text-gray-700 mb-1'>
//               Haleqa
//             </label>
//             <input
//               type='text'
//               value={haleqa}
//               onChange={(e) => setHaleqa(e.target.value)}
//               placeholder='e.g. Haleqa A'
//               className='px-3 py-2 border border-gray-300 rounded-md'
//             />
//           </div>
//           <div>
//             <label className='block text-sm font-medium text-gray-700 mb-1'>
//               Section
//             </label>
//             <select
//               value={section}
//               onChange={(e) =>
//                 setSection(e.target.value as 'A' | 'B' | 'C' | 'D' | '')
//               }
//               className='px-3 py-2 border border-gray-300 rounded-md'
//             >
//               <option value=''>— Select —</option>
//               <option value='A'>A</option>
//               <option value='B'>B</option>
//               <option value='C'>C</option>
//               <option value='D'>D</option>
//             </select>
//           </div>
//           <button
//             onClick={handlePrint}
//             disabled={!haleqa || !section || students.length === 0}
//             className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50'
//           >
//             Print
//           </button>
//         </div>

//         {error && (
//           <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600'>
//             {error}
//           </div>
//         )}

//         {loading && (
//           <div className='flex justify-center py-8'>
//             <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
//           </div>
//         )}

//         {!loading && haleqa && section && students.length === 0 && (
//           <div className='bg-white rounded-lg shadow p-8 text-center text-gray-500'>
//             No students found for this Haleqa and Section.
//           </div>
//         )}
//       </div>

//       {/* The actual sheets */}
//       {haleqa && section && students.length > 0 && (
//         <div className='sheets'>
//           {pages.map((pageStudents, pageIdx) => (
//             <div key={pageIdx} className='sheet-page'>
//               {/* Header */}
//               <div className='sheet-header'>
//                 <div className='sheet-title'>HASSEN MESJID MEDIRESA</div>
//                 <div className='sheet-meta'>
//                   <span>
//                     Haleqa:&nbsp;
//                     <span className='sheet-line'>{haleqa}</span>
//                   </span>
//                   <span>
//                     Date:&nbsp;
//                     <span className='sheet-line' style={{ width: 180 }} />
//                   </span>
//                 </div>
//               </div>

//               {/* Table */}
//               <table className='sheet-table'>
//                 <thead>
//                   <tr>
//                     <th className='col-num'>#</th>
//                     <th className='col-code'>Code</th>
//                     <th className='col-name'>Full Name</th>
//                     {Array.from({ length: DAYS_PER_MONTH }).map((_, i) => (
//                       <th key={i} className='col-day'>
//                         {i + 1}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {pageStudents.map((s, i) => (
//                     <tr key={s._id}>
//                       <td className='col-num'>
//                         {pageIdx * ROWS_PER_PAGE + i + 1}
//                       </td>
//                       <td className='col-code'>{s.code}</td>
//                       <td className='col-name'>{s.fullName}</td>
//                       {Array.from({ length: DAYS_PER_MONTH }).map((_, j) => (
//                         <td key={j} className='col-day' />
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {/* Footer */}
//               <div className='sheet-footer'>
//                 Page {pageIdx + 1} of {pages.length}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Print styles */}
//       <style jsx global>{`
//         @media print {
//           .no-print {
//             display: none !important;
//           }
//           body {
//             background: white !important;
//           }
//           aside,
//           nav,
//           header,
//           main > *:not(.sheets) {
//             display: none !important;
//           }
//           .sheets {
//             display: block !important;
//           }
//           .sheet-page {
//             page-break-after: always;
//             break-after: page;
//           }
//           .sheet-page:last-child {
//             page-break-after: auto;
//             break-after: auto;
//           }
//           @page {
//             size: A4 portrait;
//             margin: 10mm;
//           }
//         }

//         .sheet-page {
//           width: 100%;
//           background: white;
//           padding: 12px;
//           margin-bottom: 24px;
//         }

//         .sheet-header {
//           margin-bottom: 10px;
//         }

//         .sheet-title {
//           text-align: center;
//           font-weight: 700;
//           font-size: 16px;
//           letter-spacing: 1px;
//           margin-bottom: 12px;
//           text-transform: uppercase;
//         }

//         .sheet-meta {
//           display: flex;
//           justify-content: space-between;
//           font-size: 13px;
//           margin-bottom: 8px;
//         }

//         .sheet-line {
//           display: inline-block;
//           min-width: 120px;
//           border-bottom: 1px solid #111;
//           padding: 0 4px;
//           vertical-align: bottom;
//         }

//         .sheet-table {
//           width: 100%;
//           border-collapse: collapse;
//           table-layout: fixed;
//           font-size: 11px;
//         }

//         .sheet-table th,
//         .sheet-table td {
//           border: 1px solid #444;
//           padding: 3px 4px;
//           text-align: left;
//           height: 22px;
//         }

//         .sheet-table th {
//           background: #f3f4f6;
//           font-weight: 600;
//           text-align: center;
//         }

//         .col-num {
//           width: 26px;
//           text-align: center;
//         }
//         .col-code {
//           width: 90px;
//         }
//         .col-name {
//           width: 220px;
//         }
//         .col-day {
//           width: 18px;
//           text-align: center;
//           padding: 0 !important;
//         }

//         .sheet-footer {
//           text-align: right;
//           font-size: 10px;
//           color: #555;
//           margin-top: 6px;
//         }
//       `}</style>
//     </div>
//   )
// }

'use client'

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { AppDispatch, RootState } from '../../../store/store'
import api from '../../../lib/api'

interface Student {
  _id: string
  code: string
  fullName: string
  haleqa: string
  section: string
}

const ROWS_PER_PAGE = 35
const DAYS_PER_MONTH = 30

export default function AttendancePrintPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { user } = useSelector((s: RootState) => s.auth)

  const [haleqa, setHaleqa] = useState('')
  const [section, setSection] = useState<'A' | 'B' | 'C' | 'D' | ''>('')
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (user && user.role !== 'committee_leader') {
      router.replace('/unauthorized')
    }
  }, [user, router])

  useEffect(() => {
    if (!haleqa || !section) {
      setStudents([])
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    api
      .get<{ success: boolean; data: Student[] }>('/students', {
        params: { haleqa, section },
      })
      .then((res) => {
        if (cancelled) return
        setStudents(res.data.data ?? [])
      })
      .catch(() => {
        if (cancelled) return
        setError('Failed to load students')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [haleqa, section])

  const pages = useMemo(() => {
    const result: Student[][] = []
    for (let i = 0; i < students.length; i += ROWS_PER_PAGE) {
      result.push(students.slice(i, i + ROWS_PER_PAGE))
    }
    return result.length > 0 ? result : [[]]
  }, [students])

  if (!user || user.role !== 'committee_leader') {
    return null
  }

  const handlePrint = () => {
    window.print()
  }

  const showSheets = haleqa && section && students.length > 0

  const sheetContent = showSheets ? (
    <div className='sheets'>
      {pages.map((pageStudents, pageIdx) => (
        <div key={pageIdx} className='sheet-page'>
          <div className='sheet-header'>
            <div className='sheet-title'>HASSEN MESJID MEDIRESA</div>
            <div className='sheet-meta'>
              <span>
                Haleqa:&nbsp;
                <span className='sheet-line'>{haleqa}</span>
              </span>
              <span>
                Section:&nbsp;
                <span className='sheet-line' style={{ minWidth: 60 }}>
                  {section}
                </span>
              </span>
              <span>
                Date:&nbsp;
                <span className='sheet-line' style={{ minWidth: 160 }} />
              </span>
            </div>
          </div>

          <table className='sheet-table'>
            <thead>
              <tr>
                <th className='col-num'>#</th>
                <th className='col-code'>Code</th>
                <th className='col-name'>Full Name</th>
                {Array.from({ length: DAYS_PER_MONTH }).map((_, i) => (
                  <th key={i} className='col-day'>
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageStudents.map((s, i) => (
                <tr key={s._id}>
                  <td className='col-num'>{pageIdx * ROWS_PER_PAGE + i + 1}</td>
                  <td className='col-code'>{s.code}</td>
                  <td className='col-name'>{s.fullName}</td>
                  {Array.from({ length: DAYS_PER_MONTH }).map((_, j) => (
                    <td key={j} className='col-day' />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className='sheet-footer'>
            Page {pageIdx + 1} of {pages.length}
          </div>
        </div>
      ))}
    </div>
  ) : null

  return (
    <div>
      {/* On-screen controls — hidden in print */}
      <div className='no-print'>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-gray-900'>
            Attendance Sheet Print
          </h1>
          <p className='text-gray-600 mt-1'>
            Choose a haleqa and section, then print the blank attendance sheet
          </p>
        </div>

        <div className='bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap items-end gap-3'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Haleqa
            </label>
            <input
              type='text'
              value={haleqa}
              onChange={(e) => setHaleqa(e.target.value)}
              placeholder='e.g. Haleqa A'
              className='px-3 py-2 border border-gray-300 rounded-md'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Section
            </label>
            <select
              value={section}
              onChange={(e) =>
                setSection(e.target.value as 'A' | 'B' | 'C' | 'D' | '')
              }
              className='px-3 py-2 border border-gray-300 rounded-md'
            >
              <option value=''>— Select —</option>
              <option value='A'>A</option>
              <option value='B'>B</option>
              <option value='C'>C</option>
              <option value='D'>D</option>
            </select>
          </div>
          <button
            onClick={handlePrint}
            disabled={!haleqa || !section || students.length === 0}
            className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50'
          >
            Print
          </button>
        </div>

        {error && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600'>
            {error}
          </div>
        )}

        {loading && (
          <div className='flex justify-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
          </div>
        )}

        {!loading && haleqa && section && students.length === 0 && (
          <div className='bg-white rounded-lg shadow p-8 text-center text-gray-500'>
            No students found for this Haleqa and Section.
          </div>
        )}

        {/* On-screen preview (screen only) */}
        {sheetContent && <div className='screen-preview'>{sheetContent}</div>}
      </div>

      {/* Print-only portal into a dedicated node at document.body */}
      {mounted && sheetContent
        ? createPortal(<div id='print-root'>{sheetContent}</div>, document.body)
        : null}

      {/* Print styles */}
      <style jsx global>{`
        /* Hidden by default; only shown in print */
        #print-root {
          display: none;
        }

        /* Screen preview look */
        .screen-preview {
          background: white;
          border-radius: 8px;
        }

        .sheet-page {
          width: 100%;
          background: white;
          padding: 12px;
          margin-bottom: 24px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .sheet-header {
          margin-bottom: 10px;
        }

        .sheet-title {
          text-align: center;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 1px;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .sheet-meta {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 8px;
          gap: 12px;
        }

        .sheet-line {
          display: inline-block;
          min-width: 120px;
          border-bottom: 1px solid #111;
          padding: 0 4px;
          vertical-align: bottom;
        }

        .sheet-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          font-size: 11px;
        }

        .sheet-table th,
        .sheet-table td {
          border: 1px solid #444;
          padding: 2px 3px;
          text-align: left;
          height: 20px;
        }

        .sheet-table th {
          background: #f3f4f6;
          font-weight: 600;
          text-align: center;
        }

        .col-num {
          width: 26px;
          text-align: center;
        }
        .col-code {
          width: 80px;
        }
        .col-name {
          width: 180px;
        }
        .col-day {
          width: 16px;
          text-align: center;
          padding: 0 !important;
        }

        .sheet-footer {
          text-align: right;
          font-size: 10px;
          color: #555;
          margin-top: 6px;
        }

        @media print {
          html,
          body {
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Hide the entire app UI */
          body > *:not(#print-root) {
            display: none !important;
          }

          /* Show only the print portal */
          #print-root {
            display: block !important;
          }

          #print-root .sheet-page {
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            page-break-after: always;
            break-after: page;
          }

          #print-root .sheet-page:last-child {
            page-break-after: auto;
            break-after: auto;
          }

          @page {
            size: A4 landscape;
            margin: 8mm;
          }

          #print-root .sheet-title {
            font-size: 15px;
          }

          #print-root .sheet-table {
            font-size: 10px;
          }

          #print-root .sheet-table th,
          #print-root .sheet-table td {
            height: 18px;
            padding: 1px 2px;
          }

          #print-root .col-day {
            width: 14px;
          }
        }
      `}</style>
    </div>
  )
}
