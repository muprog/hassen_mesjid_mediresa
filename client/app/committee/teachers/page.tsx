// 'use client'

// import { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useRouter } from 'next/navigation'
// import {
//   getTeachersStart,
//   deleteTeacherStart,
//   setTeacherFilters,
//   clearTeacherFilters,
// } from '../../store/slices/teacherSlice'
// import { AppDispatch, RootState } from '../../store/store'

// export default function TeachersPage() {
//   const dispatch = useDispatch<AppDispatch>()
//   const router = useRouter()
//   const { teachers, isLoading, filters } = useSelector(
//     (state: RootState) => state.teachers
//   )
//   const { user } = useSelector((state: RootState) => state.auth)
//   const [searchTerm, setSearchTerm] = useState('')

//   const isCommitteeLeader =
//     user?.role === 'committee_leader' || user?.role === 'committee_member'

//   useEffect(() => {
//     dispatch(getTeachersStart({ filters }))
//   }, [dispatch, filters])

//   const handleSearch = () => {
//     dispatch(setTeacherFilters({ search: searchTerm }))
//     dispatch(getTeachersStart({ filters: { ...filters, search: searchTerm } }))
//   }

//   const handleFilterChange = (key: string, value: string) => {
//     dispatch(setTeacherFilters({ [key]: value }))
//     dispatch(getTeachersStart({ filters: { ...filters, [key]: value } }))
//   }

//   const handleDelete = (id: string) => {
//     if (window.confirm('Are you sure you want to delete this teacher?')) {
//       dispatch(deleteTeacherStart(id))
//     }
//   }

//   const handleClearFilters = () => {
//     dispatch(clearTeacherFilters())
//     setSearchTerm('')
//     dispatch(getTeachersStart({ filters: {} }))
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'active':
//         return 'bg-green-100 text-green-800'
//       case 'inactive':
//         return 'bg-gray-100 text-gray-800'
//       case 'on_leave':
//         return 'bg-yellow-100 text-yellow-800'
//       default:
//         return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const getSpecializationColor = (specialization: string) => {
//     switch (specialization) {
//       case 'quran':
//         return 'bg-blue-100 text-blue-800'
//       case 'tajweed':
//         return 'bg-purple-100 text-purple-800'
//       case 'tafseer':
//         return 'bg-green-100 text-green-800'
//       default:
//         return 'bg-gray-100 text-gray-800'
//     }
//   }

//   return (
//     <div>
//       <div className='flex justify-between items-center mb-6'>
//         <div>
//           <h1 className='text-2xl font-bold text-gray-900'>Teachers</h1>
//           <p className='text-gray-600 mt-1'>
//             Manage all teachers in the Mediresa
//           </p>
//         </div>
//         {(isCommitteeLeader || user?.role === 'director') && (
//           <button
//             onClick={() => router.push('/committee/teachers/create')}
//             className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
//           >
//             + Register Teacher
//           </button>
//         )}
//       </div>

//       {/* Filters */}
//       <div className='bg-white rounded-lg shadow p-4 mb-6'>
//         <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
//           <div>
//             <label className='block text-sm font-medium text-gray-700 mb-1'>
//               Search
//             </label>
//             <div className='flex'>
//               <input
//                 type='text'
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//                 placeholder='Search by name or ID...'
//                 className='flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               />
//               <button
//                 onClick={handleSearch}
//                 className='px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700'
//               >
//                 Search
//               </button>
//             </div>
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700 mb-1'>
//               Specialization
//             </label>
//             <select
//               value={filters.specialization || ''}
//               onChange={(e) =>
//                 handleFilterChange('specialization', e.target.value)
//               }
//               className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//             >
//               <option value=''>All</option>
//               <option value='quran'>Quran</option>
//               <option value='tajweed'>Tajweed</option>
//               <option value='tafseer'>Tafseer</option>
//               <option value='general'>General</option>
//             </select>
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700 mb-1'>
//               Status
//             </label>
//             <select
//               value={filters.status || ''}
//               onChange={(e) => handleFilterChange('status', e.target.value)}
//               className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//             >
//               <option value=''>All</option>
//               <option value='active'>Active</option>
//               <option value='inactive'>Inactive</option>
//               <option value='on_leave'>On Leave</option>
//             </select>
//           </div>

