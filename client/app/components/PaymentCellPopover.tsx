// // 'use client'

// // import { useEffect, useRef, useState } from 'react'
// // import type { GridStudent, GridPayment } from '../store/slices/paymentSlice'

// // interface Props {
// //   student: GridStudent
// //   year: number
// //   month: number
// //   payment?: GridPayment
// //   canWrite: boolean
// //   onMarkPaid: (id: string) => void
// //   onUndo: (id: string) => void
// //   onEdit: (id: string) => void
// // }

// // const MONTH_SHORT = [
// //   'Jan',
// //   'Feb',
// //   'Mar',
// //   'Apr',
// //   'May',
// //   'Jun',
// //   'Jul',
// //   'Aug',
// //   'Sep',
// //   'Oct',
// //   'Nov',
// //   'Dec',
// // ]

// // export default function PaymentCellPopover({
// //   student,
// //   year,
// //   month,
// //   payment,
// //   canWrite,
// //   onMarkPaid,
// //   onUndo,
// //   onEdit,
// // }: Props) {
// //   const [open, setOpen] = useState(false)
// //   const containerRef = useRef<HTMLDivElement>(null)

// //   useEffect(() => {
// //     if (!open) return
// //     const onDocClick = (e: MouseEvent) => {
// //       if (!containerRef.current) return
// //       if (!containerRef.current.contains(e.target as Node)) setOpen(false)
// //     }
// //     const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
// //     document.addEventListener('mousedown', onDocClick)
// //     document.addEventListener('keydown', onEsc)
// //     return () => {
// //       document.removeEventListener('mousedown', onDocClick)
// //       document.removeEventListener('keydown', onEsc)
// //     }
// //   }, [open])

// //   const label = `${MONTH_SHORT[month - 1]} ${year}`

// //   const renderPill = () => {
// //     if (!payment) {
// //       return (
// //         <button
// //           onClick={() => canWrite && setOpen((v) => !v)}
// //           disabled={!canWrite}
// //           className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 disabled:cursor-not-allowed'
// //         >
// //           —
// //         </button>
// //       )
// //     }

// //     const unassigned = !payment.paymentType || payment.amountDue === 0

// //     if (unassigned) {
// //       return (
// //         <button
// //           onClick={() => canWrite && setOpen((v) => !v)}
// //           disabled={!canWrite}
// //           className='px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 whitespace-nowrap'
// //         >
// //           set type
// //         </button>
// //       )
// //     }

// //     if (payment.status === 'paid') {
// //       return (
// //         <button
// //           onClick={() => canWrite && setOpen((v) => !v)}
// //           className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 hover:bg-green-200 whitespace-nowrap'
// //         >
// //           {payment.amountDue} ✓
// //         </button>
// //       )
// //     }

// //     if (payment.status === 'partial') {
// //       return (
// //         <button
// //           onClick={() => canWrite && setOpen((v) => !v)}
// //           className='px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 whitespace-nowrap'
// //         >
// //           {payment.amountPaid}/{payment.amountDue}
// //         </button>
// //       )
// //     }

// //     return (
// //       <button
// //         onClick={() => canWrite && setOpen((v) => !v)}
// //         className='px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 hover:bg-red-200 whitespace-nowrap'
// //       >
// //         {payment.amountDue} !
// //       </button>
// //     )
// //   }

// //   return (
// //     <div className='relative inline-block' ref={containerRef}>
// //       {renderPill()}

// //       {open && (
// //         <div className='absolute z-30 right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-left'>
// //           <p className='text-xs font-semibold text-gray-900'>
// //             {student.fullName}
// //           </p>
// //           <p className='text-xs text-gray-500 mb-2'>{label}</p>

// //           {!payment && (
// //             <p className='text-xs text-gray-500'>No record for this month.</p>
// //           )}

