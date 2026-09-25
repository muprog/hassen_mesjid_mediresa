// 'use client'

// import { useState, useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useRouter } from 'next/navigation'
// import {
//   createStudentStart,
//   clearStudentError,
// } from '../../../store/slices/studentSlice'
// import { getPaymentTypesStart } from '../../../store/slices/paymentTypeSlice'
// import { AppDispatch, RootState } from '../../../store/store'

// export default function CreateStudentPage() {
//   const dispatch = useDispatch<AppDispatch>()
//   const router = useRouter()
//   const { isLoading, error } = useSelector((state: RootState) => state.students)
//   const { paymentTypes } = useSelector((state: RootState) => state.paymentTypes)
//   const { user } = useSelector((state: RootState) => state.auth)

//   const [formData, setFormData] = useState({
//     code: '',
//     fullName: '',
//     age: '',
//     gender: 'male' as 'male' | 'female',
//     haleqa: '',
//     section: 'A' as 'A' | 'B' | 'C' | 'D',
//     status: 'active' as 'active' | 'inactive' | 'graduated' | 'transferred',
//     fatherPhone: '',
//     motherPhone: '',
//     quranLevel: '',
//     hasPayment: true,
//     paymentType: '',
//   })

//   const canCreate =
//     user?.role === 'committee_leader' ||
//     user?.role === 'committee_member' ||
//     user?.role === 'director'

//   useEffect(() => {
//     dispatch(getPaymentTypesStart({ filters: { activeOnly: 'true' } }))
//   }, [dispatch])

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => dispatch(clearStudentError()), 5000)
//       return () => clearTimeout(timer)
//     }
//   }, [error, dispatch])

//   if (!canCreate) {
//     return (
//       <div className='min-h-screen flex items-center justify-center'>
//         <div className='text-center'>
//           <h1 className='text-2xl font-bold text-red-600'>Access Denied</h1>
//           <p className='text-gray-600 mt-2'>
//             You don't have permission to create students.
//           </p>
//         </div>
//       </div>
//     )
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     // Validation: if hasPayment is true, paymentType must be selected
//     if (formData.hasPayment && !formData.paymentType) {
//       alert('Please select a payment type (or uncheck "Has Payment")')
//       return
//     }

//     const studentData = {
//       code: formData.code,
//       fullName: formData.fullName,
//       age: parseInt(formData.age),
//       gender: formData.gender,
//       haleqa: formData.haleqa,
//       section: formData.section,
//       status: formData.status,
//       fatherPhone: formData.fatherPhone,
//       motherPhone: formData.motherPhone,
//       quranLevel: formData.quranLevel,
//       hasPayment: formData.hasPayment,
//       paymentType: formData.hasPayment ? formData.paymentType : undefined,
//     }

//     dispatch(createStudentStart(studentData))
//     // router.push('/committee/students')
//   }

//   return (
//     <div>
//       <div className='mb-6'>
//         <h1 className='text-2xl font-bold text-gray-900'>
//           Register New Student
//         </h1>
//         <p className='text-gray-600 mt-1'>Add a new student to the Mediresa</p>
//       </div>

//       <form
//         onSubmit={handleSubmit}
//         className='bg-white rounded-lg shadow p-6 max-w-3xl'
//       >
//         {error && (
//           <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
//             <p className='text-sm text-red-600'>{error}</p>
//           </div>
//         )}