//           <div className='flex items-end'>
//             <button
//               onClick={handleClearFilters}
//               className='text-sm text-gray-600 hover:text-gray-900'
//             >
//               Clear Filters
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Teachers Table */}
//       <div className='bg-white rounded-lg shadow overflow-hidden'>
//         {isLoading ? (
//           <div className='flex justify-center items-center py-12'>
//             <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
//           </div>
//         ) : teachers.length === 0 ? (
//           <div className='text-center py-12'>
//             <p className='text-gray-500'>No teachers found</p>
//             {(isCommitteeLeader || user?.role === 'director') && (
//               <button
//                 onClick={() => router.push('/committee/teachers/create')}
//                 className='mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
//               >
//                 Register your first teacher
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className='overflow-x-auto'>
//             <table className='min-w-full divide-y divide-gray-200'>
//               <thead className='bg-gray-50'>
//                 <tr>
//                   <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
//                     Teacher
//                   </th>
//                   <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
//                     ID Card
//                   </th>
//                   <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
//                     Specialization
//                   </th>
//                   <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
//                     Students
//                   </th>
//                   <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
//                     Haleqas
//                   </th>
//                   <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
//                     Status
//                   </th>
//                   <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
//                     Experience
//                   </th>
//                   <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className='bg-white divide-y divide-gray-200'>
//                 {teachers.map((teacher) => (
//                   <tr key={teacher._id} className='hover:bg-gray-50'>
//                     <td className='px-6 py-4 whitespace-nowrap'>
//                       <div>
//                         <div className='text-sm font-medium text-gray-900'>
//                           {teacher.name}
//                         </div>
//                         <div className='text-sm text-gray-500'>
//                           {teacher.phone}
//                         </div>
//                         {teacher.email && (
//                           <div className='text-xs text-gray-400'>
//                             {teacher.email}
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                     <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
//                       {teacher.idCard}
//                     </td>
//                     <td className='px-6 py-4 whitespace-nowrap'>
//                       <span
//                         className={`px-2 py-1 text-xs font-medium rounded-full ${getSpecializationColor(
//                           teacher.specialization
//                         )}`}
//                       >
//                         {teacher.specialization.charAt(0).toUpperCase() +
//                           teacher.specialization.slice(1)}
//                       </span>
//                     </td>
//                     <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
//                       {teacher.assignedStudents?.length || 0} /{' '}
//                       {teacher.maxStudents}
//                     </td>
//                     <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
//                       {teacher.assignedHaleqas?.join(', ') || 'None'}
//                     </td>
//                     <td className='px-6 py-4 whitespace-nowrap'>
//                       <span
//                         className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
//                           teacher.status
//                         )}`}
//                       >
//                         {teacher.status}
//                       </span>
//                     </td>
//                     <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
//                       {teacher.experience} years
//                     </td>
//                     <td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
//                       <button
//                         onClick={() =>
//                           router.push(`/committee/teachers/${teacher._id}`)
//                         }
//                         className='text-indigo-600 hover:text-indigo-900'
//                       >
//                         View
//                       </button>
//                       {(isCommitteeLeader || user?.role === 'director') && (
//                         <>
//                           <button
//                             onClick={() =>
//                               router.push(
//                                 `/committee/teachers/${teacher._id}/edit`
//                               )
//                             }
//                             className='text-blue-600 hover:text-blue-900'
//                           >
//                             Edit
//                           </button>
//                           {isCommitteeLeader && (
//                             <button
//                               onClick={() => handleDelete(teacher._id)}
//                               className='text-red-600 hover:text-red-900'
//                             >
//                               Delete
//                             </button>
//                           )}
//                         </>
//                       )}
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

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import {
  getTeachersStart,
  deleteTeacherStart,
  setTeacherFilters,
  clearTeacherFilters,
} from '../../store/slices/teacherSlice'
import { AppDispatch, RootState } from '../../store/store'