// //           {payment && !payment.paymentType && (
// //             <>
// //               <p className='text-xs text-amber-700 mb-2'>
// //                 No payment type assigned yet.
// //               </p>
// //               {canWrite && (
// //                 <button
// //                   onClick={() => {
// //                     setOpen(false)
// //                     onEdit(payment._id)
// //                   }}
// //                   className='w-full px-3 py-1.5 text-xs bg-amber-600 text-white rounded-md hover:bg-amber-700'
// //                 >
// //                   Set Type &amp; Pay
// //                 </button>
// //               )}
// //             </>
// //           )}

// //           {payment && payment.paymentType && (
// //             <>
// //               <div className='text-xs text-gray-700 mb-2 space-y-0.5'>
// //                 <p>
// //                   Due:{' '}
// //                   <span className='font-medium'>{payment.amountDue} ETB</span>
// //                 </p>
// //                 <p>
// //                   Paid:{' '}
// //                   <span className='font-medium'>{payment.amountPaid} ETB</span>
// //                 </p>
// //                 {payment.paidDate && (
// //                   <p className='text-gray-500'>
// //                     {new Date(payment.paidDate).toLocaleDateString()}
// //                   </p>
// //                 )}
// //                 {payment.method && (
// //                   <p className='text-gray-500'>via {payment.method}</p>
// //                 )}
// //               </div>

// //               {canWrite && (
// //                 <div className='space-y-1.5'>
// //                   {payment.status !== 'paid' && (
// //                     <button
// //                       onClick={() => {
// //                         setOpen(false)
// //                         onMarkPaid(payment._id)
// //                       }}
// //                       className='w-full px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700'
// //                     >
// //                       ✓ Mark Paid
// //                     </button>
// //                   )}
// //                   {payment.status === 'paid' && (
// //                     <button
// //                       onClick={() => {
// //                         setOpen(false)
// //                         onUndo(payment._id)
// //                       }}
// //                       className='w-full px-3 py-1.5 text-xs bg-yellow-600 text-white rounded-md hover:bg-yellow-700'
// //                     >
// //                       ↺ Undo Payment
// //                     </button>
// //                   )}
// //                   <button
// //                     onClick={() => {
// //                       setOpen(false)
// //                       onEdit(payment._id)
// //                     }}
// //                     className='w-full px-3 py-1.5 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200'
// //                   >
// //                     ✎ Edit
// //                   </button>
// //                 </div>
// //               )}
// //             </>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // 'use client'

// // import { useEffect, useRef, useState } from 'react'
// // import type { GridStudent, GridPayment } from '../store/slices/paymentSlice'

// // interface Props {
// //   student: GridStudent
// //   year: number
// //   month: number
// //   payment?: GridPayment
// //   canWrite: boolean
// //   onMarkPaid: (id: string) => void
// //   onUndo: (id: string) => void
// //   onEdit: (id: string) => void
// //   onCreatePending: (student: GridStudent, year: number, month: number) => void
// //   onCreateAndPay: (student: GridStudent, year: number, month: number) => void
// // }

// // const MONTH_SHORT = [
// //   'Jan',
// //   'Feb',
// //   'Mar',
// //   'Apr',
// //   'May',
// //   'Jun',
// //   'Jul',
// //   'Aug',
// //   'Sep',
// //   'Oct',
// //   'Nov',
// //   'Dec',
// // ]

// // export default function PaymentCellPopover({
// //   student,
// //   year,
// //   month,
// //   payment,
// //   canWrite,
// //   onMarkPaid,
// //   onUndo,
// //   onEdit,
// //   onCreatePending,
// //   onCreateAndPay,
// // }: Props) {
// //   const [open, setOpen] = useState(false)
// //   const containerRef = useRef<HTMLDivElement>(null)

// //   useEffect(() => {
// //     if (!open) return
// //     const onDocClick = (e: MouseEvent) => {
// //       if (!containerRef.current) return
// //       if (!containerRef.current.contains(e.target as Node)) setOpen(false)
// //     }
// //     const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
// //     document.addEventListener('mousedown', onDocClick)
// //     document.addEventListener('keydown', onEsc)
// //     return () => {
// //       document.removeEventListener('mousedown', onDocClick)
// //       document.removeEventListener('keydown', onEsc)
// //     }
// //   }, [open])

