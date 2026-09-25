'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import {
  getMembersStart,
  deleteMemberStart,
  toggleMemberStatusStart,
  setMemberFilters,
  clearMemberFilters,
} from '../../store/slices/committeeMemberSlice'
import { AppDispatch, RootState } from '../../store/store'

export default function CommitteeMembersPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { members, isLoading, filters } = useSelector(
    (state: RootState) => state.committeeMembers
  )
  const { user } = useSelector((state: RootState) => state.auth)
  const [searchTerm, setSearchTerm] = useState('')

  const isCommitteeLeader = user?.role === 'committee_leader'

  useEffect(() => {
    dispatch(getMembersStart({ filters }))
  }, [dispatch, filters])

  const handleSearch = () => {
    dispatch(setMemberFilters({ search: searchTerm }))
    dispatch(getMembersStart({ filters: { ...filters, search: searchTerm } }))
  }

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setMemberFilters({ [key]: value }))
    dispatch(getMembersStart({ filters: { ...filters, [key]: value } }))
  }

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const action = currentStatus === 'active' ? 'deactivate' : 'activate'
    if (window.confirm(`Are you sure you want to ${action} this member?`)) {
      dispatch(toggleMemberStatusStart(id))
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      dispatch(deleteMemberStart(id))
    }
  }

  const handleClearFilters = () => {
    dispatch(clearMemberFilters())
    setSearchTerm('')
    dispatch(getMembersStart({ filters: {} }))
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
          <h1 className='text-2xl font-bold text-gray-900'>
            Committee Members
          </h1>
          <p className='text-gray-600 mt-1'>
            Manage the Mediresa committee members
          </p>
        </div>
        {isCommitteeLeader && (
          <button
            onClick={() => router.push('/committee/committee/create')}
            className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap'
          >
            + Add Member
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

      {/* Members Table */}
      <div className='bg-white rounded-lg shadow overflow-hidden'>
        {isLoading ? (
          <div className='flex justify-center items-center py-12'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
          </div>
        ) : members.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500'>No committee members found</p>
            {isCommitteeLeader && (
              <button
                onClick={() => router.push('/committee/committee/create')}
                className='mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
              >
                Add your first committee member
              </button>
            )}
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Member
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
                {members.map((member) => (
                  <tr key={member._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {member.fullName}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {member.phone}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {member.email}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800'>
                        Committee Member
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          member.status
                        )}`}
                      >
                        {getStatusBadge(member.status)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
                      {isCommitteeLeader && (
                        <>
                          <button
                            onClick={() =>
                              handleToggleStatus(member._id, member.status)
                            }
                            className={`${
                              member.status === 'active'
                                ? 'text-yellow-600 hover:text-yellow-900'
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {member.status === 'active'
                              ? 'Deactivate'
                              : 'Activate'}
                          </button>

                          <button
                            onClick={() =>
                              router.push(
                                `/committee/students/${member._id}/edit`
                              )
                            }
                            className='text-blue-600 hover:text-blue-900'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(member._id)}
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
