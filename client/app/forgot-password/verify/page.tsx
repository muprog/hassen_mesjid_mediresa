// 'use client'

// import { useState, useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useRouter } from 'next/navigation'
// import {
//   verifyOtpStart,
//   forgotPasswordStart,
//   clearError,
// } from '../../store/slices/authSlice'
// import { AppDispatch, RootState } from '../../store/store'

// export default function VerifyOtpPage() {
//   const dispatch = useDispatch<AppDispatch>()
//   const router = useRouter()
//   const { isLoading, error, forgotEmail, resetToken } = useSelector(
//     (s: RootState) => s.auth
//   )

//   const [otp, setOtp] = useState('')
//   const [resendCooldown, setResendCooldown] = useState(0)

//   useEffect(() => {
//     if (!forgotEmail) {
//       router.replace('/forgot-password')
//     }
//   }, [forgotEmail, router])

//   useEffect(() => {
//     if (resetToken) {
//       router.push('/forgot-password/reset')
//     }
//   }, [resetToken, router])

//   useEffect(() => {
//     if (error) {
//       const t = setTimeout(() => dispatch(clearError()), 5000)
//       return () => clearTimeout(t)
//     }
//   }, [error, dispatch])

//   useEffect(() => {
//     if (resendCooldown <= 0) return
//     const t = setInterval(
//       () => setResendCooldown((c) => Math.max(0, c - 1)),
//       1000
//     )
//     return () => clearInterval(t)
//   }, [resendCooldown])

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!forgotEmail) return
//     dispatch(verifyOtpStart({ email: forgotEmail, otp }))
//   }

//   const handleResend = () => {
//     if (!forgotEmail || resendCooldown > 0) return
//     dispatch(forgotPasswordStart({ email: forgotEmail }))
//     setResendCooldown(60)
//   }

//   return (
//     <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4'>
//       <div className='max-w-md w-full bg-white p-8 rounded-xl shadow-2xl'>
//         <div className='text-center mb-6'>
//           <div className='mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center'>
//             <span className='text-2xl'>📩</span>
//           </div>
//           <h2 className='mt-4 text-2xl font-bold text-gray-900'>
//             Enter Verification Code
//           </h2>
//           <p className='mt-2 text-sm text-gray-600'>
//             We sent a 6-digit code to{' '}
//             <span className='font-medium'>{forgotEmail}</span>
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className='space-y-4'>
//           {error && (
//             <div className='p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600'>
//               {error}
//             </div>
//           )}

//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               Verification Code
//             </label>
//             <input
//               type='text'
//               inputMode='numeric'
//               maxLength={6}
//               required
//               value={otp}
//               onChange={(e) =>
//                 setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
//               }
//               className='mt-1 block w-full px-3 py-3 text-center text-2xl tracking-[0.5em] font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//               placeholder='000000'
//             />
//           </div>

//           <button
//             type='submit'
//             disabled={isLoading || otp.length !== 6}
//             className='w-full py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium'
//           >
//             {isLoading ? 'Verifying...' : 'Verify Code'}
//           </button>

//           <div className='text-center space-y-2'>
//             <button
//               type='button'
//               onClick={handleResend}
//               disabled={resendCooldown > 0 || isLoading}
//               className='text-sm text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
//             >
//               {resendCooldown > 0
//                 ? `Resend in ${resendCooldown}s`
//                 : 'Resend Code'}
//             </button>
//             <div>
//               <button
//                 type='button'
//                 onClick={() => router.push('/forgot-password')}
//                 className='text-xs text-gray-500 hover:text-gray-700'
//               >
//                 Use a different email
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import {
  verifyOtpStart,
  forgotPasswordStart,
  clearError,
} from '../../store/slices/authSlice'
import { AppDispatch, RootState } from '../../store/store'

export default function VerifyOtpPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { isLoading, error, forgotEmail, resetToken } = useSelector(
    (s: RootState) => s.auth
  )

  const [otp, setOtp] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!ready) return
    if (!forgotEmail) {
      router.replace('/forgot-password')
    }
  }, [ready, forgotEmail, router])

  useEffect(() => {
    if (!ready) return
    if (resetToken) {
      router.push('/forgot-password/reset')
    }
  }, [ready, resetToken, router])

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => dispatch(clearError()), 5000)
      return () => clearTimeout(t)
    }
  }, [error, dispatch])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setInterval(
      () => setResendCooldown((c) => Math.max(0, c - 1)),
      1000
    )
    return () => clearInterval(t)
  }, [resendCooldown])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotEmail) return
    if (otp.length !== 6) return
    dispatch(verifyOtpStart({ email: forgotEmail, otp }))
  }

  const handleResend = () => {
    if (!forgotEmail || resendCooldown > 0) return
    dispatch(forgotPasswordStart({ email: forgotEmail }))
    setResendCooldown(60)
  }

  if (!ready) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600'></div>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4'>
      <div className='max-w-md w-full bg-white p-8 rounded-xl shadow-2xl'>
        <div className='text-center mb-6'>
          <div className='mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center'>
            <span className='text-2xl'>📩</span>
          </div>
          <h2 className='mt-4 text-2xl font-bold text-gray-900'>
            Enter Verification Code
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            We sent a 6-digit code to{' '}
            <span className='font-medium'>{forgotEmail}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {error && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600'>
              {error}
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Verification Code
            </label>
            <input
              type='text'
              inputMode='numeric'
              maxLength={6}
              required
              autoFocus
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              className='mt-1 block w-full px-3 py-3 text-center text-2xl tracking-[0.5em] font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='000000'
            />
          </div>

          <button
            type='submit'
            disabled={isLoading || otp.length !== 6}
            className='w-full py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium'
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>

          <div className='text-center space-y-2'>
            <button
              type='button'
              onClick={handleResend}
              disabled={resendCooldown > 0 || isLoading}
              className='text-sm text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : 'Resend Code'}
            </button>
            <div>
              <button
                type='button'
                onClick={() => router.push('/forgot-password')}
                className='text-xs text-gray-500 hover:text-gray-700'
              >
                Use a different email
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