// //   const label = `${MONTH_SHORT[month - 1]} ${year}`

// //   const renderPill = () => {
// //     // Empty cell
// //     if (!payment) {
// //       return (
// //         <button
// //           onClick={() => canWrite && setOpen((v) => !v)}
// //           disabled={!canWrite}
// //           className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 disabled:cursor-not-allowed'
// //         >
// //           +
// //         </button>
// //       )
// //     }

// //     const unassigned = !payment.paymentType || payment.amountDue === 0

// //     if (unassigned) {
// //       return (
// //         <button
// //           onClick={() => canWrite && setOpen((v) => !v)}
// //           disabled={!canWrite}
// //           className='px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 whitespace-nowrap'
// //         >
// //           set
// //         </button>
// //       )
// //     }

// //     if (payment.status === 'paid') {
// //       return (
// //         <button
// //           onClick={() => canWrite && setOpen((v) => !v)}
// //           className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 hover:bg-green-200 whitespace-nowrap'
// //         >
// //           {payment.amountDue} ✓
// //         </button>
// //       )
// //     }

// //     if (payment.status === 'partial') {
// //       return (
// //         <button
// //           onClick={() => canWrite && setOpen((v) => !v)}
// //           className='px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 whitespace-nowrap'
// //         >
// //           {payment.amountPaid}/{payment.amountDue}
// //         </button>
// //       )
// //     }

// //     return (
// //       <button
// //         onClick={() => canWrite && setOpen((v) => !v)}
// //         className='px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 hover:bg-red-200 whitespace-nowrap'
// //       >
// //         {payment.amountDue} !
// //       </button>
// //     )
// //   }

// //   return (
// //     <div className='relative inline-block' ref={containerRef}>
// //       {renderPill()}

// //       {open && (
// //         <div className='absolute z-30 right-0 mt-1 w-60 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-left'>
// //           <p className='text-xs font-semibold text-gray-900'>
// //             {student.fullName}
// //           </p>
// //           <p className='text-xs text-gray-500 mb-2'>{label}</p>

// //           {/* Empty cell → create options */}
// //           {!payment && canWrite && (
// //             <div className='space-y-1.5'>
// //               <button
// //                 onClick={() => {
// //                   setOpen(false)
// //                   onCreatePending(student, year, month)
// //                 }}
// //                 className='w-full px-3 py-1.5 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200'
// //               >
// //                 + Create as Pending
// //               </button>
// //               <button
// //                 onClick={() => {
// //                   setOpen(false)
// //                   onCreateAndPay(student, year, month)
// //                 }}
// //                 className='w-full px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700'
// //               >
// //                 ✓ Create &amp; Mark Paid
// //               </button>
// //             </div>
// //           )}

// //           {/* Unassigned record → set type */}
// //           {payment && !payment.paymentType && (
// //             <>
// //               <p className='text-xs text-amber-700 mb-2'>
// //                 No payment type assigned yet.
// //               </p>
// //               {canWrite && (
// //                 <button
// //                   onClick={() => {
// //                     setOpen(false)
// //                     onEdit(payment._id)
// //                   }}
// //                   className='w-full px-3 py-1.5 text-xs bg-amber-600 text-white rounded-md hover:bg-amber-700'
// //                 >
// //                   Set Type &amp; Pay
// //                 </button>
// //               )}
// //             </>
// //           )}

