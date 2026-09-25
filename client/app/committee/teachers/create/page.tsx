// 'use client'

// import { useState, useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useRouter } from 'next/navigation'
// import {
//   createTeacherStart,
//   clearTeacherError,
// } from '../../../store/slices/teacherSlice'
// import { AppDispatch, RootState } from '../../../store/store'

// export default function CreateTeacherPage() {
//   const dispatch = useDispatch<AppDispatch>()
//   const router = useRouter()
//   const { isLoading, error } = useSelector((state: RootState) => state.teachers)
//   const { user } = useSelector((state: RootState) => state.auth)

//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     age: '',
//     gender: 'male',
//     email: '',
//     address: '',
//     dateOfBirth: '',
//     idCard: '',
//     education: {
//       certificate: '',
//       institution: '',
//       year: '',
//       file: '',
//     },
//     specialization: 'general',
//     experience: '',
//     assignedHaleqas: [''],
//     maxStudents: '30',
//     status: 'active',
//     hireDate: '',
//   })

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => dispatch(clearTeacherError()), 5000)
//       return () => clearTimeout(timer)
//     }
//   }, [error, dispatch])

//   const canCreate =
//     user?.role === 'committee_leader' ||
//     user?.role === 'committee_member' ||
//     user?.role === 'director'