export default function TeachersPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { teachers, isLoading, filters } = useSelector(
    (state: RootState) => state.teachers
  )
  const { user } = useSelector((state: RootState) => state.auth)
  const [searchTerm, setSearchTerm] = useState('')

  const isCommitteeLeader =
    user?.role === 'committee_leader' || user?.role === 'committee_member'

  useEffect(() => {
    dispatch(getTeachersStart({ filters }))
  }, [dispatch, filters])

  const handleSearch = () => {
    dispatch(setTeacherFilters({ search: searchTerm }))
    dispatch(getTeachersStart({ filters: { ...filters, search: searchTerm } }))
  }

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setTeacherFilters({ [key]: value }))
    dispatch(getTeachersStart({ filters: { ...filters, [key]: value } }))
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      dispatch(deleteTeacherStart(id))
    }
  }

  const handleClearFilters = () => {
    dispatch(clearTeacherFilters())
    setSearchTerm('')
    dispatch(getTeachersStart({ filters: {} }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Teachers</h1>
          <p className='text-gray-600 mt-1'>
            Manage all teachers in the Mediresa
          </p>
        </div>
        {(isCommitteeLeader || user?.role === 'director') && (
          <button
            onClick={() => router.push('/committee/teachers/create')}
            className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            + Register Teacher
          </button>
        )}
      </div>

      {/* Filters */}
      <div className='bg-white rounded-lg shadow p-4 mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Search
            </label>
            <div className='flex'>
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder='Search by name, phone, or kitab...'
                className='flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              />
              <button
                onClick={handleSearch}
                className='px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700'
              >
                Search
              </button>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Status
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            >
              <option value=''>All</option>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
              <option value='on_leave'>On Leave</option>
            </select>
          </div>

          <div className='flex items-end'>
            <button
              onClick={handleClearFilters}
              className='text-sm text-gray-600 hover:text-gray-900'
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Teachers Table */}
      <div className='bg-white rounded-lg shadow overflow-hidden'>
        {isLoading ? (
          <div className='flex justify-center items-center py-12'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
          </div>
        ) : teachers.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500'>No teachers found</p>
            {(isCommitteeLeader || user?.role === 'director') && (
              <button
                onClick={() => router.push('/committee/teachers/create')}
                className='mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
              >
                Register your first teacher
              </button>
            )}
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Teacher
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Age
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Phone
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Experience
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Kitabs
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {teachers.map((teacher) => (
                  <tr key={teacher._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {teacher.fullName}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {teacher.age}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {teacher.phone}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {teacher.experience} years
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {teacher.kitabLearned &&
                      teacher.kitabLearned.length > 0 ? (
                        <div className='flex flex-wrap gap-1'>
                          {teacher.kitabLearned
                            .slice(0, 2)
                            .map((kitab, idx) => (
                              <span
                                key={idx}
                                className='px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full'
                              >
                                {kitab}
                              </span>
                            ))}
                          {teacher.kitabLearned.length > 2 && (
                            <span className='px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full'>
                              +{teacher.kitabLearned.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className='text-gray-400 text-xs'>None</span>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          teacher.status
                        )}`}
                      >
                        {teacher.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
                      <button
                        onClick={() =>
                          router.push(`/committee/teachers/${teacher._id}`)
                        }
                        className='text-indigo-600 hover:text-indigo-900'
                      >
                        View
                      </button>
                      {(isCommitteeLeader || user?.role === 'director') && (
                        <>
                          <button
                            onClick={() =>
                              router.push(
                                `/committee/teachers/${teacher._id}/edit`
                              )
                            }
                            className='text-blue-600 hover:text-blue-900'
                          >
                            Edit
                          </button>
                          {isCommitteeLeader && (
                            <button
                              onClick={() => handleDelete(teacher._id)}
                              className='text-red-600 hover:text-red-900'
                            >
                              Delete
                            </button>
                          )}
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