//         <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//           {/* Basic info */}
//           <div className='md:col-span-2'>
//             <h3 className='text-lg font-semibold text-gray-900'>
//               Basic Information
//             </h3>
//           </div>
//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Student Code <span className='text-red-500'>*</span>
//             </label>
//             <input
//               type='text'
//               required
//               value={formData.code}
//               onChange={(e) =>
//                 setFormData({ ...formData, code: e.target.value.toUpperCase() })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 uppercase'
//               placeholder='STU-001'
//             />
//             <p className='mt-1 text-xs text-gray-500'>
//               Must be unique. Uppercase letters and numbers.
//             </p>
//           </div>
//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Full Name <span className='text-red-500'>*</span>
//             </label>
//             <input
//               type='text'
//               required
//               value={formData.fullName}
//               onChange={(e) =>
//                 setFormData({ ...formData, fullName: e.target.value })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               placeholder='Ahmed Mohammed'
//             />
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Age <span className='text-red-500'>*</span>
//             </label>
//             <input
//               type='number'
//               required
//               min={4}
//               max={100}
//               value={formData.age}
//               onChange={(e) =>
//                 setFormData({ ...formData, age: e.target.value })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               placeholder='10'
//             />
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Gender <span className='text-red-500'>*</span>
//             </label>
//             <select
//               required
//               value={formData.gender}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   gender: e.target.value as 'male' | 'female',
//                 })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//             >
//               <option value='male'>Male</option>
//               <option value='female'>Female</option>
//             </select>
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Haleqa (Class) <span className='text-red-500'>*</span>
//             </label>
//             <input
//               type='text'
//               required
//               value={formData.haleqa}
//               onChange={(e) =>
//                 setFormData({ ...formData, haleqa: e.target.value })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               placeholder='Haleqa A'
//             />
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Section <span className='text-red-500'>*</span>
//             </label>
//             <select
//               required
//               value={formData.section}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   section: e.target.value as 'A' | 'B' | 'C' | 'D',
//                 })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//             >
//               <option value='A'>A</option>
//               <option value='B'>B</option>
//               <option value='C'>C</option>
//               <option value='D'>D</option>
//             </select>
//           </div>

//           {/* Guardian phones */}
//           <div className='md:col-span-2 mt-4'>
//             <h3 className='text-lg font-semibold text-gray-900'>
//               Guardian Information{' '}
//               <span className='text-sm text-gray-500 font-normal'>
//                 (optional)
//               </span>
//             </h3>
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Father's Phone
//             </label>
//             <input
//               type='tel'
//               value={formData.fatherPhone}
//               onChange={(e) =>
//                 setFormData({ ...formData, fatherPhone: e.target.value })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               placeholder='+251911111111'
//             />
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Mother's Phone
//             </label>
//             <input
//               type='tel'
//               value={formData.motherPhone}
//               onChange={(e) =>
//                 setFormData({ ...formData, motherPhone: e.target.value })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               placeholder='+251911111111'
//             />
//           </div>

//           {/* Quran level */}
//           <div className='md:col-span-2 mt-4'>
//             <h3 className='text-lg font-semibold text-gray-900'>
//               Academic Details
//             </h3>
//           </div>

//           <div className='md:col-span-2'>
//             <label className='block text-sm font-medium text-gray-700'>
//               Quran Level / Current Studies
//             </label>
//             <textarea
//               rows={3}
//               value={formData.quranLevel}
//               onChange={(e) =>
//                 setFormData({ ...formData, quranLevel: e.target.value })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               placeholder='e.g. Juz 5, memorizing Surah Al-Kahf, currently reading Iqra 3'
//             />
//             <p className='mt-1 text-xs text-gray-500'>
//               Free text — leave blank if unknown.
//             </p>
//           </div>

//           {/* Payment */}
//           <div className='md:col-span-2 mt-4'>
//             <h3 className='text-lg font-semibold text-gray-900'>Payment</h3>
//           </div>

//           <div className='md:col-span-2'>
//             <div className='flex items-center gap-3 bg-gray-50 p-3 rounded-md'>
//               <input
//                 type='checkbox'
//                 id='hasPayment'
//                 checked={formData.hasPayment}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     hasPayment: e.target.checked,
//                     paymentType: e.target.checked ? formData.paymentType : '',
//                   })
//                 }
//                 className='h-4 w-4 text-indigo-600 border-gray-300 rounded'
//               />
//               <label htmlFor='hasPayment' className='text-sm text-gray-700'>
//                 This student pays monthly fees
//               </label>
//             </div>
//             <p className='mt-1 text-xs text-gray-500'>
//               Uncheck for students who cannot afford payment.
//             </p>
//           </div>

