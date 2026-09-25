'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import {
  getStudentsStart,
  setFilters,
  clearFilters,
} from '../../store/slices/studentSlice'
import { AppDispatch, RootState } from '../../store/store'

export default function DirectorStudentsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { students, isLoading, filters } = useSelector(
    (state: RootState) => state.students
  )
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(getStudentsStart({ filters }))
  }, [dispatch, filters])

  const handleSearch = () => {
    dispatch(setFilters({ search: searchTerm }))
    dispatch(getStudentsStart({ filters: { ...filters, search: searchTerm } }))
  }

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setFilters({ [key]: value }))
    dispatch(getStudentsStart({ filters: { ...filters, [key]: value } }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
    setSearchTerm('')
    dispatch(getStudentsStart({ filters: {} }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'graduated':
        return 'bg-blue-100 text-blue-800'
      case 'transferred':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Students</h1>
          <p className='text-gray-600 mt-1'>Manage students</p>
        </div>
        <button
          onClick={() => router.push('/director/students/create')}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap'
        >
          + Register Student
        </button>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-lg shadow p-4 mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Search
            </label>
            <div className='flex'>
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder='Search by name or code...'
                className='flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              />
              <button
                onClick={handleSearch}
                className='px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700'
              >
                Search
              </button>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Haleqa
            </label>
            <input
              type='text'
              value={filters.haleqa || ''}
              onChange={(e) => handleFilterChange('haleqa', e.target.value)}
              placeholder='Filter by haleqa...'
              className='w-full px-3 py-2 border border-gray-300 rounded-md'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Section
            </label>
            <select
              value={filters.section || ''}
              onChange={(e) => handleFilterChange('section', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md'
            >
              <option value=''>All</option>
              <option value='A'>A</option>
              <option value='B'>B</option>
              <option value='C'>C</option>
              <option value='D'>D</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Status
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md'
            >
              <option value=''>All</option>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
              <option value='graduated'>Graduated</option>
              <option value='transferred'>Transferred</option>
            </select>
          </div>
        </div>

        <div className='mt-4 flex justify-end'>
          <button
            onClick={handleClearFilters}
            className='text-sm text-gray-600 hover:text-gray-900'
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className='bg-white rounded-lg shadow overflow-hidden'>
        {isLoading ? (
          <div className='flex justify-center items-center py-12'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          </div>
        ) : students.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500'>No students found</p>
            <button
              onClick={() => router.push('/director/students/create')}
              className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Register your first student
            </button>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Code
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Age
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Gender
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Haleqa
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Section
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
                {students.map((student) => (
                  <tr key={student._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700'>
                      {student.code}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {student.fullName}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {student.age}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          student.gender === 'male'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-pink-100 text-pink-800'
                        }`}
                      >
                        {student.gender}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {student.haleqa}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {student.section}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          student.status
                        )}`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
                      <button
                        onClick={() =>
                          router.push(`/director/students/${student._id}/edit`)
                        }
                        className='text-blue-600 hover:text-blue-900'
                      >
                        Edit
                      </button>
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