// //           {/* Normal record */}
// //           {payment && payment.paymentType && (
// //             <>
// //               <div className='text-xs text-gray-700 mb-2 space-y-0.5'>
// //                 <p>
// //                   Due:{' '}
// //                   <span className='font-medium'>{payment.amountDue} ETB</span>
// //                 </p>
// //                 <p>
// //                   Paid:{' '}
// //                   <span className='font-medium'>{payment.amountPaid} ETB</span>
// //                 </p>
// //                 {payment.paidDate && (
// //                   <p className='text-gray-500'>
// //                     {new Date(payment.paidDate).toLocaleDateString()}
// //                   </p>
// //                 )}
// //                 {payment.method && (
// //                   <p className='text-gray-500'>via {payment.method}</p>
// //                 )}
// //               </div>

// //               {canWrite && (
// //                 <div className='space-y-1.5'>
// //                   {payment.status !== 'paid' && (
// //                     <button
// //                       onClick={() => {
// //                         setOpen(false)
// //                         onMarkPaid(payment._id)
// //                       }}
// //                       className='w-full px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700'
// //                     >
// //                       ✓ Mark Paid
// //                     </button>
// //                   )}
// //                   {payment.status === 'paid' && (
// //                     <button
// //                       onClick={() => {
// //                         setOpen(false)
// //                         onUndo(payment._id)
// //                       }}
// //                       className='w-full px-3 py-1.5 text-xs bg-yellow-600 text-white rounded-md hover:bg-yellow-700'
// //                     >
// //                       ↺ Undo Payment
// //                     </button>
// //                   )}
// //                   <button
// //                     onClick={() => {
// //                       setOpen(false)
// //                       onEdit(payment._id)
// //                     }}
// //                     className='w-full px-3 py-1.5 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200'
// //                   >
// //                     ✎ Edit
// //                   </button>
// //                 </div>
// //               )}
// //             </>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// 'use client'

// import { useEffect, useLayoutEffect, useRef, useState } from 'react'
// import { createPortal } from 'react-dom'
// import type { GridStudent, GridPayment } from '../store/slices/paymentSlice'

// interface Props {
//   student: GridStudent
//   year: number
//   month: number
//   payment?: GridPayment
//   canWrite: boolean
//   onMarkPaid: (id: string) => void
//   onUndo: (id: string) => void
//   onEdit: (id: string) => void
//   onCreatePending: (student: GridStudent, year: number, month: number) => void
//   onCreateAndPay: (student: GridStudent, year: number, month: number) => void
// }

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

// interface PopoverPosition {
//   top: number
//   left: number
//   placement: 'up' | 'down'
// }

// export default function PaymentCellPopover(props: Props) {
//   const {
//     student,
//     year,
//     month,
//     payment,
//     canWrite,
//     onMarkPaid,
//     onUndo,
//     onEdit,
//     onCreatePending,
//     onCreateAndPay,
//   } = props

//   const [open, setOpen] = useState(false)
//   const [mounted, setMounted] = useState(false)
//   const [pos, setPos] = useState<PopoverPosition | null>(null)

//   const buttonRef = useRef<HTMLButtonElement>(null)
//   const popoverRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   // Position calculation when opening
//   useLayoutEffect(() => {
//     if (!open) return

//     const measure = () => {
//       const btn = buttonRef.current
//       if (!btn) return

//       const rect = btn.getBoundingClientRect()
//       const popHeight = popoverRef.current?.offsetHeight ?? 220
//       const popWidth = popoverRef.current?.offsetWidth ?? 240
//       const margin = 12

//       const spaceBelow = window.innerHeight - rect.bottom
//       const spaceAbove = rect.top

//       let placement: 'up' | 'down' = 'down'
//       if (spaceBelow < popHeight + margin && spaceAbove > popHeight + margin) {
//         placement = 'up'
//       }

//       const top =
//         placement === 'down'
//           ? rect.bottom + window.scrollY + 4
//           : rect.top + window.scrollY - popHeight - 4

//       // Align to right edge of the button
//       let left = rect.right + window.scrollX - popWidth
//       if (left < 8) left = 8

//       setPos({ top, left, placement })
//     }

//     measure()
//     const t = setTimeout(measure, 0)
//     return () => clearTimeout(t)
//   }, [open])