//           {formData.hasPayment && (
//             <div className='md:col-span-2'>
//               <label className='block text-sm font-medium text-gray-700'>
//                 Payment Type <span className='text-red-500'>*</span>
//               </label>
//               <select
//                 required={formData.hasPayment}
//                 value={formData.paymentType}
//                 onChange={(e) =>
//                   setFormData({ ...formData, paymentType: e.target.value })
//                 }
//                 className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               >
//                 <option value=''>Select a payment type...</option>
//                 {paymentTypes.map((t) => (
//                   <option key={t._id} value={t._id}>
//                     {t.name} — {t.defaultAmount} ETB ({t.period})
//                   </option>
//                 ))}
//               </select>
//               {paymentTypes.length === 0 && (
//                 <p className='mt-1 text-xs text-amber-600'>
//                   No payment types exist yet. Ask the Committee Leader to create
//                   one first.
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Status */}
//           <div className='md:col-span-2 mt-4'>
//             <h3 className='text-lg font-semibold text-gray-900'>Status</h3>
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Status
//             </label>
//             <select
//               value={formData.status}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   status: e.target.value as
//                     | 'active'
//                     | 'inactive'
//                     | 'graduated'
//                     | 'transferred',
//                 })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//             >
//               <option value='active'>Active</option>
//               <option value='inactive'>Inactive</option>
//               <option value='graduated'>Graduated</option>
//               <option value='transferred'>Transferred</option>
//             </select>
//           </div>
//         </div>

//         <div className='mt-6 flex justify-end space-x-3'>
//           <button
//             type='button'
//             onClick={() => router.push('/committee/students')}
//             className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
//           >
//             Cancel
//           </button>
//           <button
//             type='submit'
//             disabled={isLoading}
//             className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50'
//           >
//             {isLoading ? 'Registering...' : 'Register Student'}
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }
// 'use client'

// import { useState, useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useRouter } from 'next/navigation'
// import {
//   createStudentStart,
//   clearStudentError,
//   clearStudentSuccess,
// } from '../../../store/slices/studentSlice'
// import { getPaymentTypesStart } from '../../../store/slices/paymentTypeSlice'
// import { AppDispatch, RootState } from '../../../store/store'

// export default function CreateStudentPage() {
//   const dispatch = useDispatch<AppDispatch>()
//   const router = useRouter()
//   const { isLoading, error, successMessage } = useSelector(
//     (state: RootState) => state.students
//   )
//   const { paymentTypes } = useSelector((state: RootState) => state.paymentTypes)
//   const { user } = useSelector((state: RootState) => state.auth)

//   const [formData, setFormData] = useState({
//     code: '',
//     fullName: '',
//     age: '',
//     gender: 'male' as 'male' | 'female',
//     haleqa: '',
//     section: 'A' as 'A' | 'B' | 'C' | 'D',
//     status: 'active' as 'active' | 'inactive' | 'graduated' | 'transferred',
//     fatherPhone: '',
//     motherPhone: '',
//     quranLevel: '',
//     hasPayment: true,
//     paymentType: '',
//   })

//   const canCreate =
//     user?.role === 'committee_leader' ||
//     user?.role === 'committee_member' ||
//     user?.role === 'director'

//   useEffect(() => {
//     dispatch(getPaymentTypesStart({ filters: { activeOnly: 'true' } }))
//   }, [dispatch])

//   // Redirect ONLY on success
//   useEffect(() => {
//     if (successMessage) {
//       dispatch(clearStudentSuccess())
//       router.push('/committee/students')
//     }
//   }, [successMessage, dispatch, router])

//   // Auto-clear error after 6s
//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => dispatch(clearStudentError()), 6000)
//       return () => clearTimeout(timer)
//     }
//   }, [error, dispatch])

//   // Clear any stale state when the page mounts
//   useEffect(() => {
//     dispatch(clearStudentError())
//     dispatch(clearStudentSuccess())
//   }, [dispatch])

