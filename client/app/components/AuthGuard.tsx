// 'use client'

// import { useEffect, useRef, useState } from 'react'
// import { usePathname, useRouter } from 'next/navigation'
// import { useSelector, useDispatch } from 'react-redux'
// import type { RootState, AppDispatch } from '../store/store'
// import { checkAuthStart } from '../store/slices/authSlice'

// interface AuthGuardProps {
//   children: React.ReactNode
//   allowedRoles?: string[]
// }

// export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
//   const dispatch = useDispatch<AppDispatch>()
//   const { isAuthenticated, user, isLoading, error } = useSelector(
//     (state: RootState) => state.auth
//   )
//   const pathname = usePathname()
//   const router = useRouter()
//   const hasDispatched = useRef(false)
//   const [isAuthChecked, setIsAuthChecked] = useState(false)

//   // Check auth status on mount
//   useEffect(() => {
//     if (!hasDispatched.current) {
//       hasDispatched.current = true
//       dispatch(checkAuthStart())
//     }
//   }, [dispatch])

//   // Mark auth as checked once the loading finishes
//   useEffect(() => {
//     if (!isLoading) {
//       setIsAuthChecked(true)
//     }
//   }, [isLoading])

//   // Handle redirects - ONLY after auth check is complete
//   useEffect(() => {
//     // Wait until the initial auth check has finished
//     if (!isAuthChecked) return
//     if (isLoading) return

//     // Public routes
//     const publicRoutes = ['/login', '/register', '/unauthorized']
//     if (publicRoutes.includes(pathname)) {
//       if (isAuthenticated && user) {
//         const roleRoutes: Record<string, string> = {
//           committee_leader: '/committee/dashboard',
//           committee_member: '/committee/dashboard',
//           director: '/director/dashboard',
//           teacher: '/teacher/dashboard',
//           student: '/student/dashboard',
//         }
//         const dashboardRoute = roleRoutes[user.role]
//         if (dashboardRoute && pathname !== dashboardRoute) {
//           router.replace(dashboardRoute)
//         }
//       }
//       return
//     }

//     // Not authenticated -> go to login
//     if (!isAuthenticated) {
//       router.replace('/login')
//       return
//     }

//     // Role check
//     if (isAuthenticated && user && allowedRoles && allowedRoles.length > 0) {
//       if (!allowedRoles.includes(user.role)) {
//         router.replace('/unauthorized')
//         return
//       }
//     }

//     // Only redirect to dashboard if the user is on the WRONG role's section
//     // (e.g. a director trying to open /committee/students)
//     if (isAuthenticated && user) {
//       const roleRoutes: Record<string, string> = {
//         committee_leader: '/committee/dashboard',
//         committee_member: '/committee/dashboard',
//         director: '/director/dashboard',
//         teacher: '/teacher/dashboard',
//         student: '/student/dashboard',
//       }

//       const dashboardRoute = roleRoutes[user.role]

//       // Determine the correct section prefix for the role
//       let rolePrefix = ''
//       if (
//         user.role === 'committee_leader' ||
//         user.role === 'committee_member'
//       ) {
//         rolePrefix = 'committee'
//       } else if (user.role === 'director') {
//         rolePrefix = 'director'
//       } else if (user.role === 'teacher') {
//         rolePrefix = 'teacher'
//       } else if (user.role === 'student') {
//         rolePrefix = 'student'
//       }

//       // Only redirect if the user is in a completely different role's section
//       if (
//         dashboardRoute &&
//         rolePrefix &&
//         !pathname.startsWith(`/${rolePrefix}`)
//       ) {
//         router.replace(dashboardRoute)
//       }
//     }
//   }, [
//     isAuthChecked,
//     isLoading,
//     isAuthenticated,
//     user,
//     pathname,
//     router,
//     allowedRoles,
//   ])

//   // Public routes - no auth needed
//   const publicRoutes = ['/login', '/register', '/unauthorized']
//   if (publicRoutes.includes(pathname)) {
//     return <>{children}</>
//   }

