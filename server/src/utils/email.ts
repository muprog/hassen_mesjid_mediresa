// import nodemailer from 'nodemailer'

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: Number(process.env.SMTP_PORT ?? 587) === 465,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// })

// interface SendOtpArgs {
//   to: string
//   name: string
//   otp: string
//   expiresInMinutes: number
// }

// export async function sendOtpEmail({
//   to,
//   name,
//   otp,
//   expiresInMinutes,
// }: SendOtpArgs): Promise<void> {
//   console.log(process.env.SMTP_HOST)
//   console.log(process.env.SMTP_PORT)
//   console.log(process.env.SMTP_USER)
//   console.log(process.env.SMTP_PASS)
//   console.log(process.env.SMTP_FROM)
//   // console.log(process.env.)
//   const SMTP_HOST = process.env.SMTP_HOST
//   const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587)
//   const SMTP_USER = process.env.SMTP_USER
//   const SMTP_PASS = process.env.SMTP_PASS
//   const SMTP_FROM = process.env.SMTP_FROM ?? 'Mediresa <noreply@mediresa.local>'

//   if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
//     console.log('[email] SMTP not configured. OTP:', otp)
//     return
//   }

//   const html = `
//     <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 8px;">
//       <h2 style="color: #1f2937; margin-bottom: 8px;">Mediresa Password Reset</h2>
//       <p style="color: #4b5563;">Hi ${name || 'there'},</p>
//       <p style="color: #4b5563;">Your one-time code is:</p>
//       <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1e40af; text-align: center; padding: 16px; background: #fff; border-radius: 6px; border: 1px solid #e5e7eb;">${otp}</p>
//       <p style="color: #4b5563;">This code expires in ${expiresInMinutes} minutes.</p>
//       <p style="color: #6b7280; font-size: 12px;">If you didn't request this, ignore this email.</p>
//     </div>
//   `

//   await transporter.sendMail({
//     from: SMTP_FROM,
//     to,
//     subject: 'Mediresa Password Reset Code',
//     html,
//   })
// }

import nodemailer from 'nodemailer'

interface SendOtpArgs {
  to: string
  name: string
  otp: string
  expiresInMinutes: number
}

export async function sendOtpEmail({
  to,
  name,
  otp,
  expiresInMinutes,
}: SendOtpArgs): Promise<void> {
  const SMTP_HOST = process.env.SMTP_HOST
  const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587)
  const SMTP_USER = process.env.SMTP_USER
  const SMTP_PASS = process.env.SMTP_PASS
  const SMTP_FROM = process.env.SMTP_FROM ?? 'Mediresa <noreply@mediresa.local>'

  console.log('[email] sending via', SMTP_HOST, SMTP_PORT)

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log('[email] SMTP not configured. OTP:', otp)
    return
  }

  // Create the transporter at call time, so env vars are definitely loaded
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 8px;">
      <h2 style="color: #1f2937; margin-bottom: 8px;">Mediresa Password Reset</h2>
      <p style="color: #4b5563;">Hi ${name || 'there'},</p>
      <p style="color: #4b5563;">Your one-time code is:</p>
      <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1e40af; text-align: center; padding: 16px; background: #fff; border-radius: 6px; border: 1px solid #e5e7eb;">${otp}</p>
      <p style="color: #4b5563;">This code expires in ${expiresInMinutes} minutes.</p>
      <p style="color: #6b7280; font-size: 12px;">If you didn't request this, ignore this email.</p>
    </div>
  `

  await transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject: 'Mediresa Password Reset Code',
    html,
  })
}