//   if (!canCreate) {
//     return (
//       <div className='min-h-screen flex items-center justify-center'>
//         <div className='text-center'>
//           <h1 className='text-2xl font-bold text-red-600'>Access Denied</h1>
//           <p className='text-gray-600 mt-2'>
//             You don't have permission to create students.
//           </p>
//         </div>
//       </div>
//     )
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     if (formData.hasPayment && !formData.paymentType) {
//       alert('Please select a payment type (or uncheck "Has Payment")')
//       return
//     }

//     const studentData = {
//       code: formData.code.trim().toUpperCase(),
//       fullName: formData.fullName.trim(),
//       age: parseInt(formData.age),
//       gender: formData.gender,
//       haleqa: formData.haleqa.trim(),
//       section: formData.section,
//       status: formData.status,
//       fatherPhone: formData.fatherPhone.trim(),
//       motherPhone: formData.motherPhone.trim(),
//       quranLevel: formData.quranLevel.trim(),
//       hasPayment: formData.hasPayment,
//       paymentType: formData.hasPayment ? formData.paymentType : undefined,
//     }

//     dispatch(createStudentStart(studentData))
//     // NO router.push here — redirect happens in useEffect when successMessage appears
//   }

//   return (
//     <div>
//       <div className='mb-6'>
//         <h1 className='text-2xl font-bold text-gray-900'>
//           Register New Student
//         </h1>
//         <p className='text-gray-600 mt-1'>Add a new student to the Mediresa</p>
//       </div>

//       <form
//         onSubmit={handleSubmit}
//         className='bg-white rounded-lg shadow p-6 max-w-3xl'
//       >
//         {/* Success banner */}
//         {successMessage && (
//           <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2'>
//             <svg
//               className='w-5 h-5 text-green-600'
//               fill='none'
//               stroke='currentColor'
//               viewBox='0 0 24 24'
//             >
//               <path
//                 strokeLinecap='round'
//                 strokeLinejoin='round'
//                 strokeWidth='2'
//                 d='M5 13l4 4L19 7'
//               />
//             </svg>
//             <p className='text-sm text-green-700 font-medium'>
//               {successMessage} — redirecting...
//             </p>
//           </div>
//         )}

//         {/* Error banner */}
//         {error && (
//           <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2'>
//             <svg
//               className='w-5 h-5 text-red-600'
//               fill='none'
//               stroke='currentColor'
//               viewBox='0 0 24 24'
//             >
//               <path
//                 strokeLinecap='round'
//                 strokeLinejoin='round'
//                 strokeWidth='2'
//                 d='M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
//               />
//             </svg>
//             <p className='text-sm text-red-600'>{error}</p>
//           </div>
//         )}

//         {/* ... your entire grid of fields (unchanged) ... */}
//         <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//           {/* ... your existing fields ... */}
//         </div>

//         <div className='mt-6 flex justify-end space-x-3'>
//           <button
//             type='button'
//             onClick={() => router.push('/committee/students')}
//             className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
//           >
//             Cancel
//           </button>
//           <button
//             type='submit'
//             disabled={isLoading || !!successMessage}
//             className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50'
//           >
//             {isLoading
//               ? 'Registering...'
//               : successMessage
//               ? 'Redirecting...'
//               : 'Register Student'}
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import {
  createStudentStart,
  clearStudentError,
  clearStudentSuccess,
} from '../../../store/slices/studentSlice'
import { getPaymentTypesStart } from '../../../store/slices/paymentTypeSlice'
import { AppDispatch, RootState } from '../../../store/store'

export default function CreateStudentPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { isLoading, error, successMessage } = useSelector(
    (state: RootState) => state.students
  )
  const { paymentTypes } = useSelector((state: RootState) => state.paymentTypes)
  const { user } = useSelector((state: RootState) => state.auth)

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

  const canCreate =
    user?.role === 'committee_leader' ||
    user?.role === 'committee_member' ||
    user?.role === 'director'

  useEffect(() => {
    dispatch(getPaymentTypesStart({ filters: { activeOnly: 'true' } }))
  }, [dispatch])

  // Redirect ONLY on success — no timeout, fires the moment successMessage is set
  useEffect(() => {
    if (successMessage) {
      dispatch(clearStudentSuccess())
      router.push('/committee/students')
    }
  }, [successMessage, dispatch, router])

  // Auto-clear error after 6s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearStudentError()), 6000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  // Clear any stale state when the page mounts
  useEffect(() => {
    dispatch(clearStudentError())
    dispatch(clearStudentSuccess())
  }, [dispatch])

  if (!canCreate) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-600'>Access Denied</h1>
          <p className='text-gray-600 mt-2'>
            You don't have permission to create students.
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.hasPayment && !formData.paymentType) {
      alert('Please select a payment type (or uncheck "Has Payment")')
      return
    }

    const studentData = {
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
      paymentType: formData.hasPayment ? formData.paymentType : undefined,
    }

    dispatch(createStudentStart(studentData))
    // NO router.push here — redirect happens in useEffect when successMessage appears
  }

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>
          Register New Student
        </h1>
        <p className='text-gray-600 mt-1'>Add a new student to the Mediresa</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-lg shadow p-6 max-w-3xl'
      >
        {/* Success banner */}
        {successMessage && (
          <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2'>
            <svg
              className='w-5 h-5 text-green-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M5 13l4 4L19 7'
              />
            </svg>
            <p className='text-sm text-green-700 font-medium'>
              {successMessage}
            </p>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2'>
            <svg
              className='w-5 h-5 text-red-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <p className='text-sm text-red-600'>{error}</p>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Basic Information */}
          <div className='md:col-span-2'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Basic Information
            </h3>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Student Code <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              required
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 uppercase'
              placeholder='STU-001'
            />
            <p className='mt-1 text-xs text-gray-500'>
              Must be unique. Uppercase letters and numbers.
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Full Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='Ahmed Mohammed'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Age <span className='text-red-500'>*</span>
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
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='10'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Gender <span className='text-red-500'>*</span>
            </label>
            <select
              required
              value={formData.gender}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gender: e.target.value as 'male' | 'female',
                })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            >
              <option value='male'>Male</option>
              <option value='female'>Female</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Haleqa (Class) <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              required
              value={formData.haleqa}
              onChange={(e) =>
                setFormData({ ...formData, haleqa: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='Haleqa A'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Section <span className='text-red-500'>*</span>
            </label>
            <select
              required
              value={formData.section}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  section: e.target.value as 'A' | 'B' | 'C' | 'D',
                })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            >
              <option value='A'>A</option>
              <option value='B'>B</option>
              <option value='C'>C</option>
              <option value='D'>D</option>
            </select>
          </div>

          {/* Guardian phones */}
          <div className='md:col-span-2 mt-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Guardian Information{' '}
              <span className='text-sm text-gray-500 font-normal'>
                (optional)
              </span>
            </h3>
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
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='+251911111111'
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
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='+251911111111'
            />
          </div>

          {/* Quran level */}
          <div className='md:col-span-2 mt-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Academic Details
            </h3>
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
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='e.g. Juz 5, memorizing Surah Al-Kahf, currently reading Iqra 3'
            />
            <p className='mt-1 text-xs text-gray-500'>
              Free text — leave blank if unknown.
            </p>
          </div>

          {/* Payment */}
          <div className='md:col-span-2 mt-4'>
            <h3 className='text-lg font-semibold text-gray-900'>Payment</h3>
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
                className='h-4 w-4 text-indigo-600 border-gray-300 rounded'
              />
              <label htmlFor='hasPayment' className='text-sm text-gray-700'>
                This student pays monthly fees
              </label>
            </div>
            <p className='mt-1 text-xs text-gray-500'>
              Uncheck for students who cannot afford payment.
            </p>
          </div>

          {formData.hasPayment && (
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Payment Type <span className='text-red-500'>*</span>
              </label>
              <select
                required={formData.hasPayment}
                value={formData.paymentType}
                onChange={(e) =>
                  setFormData({ ...formData, paymentType: e.target.value })
                }
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              >
                <option value=''>Select a payment type...</option>
                {paymentTypes.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} — {t.defaultAmount} ETB ({t.period})
                  </option>
                ))}
              </select>
              {paymentTypes.length === 0 && (
                <p className='mt-1 text-xs text-amber-600'>
                  No payment types exist yet. Ask the Committee Leader to create
                  one first.
                </p>
              )}
            </div>
          )}

          {/* Status */}
          <div className='md:col-span-2 mt-4'>
            <h3 className='text-lg font-semibold text-gray-900'>Status</h3>
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
                  status: e.target.value as
                    | 'active'
                    | 'inactive'
                    | 'graduated'
                    | 'transferred',
                })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
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
            onClick={() => router.push('/committee/students')}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading || !!successMessage}
            className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50'
          >
            {isLoading ? 'Registering...' : 'Register Student'}
          </button>
        </div>
      </form>
    </div>
  )
}
