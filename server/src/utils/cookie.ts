// import crypto from 'crypto'
// import { Response } from 'express'

// const COOKIE_SECRET = process.env.COOKIE_SECRET || 'default-secret-change-this'
// const ENCRYPTION_KEY =
//   process.env.COOKIE_ENCRYPTION_KEY || '12345678901234567890123456789012' // 32 chars
// const IV_LENGTH = 16

// // Encrypt data for cookie
// export const encryptData = (data: any): string => {
//   const iv = crypto.randomBytes(IV_LENGTH)
//   const cipher = crypto.createCipheriv(
//     'aes-256-cbc',
//     Buffer.from(ENCRYPTION_KEY, 'utf-8'),
//     iv
//   )
//   const encrypted = Buffer.concat([
//     cipher.update(JSON.stringify(data), 'utf8'),
//     cipher.final(),
//   ])
//   return iv.toString('hex') + ':' + encrypted.toString('hex')
// }

// // Decrypt data from cookie
// export const decryptData = (encryptedData: string): any => {
//   try {
//     const [ivHex, encryptedHex] = encryptedData.split(':')
//     if (!ivHex || !encryptedHex) return null

//     const iv = Buffer.from(ivHex, 'hex')
//     const encrypted = Buffer.from(encryptedHex, 'hex')
//     const decipher = crypto.createDecipheriv(
//       'aes-256-cbc',
//       Buffer.from(ENCRYPTION_KEY, 'utf-8'),
//       iv
//     )
//     const decrypted = Buffer.concat([
//       decipher.update(encrypted),
//       decipher.final(),
//     ])
//     return JSON.parse(decrypted.toString('utf8'))
//   } catch (error) {
//     return null
//   }
// }

// // Set authenticated cookie
// export const setAuthCookie = (res: Response, userData: any) => {
//   const payload = {
//     userId: userData._id,
//     role: userData.role,
//     email: userData.email,
//     name: userData.name,
//     loginTime: Date.now(),
//   }

//   const encrypted = encryptData(payload)

//   res.cookie('auth_token', encrypted, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//   })
// }

// // Clear auth cookie
// export const clearAuthCookie = (res: Response) => {
//   res.clearCookie('auth_token', {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//   })
// }

// // Verify and decrypt cookie data
// export const verifyCookie = (cookieData: string): any => {
//   if (!cookieData) return null
//   return decryptData(cookieData)
// }

import crypto from 'crypto'
import { Response } from 'express'

const ENCRYPTION_KEY =
  process.env.COOKIE_ENCRYPTION_KEY || '12345678901234567890123456789012'
const IV_LENGTH = 16

export const encryptData = (data: any): string => {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY, 'utf-8'),
    iv
  )
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(data), 'utf8'),
    cipher.final(),
  ])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export const decryptData = (encryptedData: string): any => {
  try {
    const [ivHex, encryptedHex] = encryptedData.split(':')
    if (!ivHex || !encryptedHex) return null

    const iv = Buffer.from(ivHex, 'hex')
    const encrypted = Buffer.from(encryptedHex, 'hex')
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY, 'utf-8'),
      iv
    )
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ])
    return JSON.parse(decrypted.toString('utf8'))
  } catch (error) {
    return null
  }
}

export const setAuthCookie = (res: Response, userData: any) => {
  const payload = {
    userId: userData._id.toString(),
    role: userData.role,
    email: userData.email,
    name: userData.name,
    loginTime: Date.now(),
  }

  const encrypted = encryptData(payload)

  res.cookie('auth_token', encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export const clearAuthCookie = (res: Response) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
}

export const verifyCookie = (cookieData: string): any => {
  if (!cookieData) return null
  return decryptData(cookieData)
}