//   // Close on outside click / Escape / scroll-resize
//   useEffect(() => {
//     if (!open) return
//     const onDocClick = (e: MouseEvent) => {
//       const target = e.target as Node
//       if (buttonRef.current?.contains(target)) return
//       if (popoverRef.current?.contains(target)) return
//       setOpen(false)
//     }
//     const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
//     const onScroll = () => setOpen(false)
//     const onResize = () => setOpen(false)
//     document.addEventListener('mousedown', onDocClick)
//     document.addEventListener('keydown', onEsc)
//     window.addEventListener('scroll', onScroll, true)
//     window.addEventListener('resize', onResize)
//     return () => {
//       document.removeEventListener('mousedown', onDocClick)
//       document.removeEventListener('keydown', onEsc)
//       window.removeEventListener('scroll', onScroll, true)
//       window.removeEventListener('resize', onResize)
//     }
//   }, [open])

//   const label = `${MONTH_SHORT[month - 1]} ${year}`

//   // Pill UI
//   const renderPill = () => {
//     if (!payment) {
//       return (
//         <button
//           ref={buttonRef}
//           onClick={() => canWrite && setOpen((v) => !v)}
//           disabled={!canWrite}
//           className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 disabled:cursor-not-allowed'
//         >
//           +
//         </button>
//       )
//     }
//     const unassigned = !payment.paymentType || payment.amountDue === 0
//     if (unassigned) {
//       return (
//         <button
//           ref={buttonRef}
//           onClick={() => canWrite && setOpen((v) => !v)}
//           disabled={!canWrite}
//           className='px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 whitespace-nowrap'
//         >
//           set
//         </button>
//       )
//     }
//     if (payment.status === 'paid') {
//       return (
//         <button
//           ref={buttonRef}
//           onClick={() => canWrite && setOpen((v) => !v)}
//           className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 hover:bg-green-200 whitespace-nowrap'
//         >
//           {payment.amountDue} ✓
//         </button>
//       )
//     }
//     if (payment.status === 'partial') {
//       return (
//         <button
//           ref={buttonRef}
//           onClick={() => canWrite && setOpen((v) => !v)}
//           className='px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 whitespace-nowrap'
//         >
//           {payment.amountPaid}/{payment.amountDue}
//         </button>
//       )
//     }
//     return (
//       <button
//         ref={buttonRef}
//         onClick={() => canWrite && setOpen((v) => !v)}
//         className='px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 hover:bg-red-200 whitespace-nowrap'
//       >
//         {payment.amountDue} !
//       </button>
//     )
//   }

//   const popoverContent = (
//     <div
//       ref={popoverRef}
//       style={{
//         position: 'absolute',
//         top: pos?.top ?? -9999,
//         left: pos?.left ?? -9999,
//         width: 240,
//         visibility: pos ? 'visible' : 'hidden',
//       }}
//       className='z-[100] bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-left'
//     >
//       <p className='text-xs font-semibold text-gray-900'>{student.fullName}</p>
//       <p className='text-xs text-gray-500 mb-2'>{label}</p>

//       {!payment && canWrite && (
//         <div className='space-y-1.5'>
//           <button
//             onClick={() => {
//               setOpen(false)
//               onCreatePending(student, year, month)
//             }}
//             className='w-full px-3 py-1.5 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200'
//           >
//             + Create as Pending
//           </button>
//           <button
//             onClick={() => {
//               setOpen(false)
//               onCreateAndPay(student, year, month)
//             }}
//             className='w-full px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700'
//           >
//             ✓ Create &amp; Mark Paid
//           </button>
//         </div>
//       )}

//       {payment && !payment.paymentType && canWrite && (
//         <>
//           <p className='text-xs text-amber-700 mb-2'>
//             No payment type assigned yet.
//           </p>
//           <button
//             onClick={() => {
//               setOpen(false)
//               onEdit(payment._id)
//             }}
//             className='w-full px-3 py-1.5 text-xs bg-amber-600 text-white rounded-md hover:bg-amber-700'
//           >
//             Set Type &amp; Pay
//           </button>
//         </>
//       )}