//   // Show loading while checking auth (don't render children until checked)
//   if (!isAuthChecked || isLoading) {
//     return (
//       <div className='min-h-screen flex items-center justify-center bg-gray-50'>
//         <div className='text-center'>
//           <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto'></div>
//           <p className='mt-4 text-gray-600 text-lg'>Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   // If error occurred
//   if (error) {
//     return (
//       <div className='min-h-screen flex items-center justify-center bg-gray-50'>
//         <div className='text-center max-w-md p-8 bg-white rounded-lg shadow'>
//           <div className='text-red-600 text-5xl mb-4'>⚠️</div>
//           <h2 className='text-xl font-bold text-gray-900 mb-2'>
//             Something went wrong
//           </h2>
//           <p className='text-gray-600 mb-4'>{error}</p>
//           <button
//             onClick={() => {
//               hasDispatched.current = false
//               setIsAuthChecked(false)
//               dispatch(checkAuthStart())
//             }}
//             className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     )
//   }

//   // Not authenticated - return null (will redirect)
//   if (!isAuthenticated) {
//     return null
//   }

//   return <>{children}</>
// }

'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { checkAuthStart } from '../store/slices/authSlice'

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, user, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  )
  const pathname = usePathname()
  const router = useRouter()
  const hasDispatched = useRef(false)
  const [isAuthChecked, setIsAuthChecked] = useState(false)

  // Check auth status on mount
  useEffect(() => {
    if (!hasDispatched.current) {
      hasDispatched.current = true
      dispatch(checkAuthStart())
    }
  }, [dispatch])

  // Mark auth as checked once the loading finishes
  useEffect(() => {
    if (!isLoading) {
      setIsAuthChecked(true)
    }
  }, [isLoading])

  // Handle redirects - ONLY after auth check is complete
  useEffect(() => {
    // Wait until the initial auth check has finished
    if (!isAuthChecked) return
    if (isLoading) return

    // Public routes
    const publicRoutes = ['/login', '/register', '/unauthorized']
    if (publicRoutes.includes(pathname)) {
      if (isAuthenticated && user) {
        const roleRoutes: Record<string, string> = {
          committee_leader: '/committee/dashboard',
          committee_member: '/committee/dashboard',
          director: '/director/dashboard',
          teacher: '/teacher/dashboard',
          student: '/student/dashboard',
        }
        const dashboardRoute = roleRoutes[user.role]
        if (dashboardRoute && pathname !== dashboardRoute) {
          router.replace(dashboardRoute)
        }
      }
      return
    }

    // Not authenticated -> go to login
    if (!isAuthenticated) {
      router.replace('/login')
      return
    }

    // Role check
    if (isAuthenticated && user && allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        router.replace('/unauthorized')
        return
      }
    }

    // Only redirect to dashboard if the user is on the WRONG role's section
    // (e.g. a director trying to open /committee/students)
    if (isAuthenticated && user) {
      const roleRoutes: Record<string, string> = {
        committee_leader: '/committee/dashboard',
        committee_member: '/committee/dashboard',
        director: '/director/dashboard',
        teacher: '/teacher/dashboard',
        student: '/student/dashboard',
      }

      const dashboardRoute = roleRoutes[user.role]

      // Determine the correct section prefix for the role
      let rolePrefix = ''
      if (
        user.role === 'committee_leader' ||
        user.role === 'committee_member'
      ) {
        rolePrefix = 'committee'
      } else if (user.role === 'director') {
        rolePrefix = 'director'
      } else if (user.role === 'teacher') {
        rolePrefix = 'teacher'
      } else if (user.role === 'student') {
        rolePrefix = 'student'
      }

      // Only redirect if the user is in a completely different role's section
      if (
        dashboardRoute &&
        rolePrefix &&
        !pathname.startsWith(`/${rolePrefix}`)
      ) {
        router.replace(dashboardRoute)
      }
    }
  }, [
    isAuthChecked,
    isLoading,
    isAuthenticated,
    user,
    pathname,
    router,
    allowedRoles,
  ])

  // Public routes - no auth needed
  const publicRoutes = ['/login', '/register', '/unauthorized']
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>
  }

  // Show loading while checking auth (don't render children until checked)
  if (!isAuthChecked || isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto'></div>
          <p className='mt-4 text-gray-600 text-lg'>Loading...</p>
        </div>
      </div>
    )
  }

  // If error occurred
  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center max-w-md p-8 bg-white rounded-lg shadow'>
          <div className='text-red-600 text-5xl mb-4'>⚠️</div>
          <h2 className='text-xl font-bold text-gray-900 mb-2'>
            Something went wrong
          </h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button
            onClick={() => {
              hasDispatched.current = false
              setIsAuthChecked(false)
              dispatch(checkAuthStart())
            }}
            className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Not authenticated - return null (will redirect)
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
