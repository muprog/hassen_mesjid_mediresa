'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import {
  getDirectorsStart,
  deleteDirectorStart,
  toggleDirectorStatusStart,
  setDirectorFilters,
  clearDirectorFilters,
} from '../../store/slices/directorSlice'
import { AppDispatch, RootState } from '../../store/store'

export default function DirectorsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { directors, isLoading, filters } = useSelector(
    (state: RootState) => state.directors
  )
  const { user } = useSelector((state: RootState) => state.auth)
  const [searchTerm, setSearchTerm] = useState('')

  const isCommitteeLeader = user?.role === 'committee_leader'

  useEffect(() => {
    dispatch(getDirectorsStart({ filters }))
  }, [dispatch, filters])

  const handleSearch = () => {
    dispatch(setDirectorFilters({ search: searchTerm }))
    dispatch(getDirectorsStart({ filters: { ...filters, search: searchTerm } }))
  }

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setDirectorFilters({ [key]: value }))
    dispatch(getDirectorsStart({ filters: { ...filters, [key]: value } }))
  }

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const action = currentStatus === 'active' ? 'deactivate' : 'activate'
    if (window.confirm(`Are you sure you want to ${action} this director?`)) {
      dispatch(toggleDirectorStatusStart(id))
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this director?')) {
      dispatch(deleteDirectorStart(id))
    }
  }

  const handleClearFilters = () => {
    dispatch(clearDirectorFilters())
    setSearchTerm('')
    dispatch(getDirectorsStart({ filters: {} }))
  }

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800'
  }

  const getStatusBadge = (status: string) => {
    return status === 'active' ? 'Active' : 'Inactive'
  }

  return (
    <div>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Directors</h1>
          <p className='text-gray-600 mt-1'>Manage the Mediresa directors</p>
        </div>
        {isCommitteeLeader && (
          <button
            onClick={() => router.push('/committee/directors/create')}
            className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap'
          >
            + Add Director
          </button>
        )}
      </div>

      {/* Filters */}
      <div className='bg-white rounded-lg shadow p-4 mb-6'>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
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
                placeholder='Search by name, email...'
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

      {/* Directors Table */}
      <div className='bg-white rounded-lg shadow overflow-hidden'>
        {isLoading ? (
          <div className='flex justify-center items-center py-12'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
          </div>
        ) : directors.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500'>No directors found</p>
            {isCommitteeLeader && (
              <button
                onClick={() => router.push('/committee/directors/create')}
                className='mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
              >
                Add your first director
              </button>
            )}
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Director
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Phone
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Email
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Role
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
                {directors.map((director) => (
                  <tr key={director._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {director.fullName}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {director.phone}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {director.email}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800'>
                        Director
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          director.status
                        )}`}
                      >
                        {getStatusBadge(director.status)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
                      {isCommitteeLeader && (
                        <>
                          <button
                            onClick={() =>
                              handleToggleStatus(director._id, director.status)
                            }
                            className={`${
                              director.status === 'active'
                                ? 'text-yellow-600 hover:text-yellow-900'
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {director.status === 'active'
                              ? 'Deactivate'
                              : 'Activate'}
                          </button>
                          <button
                            onClick={() =>
                              router.push(
                                `/committee/students/${director._id}/edit`
                              )
                            }
                            className='text-blue-600 hover:text-blue-900'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(director._id)}
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