//       {payment && payment.paymentType && (
//         <>
//           <div className='text-xs text-gray-700 mb-2 space-y-0.5'>
//             <p>
//               Due: <span className='font-medium'>{payment.amountDue} ETB</span>
//             </p>
//             <p>
//               Paid:{' '}
//               <span className='font-medium'>{payment.amountPaid} ETB</span>
//             </p>
//             {payment.paidDate && (
//               <p className='text-gray-500'>
//                 {new Date(payment.paidDate).toLocaleDateString()}
//               </p>
//             )}
//             {payment.method && (
//               <p className='text-gray-500'>via {payment.method}</p>
//             )}
//           </div>

//           {canWrite && (
//             <div className='space-y-1.5'>
//               {payment.status !== 'paid' && (
//                 <button
//                   onClick={() => {
//                     setOpen(false)
//                     onMarkPaid(payment._id)
//                   }}
//                   className='w-full px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700'
//                 >
//                   ✓ Mark Paid
//                 </button>
//               )}
//               {payment.status === 'paid' && (
//                 <button
//                   onClick={() => {
//                     setOpen(false)
//                     onUndo(payment._id)
//                   }}
//                   className='w-full px-3 py-1.5 text-xs bg-yellow-600 text-white rounded-md hover:bg-yellow-700'
//                 >
//                   ↺ Undo Payment
//                 </button>
//               )}
//               <button
//                 onClick={() => {
//                   setOpen(false)
//                   onEdit(payment._id)
//                 }}
//                 className='w-full px-3 py-1.5 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200'
//               >
//                 ✎ Edit
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   )

//   return (
//     <div className='inline-block relative'>
//       {renderPill()}
//       {mounted && open && createPortal(popoverContent, document.body)}
//     </div>
//   )
// }
'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import type { GridStudent, GridPayment } from '../store/slices/paymentSlice'

interface Props {
  student: GridStudent
  year: number
  month: number
  payment?: GridPayment
  canWrite: boolean
  simplified?: boolean
  onMarkPaid: (id: string) => void
  onUndo: (id: string) => void
  onEdit: (id: string) => void
  onCreatePending: (student: GridStudent, year: number, month: number) => void
  onCreateAndPay: (student: GridStudent, year: number, month: number) => void
  onMarkMonthPaid: (
    student: GridStudent,
    year: number,
    month: number,
    paymentType: string
  ) => void
}

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

interface PopoverPosition {
  top: number
  left: number
}