//   if (!canCreate) {
//     return (
//       <div className='min-h-screen flex items-center justify-center'>
//         <div className='text-center'>
//           <h1 className='text-2xl font-bold text-red-600'>Access Denied</h1>
//           <p className='text-gray-600 mt-2'>
//             You don't have permission to create teachers.
//           </p>
//         </div>
//       </div>
//     )
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     const teacherData = {
//       ...formData,
//       age: parseInt(formData.age),
//       experience: parseInt(formData.experience),
//       maxStudents: parseInt(formData.maxStudents),
//       education: {
//         ...formData.education,
//         year: parseInt(formData.education.year),
//       },
//       assignedHaleqas: formData.assignedHaleqas.filter((h) => h.trim() !== ''),
//     }

//     dispatch(createTeacherStart(teacherData))
//     router.push('/committee/teachers')
//   }

//   const handleHaleqaChange = (index: number, value: string) => {
//     const newHaleqas = [...formData.assignedHaleqas]
//     newHaleqas[index] = value
//     setFormData({ ...formData, assignedHaleqas: newHaleqas })
//   }

//   const addHaleqa = () => {
//     setFormData({
//       ...formData,
//       assignedHaleqas: [...formData.assignedHaleqas, ''],
//     })
//   }

//   const removeHaleqa = (index: number) => {
//     if (formData.assignedHaleqas.length > 1) {
//       const newHaleqas = formData.assignedHaleqas.filter((_, i) => i !== index)
//       setFormData({ ...formData, assignedHaleqas: newHaleqas })
//     }
//   }

//   return (
//     <div>
//       <div className='mb-6'>
//         <h1 className='text-2xl font-bold text-gray-900'>
//           Register New Teacher
//         </h1>
//         <p className='text-gray-600 mt-1'>
//           Add a new teacher to the Mediresa system
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className='bg-white rounded-lg shadow p-6'>
//         {error && (
//           <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
//             <p className='text-sm text-red-600'>{error}</p>
//           </div>
//         )}

//         <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//           {/* Personal Information */}
//           <div className='md:col-span-2'>
//             <h3 className='text-lg font-semibold text-gray-900 mb-4'>
//               Personal Information
//             </h3>
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Full Name *
//             </label>
//             <input
//               type='text'
//               required
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({ ...formData, name: e.target.value })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               placeholder='Ahmed Mohammed'
//             />
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Phone *
//             </label>
//             <input
//               type='tel'
//               required
//               value={formData.phone}
//               onChange={(e) =>
//                 setFormData({ ...formData, phone: e.target.value })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               placeholder='+251911111111'
//             />
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Age *
//             </label>
//             <input
//               type='number'
//               required
//               min='18'
//               max='100'
//               value={formData.age}
//               onChange={(e) =>
//                 setFormData({ ...formData, age: e.target.value })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               placeholder='30'
//             />
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Gender *
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
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//             >
//               <option value='male'>Male</option>
//               <option value='female'>Female</option>
//             </select>
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Email
//             </label>
//             <input
//               type='email'
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               placeholder='teacher@mediresa.com'
//             />
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Date of Birth
//             </label>
//             <input
//               type='date'
//               value={formData.dateOfBirth}
//               onChange={(e) =>
//                 setFormData({ ...formData, dateOfBirth: e.target.value })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//             />
//           </div>

//           <div className='md:col-span-2'>
//             <label className='block text-sm font-medium text-gray-700'>
//               Address
//             </label>
//             <input
//               type='text'
//               value={formData.address}
//               onChange={(e) =>
//                 setFormData({ ...formData, address: e.target.value })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               placeholder='Addis Ababa, Ethiopia'
//             />
//           </div>

//           {/* Professional Information */}
//           <div className='md:col-span-2'>
//             <h3 className='text-lg font-semibold text-gray-900 mt-6 mb-4'>
//               Professional Information
//             </h3>
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               ID Card Number *
//             </label>
//             <input
//               type='text'
//               required
//               value={formData.idCard}
//               onChange={(e) =>
//                 setFormData({ ...formData, idCard: e.target.value })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               placeholder='ET-123456'
//             />
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Specialization *
//             </label>
//             <select
//               required
//               value={formData.specialization}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   specialization: e.target.value as
//                     | 'quran'
//                     | 'tajweed'
//                     | 'tafseer'
//                     | 'general',
//                 })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//             >
//               <option value='quran'>Quran</option>
//               <option value='tajweed'>Tajweed</option>
//               <option value='tafseer'>Tafseer</option>
//               <option value='general'>General</option>
//             </select>
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Experience (Years) *
//             </label>
//             <input
//               type='number'
//               required
//               min='0'
//               value={formData.experience}
//               onChange={(e) =>
//                 setFormData({ ...formData, experience: e.target.value })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               placeholder='5'
//             />
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Max Students
//             </label>
//             <input
//               type='number'
//               min='1'
//               max='100'
//               value={formData.maxStudents}
//               onChange={(e) =>
//                 setFormData({ ...formData, maxStudents: e.target.value })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               placeholder='30'
//             />
//           </div>

//           {/* Education */}
//           <div className='md:col-span-2'>
//             <h4 className='text-md font-medium text-gray-900 mt-4 mb-3'>
//               Education Details
//             </h4>
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Certificate *
//             </label>
//             <input
//               type='text'
//               required
//               value={formData.education.certificate}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   education: {
//                     ...formData.education,
//                     certificate: e.target.value,
//                   },
//                 })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               placeholder='BA in Islamic Studies'
//             />
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Institution *
//             </label>
//             <input
//               type='text'
//               required
//               value={formData.education.institution}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   education: {
//                     ...formData.education,
//                     institution: e.target.value,
//                   },
//                 })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               placeholder='University of Quran'
//             />
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Year *
//             </label>
//             <input
//               type='number'
//               required
//               min='1900'
//               max={new Date().getFullYear()}
//               value={formData.education.year}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   education: { ...formData.education, year: e.target.value },
//                 })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               placeholder='2020'
//             />
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Certificate File URL
//             </label>
//             <input
//               type='text'
//               value={formData.education.file}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   education: { ...formData.education, file: e.target.value },
//                 })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               placeholder='https://example.com/certificate.pdf'
//             />
//           </div>

//           {/* Haleqa Assignment */}
//           <div className='md:col-span-2'>
//             <h4 className='text-md font-medium text-gray-900 mt-4 mb-3'>
//               Assigned Haleqas
//             </h4>
//           </div>

//           <div className='md:col-span-2'>
//             {formData.assignedHaleqas.map((haleqa, index) => (
//               <div key={index} className='flex gap-2 mb-2'>
//                 <input
//                   type='text'
//                   value={haleqa}
//                   onChange={(e) => handleHaleqaChange(index, e.target.value)}
//                   className='flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//                   placeholder={`Haleqa ${String.fromCharCode(65 + index)}`}
//                 />
//                 <button
//                   type='button'
//                   onClick={() => removeHaleqa(index)}
//                   className='px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200'
//                 >
//                   ✕
//                 </button>
//               </div>
//             ))}
//             <button
//               type='button'
//               onClick={addHaleqa}
//               className='text-sm text-indigo-600 hover:text-indigo-800'
//             >
//               + Add Haleqa
//             </button>
//           </div>

//           {/* Status */}
//           <div className='md:col-span-2'>
//             <h3 className='text-lg font-semibold text-gray-900 mt-6 mb-4'>
//               Status & Employment
//             </h3>
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
//                   status: e.target.value as 'active' | 'inactive' | 'on_leave',
//                 })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//             >
//               <option value='active'>Active</option>
//               <option value='inactive'>Inactive</option>
//               <option value='on_leave'>On Leave</option>
//             </select>
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Hire Date
//             </label>
//             <input
//               type='date'
//               value={formData.hireDate}
//               onChange={(e) =>
//                 setFormData({ ...formData, hireDate: e.target.value })
//               }
//               className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//             />
//           </div>
//         </div>

//         <div className='mt-6 flex justify-end space-x-3'>
//           <button
//             type='button'
//             onClick={() => router.push('/committee/teachers')}
//             className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
//           >
//             Cancel
//           </button>
//           <button
//             type='submit'
//             disabled={isLoading}
//             className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
//           >
//             {isLoading ? 'Registering...' : 'Register Teacher'}
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
  createTeacherStart,
  clearTeacherError,
} from '../../../store/slices/teacherSlice'
import { AppDispatch, RootState } from '../../../store/store'

