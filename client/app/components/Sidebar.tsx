'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { logoutStart } from '../store/slices/authSlice'
import { AppDispatch, RootState } from '../store/store'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const getMenuItems = () => {
    const role = user?.role

    if (role === 'committee_leader' || role === 'committee_member') {
      return [
        { path: '/committee/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/committee/students', label: 'Students', icon: '👨‍🎓' },
        { path: '/committee/teachers', label: 'Teachers', icon: '👨‍🏫' },
        { path: '/committee/committee', label: 'Committee', icon: '👥' },
        { path: '/committee/directors', label: 'Directors', icon: '👔' },
        { path: '/committee/payments', label: 'Payments', icon: '💰' },
        {
          path: '/committee/payment-types',
          label: 'Payment types',
          icon: '🏷️',
        },
        { path: '/committee/reports', label: 'Reports', icon: '📈' },
      ]
    }

    if (role === 'director') {
      return [
        { path: '/director/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/director/students', label: 'Students', icon: '👨‍🎓' },
        { path: '/director/teachers', label: 'Teachers', icon: '👨‍🏫' },
        { path: '/director/payments', label: 'Payments', icon: '💰' },
        { path: '/director/reports', label: 'Reports', icon: '📈' },
      ]
    }

    if (role === 'teacher') {
      return [
        { path: '/teacher/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/teacher/students', label: 'My Students', icon: '👨‍🎓' },
        { path: '/teacher/progress', label: 'Progress', icon: '📈' },
      ]
    }

    if (role === 'student') {
      return [
        { path: '/student/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/student/profile', label: 'My Profile', icon: '👤' },
        { path: '/student/progress', label: 'My Progress', icon: '📈' },
        { path: '/student/payments', label: 'My Payments', icon: '💰' },
      ]
    }

    return []
  }

  const getThemeColors = () => {
    const role = user?.role
    if (role === 'committee_leader' || role === 'committee_member') {
      return {
        bg: 'bg-indigo-900',
        hover: 'hover:bg-indigo-800',
        border: 'border-indigo-800',
        text: 'text-indigo-300',
        active: 'bg-indigo-800',
        panel: 'Committee Panel',
        mobileBg: 'bg-indigo-900',
        mobileHover: 'hover:bg-indigo-800',
      }
    }
    if (role === 'director') {
      return {
        bg: 'bg-blue-900',
        hover: 'hover:bg-blue-800',
        border: 'border-blue-800',
        text: 'text-blue-300',
        active: 'bg-blue-800',
        panel: 'Director Panel',
        mobileBg: 'bg-blue-900',
        mobileHover: 'hover:bg-blue-800',
      }
    }
    if (role === 'teacher') {
      return {
        bg: 'bg-green-900',
        hover: 'hover:bg-green-800',
        border: 'border-green-800',
        text: 'text-green-300',
        active: 'bg-green-800',
        panel: 'Teacher Panel',
        mobileBg: 'bg-green-900',
        mobileHover: 'hover:bg-green-800',
      }
    }
    if (role === 'student') {
      return {
        bg: 'bg-purple-900',
        hover: 'hover:bg-purple-800',
        border: 'border-purple-800',
        text: 'text-purple-300',
        active: 'bg-purple-800',
        panel: 'Student Panel',
        mobileBg: 'bg-purple-900',
        mobileHover: 'hover:bg-purple-800',
      }
    }
    return {
      bg: 'bg-gray-900',
      hover: 'hover:bg-gray-800',
      border: 'border-gray-800',
      text: 'text-gray-300',
      active: 'bg-gray-800',
      panel: 'Dashboard',
      mobileBg: 'bg-gray-900',
      mobileHover: 'hover:bg-gray-800',
    }
  }

  const menuItems = getMenuItems()
  const theme = getThemeColors()

  const handleLogout = () => {
    dispatch(logoutStart())
    router.push('/login')
  }

  if (!user) return null

  // Mobile Sidebar Toggle Button
  const MobileToggleButton = () => (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className='md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-50 transition-colors'
      aria-label='Toggle menu'
    >
      {isMobileMenuOpen ? (
        <svg
          className='w-6 h-6 text-gray-700'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      ) : (
        <svg
          className='w-6 h-6 text-gray-700'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M4 6h16M4 12h16M4 18h16'
          />
        </svg>
      )}
    </button>
  )

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <aside
      className={`hidden md:flex w-64 ${theme.bg} text-white flex-col min-h-screen sticky top-0`}
    >
      <div className={`p-6 border-b ${theme.border}`}>
        <h1 className='text-2xl font-bold'>Mediresa</h1>
        <p className={`text-sm ${theme.text} mt-1`}>{theme.panel}</p>
        <div className='mt-3 pt-3 border-t border-gray-700'>
          <p className='text-sm text-white font-medium'>{user.name}</p>
          <p className={`text-xs ${theme.text}`}>{user.email}</p>
        </div>
      </div>

      <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              pathname === item.path
                ? `${theme.active} text-white`
                : `${theme.hover} ${theme.text} hover:text-white`
            }`}
          >
            <span className='mr-3'>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className={`p-4 border-t ${theme.border}`}>
        <button
          onClick={handleLogout}
          className='w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors'
        >
          <span className='mr-2'>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  )

  // Mobile Sidebar (Overlay)
  const MobileSidebar = () => (
    <>
      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-72 ${
          theme.mobileBg
        } text-white transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className={`p-6 border-b ${theme.border}`}>
          <div className='flex justify-between items-center'>
            <h1 className='text-2xl font-bold'>Mediresa</h1>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className='p-2 hover:bg-gray-700 rounded-lg transition-colors'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
          <p className={`text-sm ${theme.text} mt-1`}>{theme.panel}</p>
          <div className='mt-3 pt-3 border-t border-gray-700'>
            <p className='text-sm text-white font-medium'>{user.name}</p>
            <p className={`text-xs ${theme.text}`}>{user.email}</p>
          </div>
        </div>

        <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                pathname === item.path
                  ? `${theme.active} text-white`
                  : `${theme.mobileHover} ${theme.text} hover:text-white`
              }`}
            >
              <span className='mr-3'>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={`p-4 border-t ${theme.border}`}>
          <button
            onClick={handleLogout}
            className='w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors'
          >
            <span className='mr-2'>🚪</span>
            Logout
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      <MobileToggleButton />
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}
