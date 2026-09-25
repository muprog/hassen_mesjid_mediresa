// 'use client'

// import { useSelector } from 'react-redux'
// import { RootState } from '../store/store'
// import Sidebar from './Sidebar'

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const { isAuthenticated } = useSelector((state: RootState) => state.auth)

//   if (!isAuthenticated) {
//     return <>{children}</>
//   }

//   return (
//     <div className='flex min-h-screen bg-gray-50'>
//       <Sidebar />
//       <div className='flex-1 overflow-auto'>
//         <main className='p-6'>{children}</main>
//       </div>
//     </div>
//   )
// }

'use client'

import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import Sidebar from './Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  if (!isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />
      <div className='flex-1 w-full md:ml-0'>
        <main className='p-4 md:p-6 pt-20 md:pt-6'>{children}</main>
      </div>
    </div>
  )
}
