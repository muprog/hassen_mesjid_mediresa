'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, usePathname } from 'next/navigation'
import { checkAuthStart } from '../store/slices/authSlice'
import { AppDispatch, RootState } from '../store/store'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  )

  useEffect(() => {
    dispatch(checkAuthStart())
  }, [dispatch])

  // Role-based redirects
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const role = user.role
      const currentPath = pathname

      // Define role-based dashboard paths
      const roleDashboards: Record<string, string> = {
        committee_leader: '/committee-dashboard',
        committee_member: '/committee-member-dashboard',
        director: '/director-dashboard',
        teacher: '/teacher-dashboard',
        student: '/student-dashboard',
      }

      // If on login or register page, redirect to their dashboard
      if (currentPath === '/login' || currentPath === '/register') {
        router.push(roleDashboards[role] || '/')
      }

      // If on wrong dashboard for their role
      const isCommitteeLeaderDashboard = currentPath === '/committee-dashboard'
      const isCommitteeMemberDashboard =
        currentPath === '/committee-member-dashboard'
      const isDirectorDashboard = currentPath === '/director-dashboard'
      const isTeacherDashboard = currentPath === '/teacher-dashboard'
      const isStudentDashboard = currentPath === '/student-dashboard'

      if (
        role === 'committee_leader' &&
        !isCommitteeLeaderDashboard &&
        currentPath !== '/'
      ) {
        router.push('/committee-dashboard')
      } else if (
        role === 'committee_member' &&
        !isCommitteeMemberDashboard &&
        currentPath !== '/'
      ) {
        router.push('/committee-member-dashboard')
      } else if (
        role === 'director' &&
        !isDirectorDashboard &&
        currentPath !== '/'
      ) {
        router.push('/director-dashboard')
      } else if (
        role === 'teacher' &&
        !isTeacherDashboard &&
        currentPath !== '/'
      ) {
        router.push('/teacher-dashboard')
      } else if (
        role === 'student' &&
        !isStudentDashboard &&
        currentPath !== '/'
      ) {
        router.push('/student-dashboard')
      }
    }
  }, [isLoading, isAuthenticated, user, pathname, router])

  return { user, isAuthenticated, isLoading }
}