export default function PaymentCellPopover(props: Props) {
  const {
    student,
    year,
    month,
    payment,
    canWrite,
    simplified = false,
    onMarkPaid,
    onUndo,
    onEdit,
    onCreatePending,
    onCreateAndPay,
    onMarkMonthPaid,
  } = props

  const { paymentTypes } = useSelector((s: RootState) => s.paymentTypes)
  const activeTypes = paymentTypes.filter((t) => t.isActive)

  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [pos, setPos] = useState<PopoverPosition | null>(null)
  const [selectedType, setSelectedType] = useState<string>('')

  const buttonRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Pre-select a type when the popover opens
  useEffect(() => {
    if (!open) return
    const existing =
      typeof payment?.paymentType === 'object' && payment.paymentType !== null
        ? payment.paymentType._id
        : (payment?.paymentType as string | undefined) ?? ''
    if (existing) {
      setSelectedType(existing)
    } else if (activeTypes[0]) {
      setSelectedType(activeTypes[0]._id)
    } else {
      setSelectedType('')
    }
  }, [open, payment, activeTypes])

  useLayoutEffect(() => {
    if (!open) return
    const measure = () => {
      const btn = buttonRef.current
      if (!btn) return
      const rect = btn.getBoundingClientRect()
      const popHeight = popoverRef.current?.offsetHeight ?? 260
      const popWidth = popoverRef.current?.offsetWidth ?? 260
      const margin = 12
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      const placement: 'up' | 'down' =
        spaceBelow < popHeight + margin && spaceAbove > popHeight + margin
          ? 'up'
          : 'down'
      const top =
        placement === 'down'
          ? rect.bottom + window.scrollY + 4
          : rect.top + window.scrollY - popHeight - 4
      let left = rect.right + window.scrollX - popWidth
      if (left < 8) left = 8
      setPos({ top, left })
    }
    measure()
    const t = setTimeout(measure, 0)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (buttonRef.current?.contains(target)) return
      if (popoverRef.current?.contains(target)) return
      setOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onScroll = () => setOpen(false)
    const onResize = () => setOpen(false)
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const label = `${MONTH_SHORT[month - 1]} ${year}`

  // === Pill rendering ===
  const renderPill = () => {
    // hasPayment=false student → no interaction at all
    if (!student.hasPayment) {
      return (
        <span className='inline-block px-2 py-1 text-xs text-gray-300'>—</span>
      )
    }

    // No record at all
    if (!payment) {
      if (simplified) {
        // Director can pay → clickable "+"
        return (
          <button
            ref={buttonRef}
            onClick={() => canWrite && setOpen((v) => !v)}
            disabled={!canWrite}
            className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:cursor-not-allowed'
            title={`Pay for ${label}`}
          >
            +
          </button>
        )
      }
      return (
        <button
          ref={buttonRef}
          onClick={() => canWrite && setOpen((v) => !v)}
          disabled={!canWrite}
          className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 disabled:cursor-not-allowed'
        >
          +
        </button>
      )
    }

    const unassigned = !payment.paymentType || payment.amountDue === 0

    if (unassigned) {
      if (simplified) {
        return (
          <button
            ref={buttonRef}
            onClick={() => canWrite && setOpen((v) => !v)}
            disabled={!canWrite}
            className='px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 whitespace-nowrap'
          >
            Pay
          </button>
        )
      }
      return (
        <button
          ref={buttonRef}
          onClick={() => canWrite && setOpen((v) => !v)}
          disabled={!canWrite}
          className='px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 whitespace-nowrap'
        >
          set
        </button>
      )
    }

    if (payment.status === 'paid') {
      return (
        <span className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 whitespace-nowrap'>
          {payment.amountDue} ✓
        </span>
      )
    }

    if (payment.status === 'partial') {
      return (
        <button
          ref={buttonRef}
          onClick={() => canWrite && setOpen((v) => !v)}
          className='px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 whitespace-nowrap'
        >
          {payment.amountPaid}/{payment.amountDue}
        </button>
      )
    }

    // pending
    return (
      <button
        ref={buttonRef}
        onClick={() => canWrite && setOpen((v) => !v)}
        className='px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 hover:bg-red-200 whitespace-nowrap'
      >
        {payment.amountDue} !
      </button>
    )
  }

  // === Popover content ===
  const renderContent = () => {
    // Simplified mode (Director)
    if (simplified) {
      // Already paid → read-only
      if (payment && payment.paymentType && payment.status === 'paid') {
        return (
          <div className='text-xs text-gray-700 space-y-1'>
            <p className='text-green-700 font-medium'>✓ Paid</p>
            <p>
              Amount:{' '}
              <span className='font-medium'>{payment.amountPaid} ETB</span>
            </p>
            {payment.paidDate && (
              <p className='text-gray-500'>
                {new Date(payment.paidDate).toLocaleDateString()}
              </p>
            )}
            {payment.method && (
              <p className='text-gray-500'>via {payment.method}</p>
            )}
          </div>
        )
      }

      // Not paid (empty, pending, partial, unassigned) → type dropdown + Mark Paid
      const selected = activeTypes.find((t) => t._id === selectedType)
      return (
        <div>
          <p className='text-xs text-gray-700 mb-2'>Select payment type:</p>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className='w-full px-2 py-1.5 mb-2 text-xs border border-gray-300 rounded-md'
          >
            {activeTypes.length === 0 && <option value=''>No types</option>}
            {activeTypes.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} — {t.defaultAmount} ETB
              </option>
            ))}
          </select>
          {selected && (
            <p className='text-xs text-gray-500 mb-2'>
              Amount:{' '}
              <span className='font-medium'>{selected.defaultAmount} ETB</span>
            </p>
          )}
          <button
            disabled={!selected}
            onClick={() => {
              setOpen(false)
              if (selected) {
                onMarkMonthPaid(student, year, month, selected._id)
              }
            }}
            className='w-full px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-medium'
          >
            ✓ Mark as Paid
          </button>
        </div>
      )
    }

    // ---- Full mode (Leader) — unchanged from before ----

    if (!payment && canWrite) {
      return (
        <div className='space-y-1.5'>
          <button
            onClick={() => {
              setOpen(false)
              onCreatePending(student, year, month)
            }}
            className='w-full px-3 py-1.5 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200'
          >
            + Create as Pending
          </button>
          <button
            onClick={() => {
              setOpen(false)
              onCreateAndPay(student, year, month)
            }}
            className='w-full px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700'
          >
            ✓ Create &amp; Mark Paid
          </button>
        </div>
      )
    }

    if (payment && !payment.paymentType && canWrite) {
      return (
        <>
          <p className='text-xs text-amber-700 mb-2'>
            No payment type assigned yet.
          </p>
          <button
            onClick={() => {
              setOpen(false)
              onEdit(payment._id)
            }}
            className='w-full px-3 py-1.5 text-xs bg-amber-600 text-white rounded-md hover:bg-amber-700'
          >
            Set Type &amp; Pay
          </button>
        </>
      )
    }

    if (payment && payment.paymentType) {
      return (
        <>
          <div className='text-xs text-gray-700 mb-2 space-y-0.5'>
            <p>
              Due: <span className='font-medium'>{payment.amountDue} ETB</span>
            </p>
            <p>
              Paid:{' '}
              <span className='font-medium'>{payment.amountPaid} ETB</span>
            </p>
            {payment.paidDate && (
              <p className='text-gray-500'>
                {new Date(payment.paidDate).toLocaleDateString()}
              </p>
            )}
            {payment.method && (
              <p className='text-gray-500'>via {payment.method}</p>
            )}
          </div>
          {canWrite && (
            <div className='space-y-1.5'>
              {payment.status !== 'paid' && (
                <button
                  onClick={() => {
                    setOpen(false)
                    onMarkPaid(payment._id)
                  }}
                  className='w-full px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700'
                >
                  ✓ Mark Paid
                </button>
              )}
              {payment.status === 'paid' && (
                <button
                  onClick={() => {
                    setOpen(false)
                    onUndo(payment._id)
                  }}
                  className='w-full px-3 py-1.5 text-xs bg-yellow-600 text-white rounded-md hover:bg-yellow-700'
                >
                  ↺ Undo Payment
                </button>
              )}
              <button
                onClick={() => {
                  setOpen(false)
                  onEdit(payment._id)
                }}
                className='w-full px-3 py-1.5 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200'
              >
                ✎ Edit
              </button>
            </div>
          )}
        </>
      )
    }

    return null
  }

  const popoverContent = (
    <div
      ref={popoverRef}
      style={{
        position: 'absolute',
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        width: 260,
        visibility: pos ? 'visible' : 'hidden',
      }}
      className='z-[100] bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-left'
    >
      <p className='text-xs font-semibold text-gray-900'>{student.fullName}</p>
      <p className='text-xs text-gray-500 mb-2'>{label}</p>
      {renderContent()}
    </div>
  )

  return (
    <div className='inline-block relative'>
      {renderPill()}
      {mounted && open && createPortal(popoverContent, document.body)}
    </div>
  )
}