export default function CreateTeacherPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { isLoading, error } = useSelector((state: RootState) => state.teachers)
  const { user } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    experience: '',
    kitabLearned: [''],
    status: 'active',
  })

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearTeacherError()), 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const canCreate =
    user?.role === 'committee_leader' ||
    user?.role === 'committee_member' ||
    user?.role === 'director'

  if (!canCreate) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-600'>Access Denied</h1>
          <p className='text-gray-600 mt-2'>
            You don't have permission to create teachers.
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const teacherData = {
      ...formData,
      age: parseInt(formData.age),
      experience: parseInt(formData.experience),
      kitabLearned: formData.kitabLearned.filter((k) => k.trim() !== ''),
    }

    dispatch(createTeacherStart(teacherData))
    router.push('/committee/teachers')
  }

  const handleKitabChange = (index: number, value: string) => {
    const newKitab = [...formData.kitabLearned]
    newKitab[index] = value
    setFormData({ ...formData, kitabLearned: newKitab })
  }

  const addKitab = () => {
    setFormData({ ...formData, kitabLearned: [...formData.kitabLearned, ''] })
  }

  const removeKitab = (index: number) => {
    if (formData.kitabLearned.length > 1) {
      const newKitab = formData.kitabLearned.filter((_, i) => i !== index)
      setFormData({ ...formData, kitabLearned: newKitab })
    }
  }

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>
          Register New Teacher
        </h1>
        <p className='text-gray-600 mt-1'>
          Add a new teacher to the Mediresa system
        </p>
      </div>

      <form onSubmit={handleSubmit} className='bg-white rounded-lg shadow p-6'>
        {error && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-sm text-red-600'>{error}</p>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Full Name *
            </label>
            <input
              type='text'
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='Ahmed Mohammed'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Age *
            </label>
            <input
              type='number'
              required
              min='18'
              max='100'
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='30'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Phone *
            </label>
            <input
              type='tel'
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='+251911111111'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Experience (Years) *
            </label>
            <input
              type='number'
              required
              min='0'
              value={formData.experience}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='5'
            />
          </div>

          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Kitab Learned (Books)
            </label>
            <p className='text-xs text-gray-500 mb-2'>
              Add all the books/kitabs this teacher has learned or teaches
            </p>

            {formData.kitabLearned.map((kitab, index) => (
              <div key={index} className='flex gap-2 mb-2'>
                <input
                  type='text'
                  value={kitab}
                  onChange={(e) => handleKitabChange(index, e.target.value)}
                  className='flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder={`Kitab ${index + 1}`}
                />
                <button
                  type='button'
                  onClick={() => removeKitab(index)}
                  className='px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200'
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type='button'
              onClick={addKitab}
              className='text-sm text-indigo-600 hover:text-indigo-800'
            >
              + Add Kitab
            </button>
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
                  status: e.target.value as 'active' | 'inactive' | 'on_leave',
                })
              }
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            >
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
              <option value='on_leave'>On Leave</option>
            </select>
          </div>
        </div>

        <div className='mt-6 flex justify-end space-x-3'>
          <button
            type='button'
            onClick={() => router.push('/committee/teachers')}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
          >
            {isLoading ? 'Registering...' : 'Register Teacher'}
          </button>
        </div>
      </form>
    </div>
  )
}
