// import { Student } from '../models/Student'
// import { Payment } from '../models/Payment'

// const MONTHS = [
//   'January',
//   'February',
//   'March',
//   'April',
//   'May',
//   'June',
//   'July',
//   'August',
//   'September',
//   'October',
//   'November',
//   'December',
// ]

// function buildLabel(year: number, month: number): string {
//   return `${MONTHS[month - 1]} ${year}`
// }

// interface GenerateResult {
//   created: number
//   skipped: number
//   periodLabel: string
// }

// /**
//  * Creates pending payment records for every paying student for the given month/year.
//  * Skips students with hasPayment=false.
//  * Skips if a record already exists (student + year + month).
//  * Students without a payment type get an "unassigned" pending record.
//  */
// export async function generatePendingPayments(
//   year: number,
//   month: number,
//   createdById: string | null
// ): Promise<GenerateResult> {
//   const periodLabel = buildLabel(year, month)

//   // Find all paying students
//   const students = await Student.find({
//     isActive: true,
//     hasPayment: true,
//     status: 'active',
//   }).select('_id paymentType defaultAmount')

//   // Find existing records for this period
//   const existing = await Payment.find({
//     periodYear: year,
//     periodMonth: month,
//     isActive: true,
//   }).select('student')

//   const existingStudentIds = new Set(existing.map((p) => p.student.toString()))

//   let created = 0
//   let skipped = 0

//   for (const s of students) {
//     if (existingStudentIds.has(s._id.toString())) {
//       skipped++
//       continue
//     }

//     const amountDue = s.defaultAmount ?? 0

//     await Payment.create({
//       student: s._id,
//       paymentType: s.paymentType ?? null,
//       typeName: '', // will be filled on first edit/payment
//       typeAmount: amountDue,
//       periodYear: year,
//       periodMonth: month,
//       periodLabel,
//       amountDue,
//       amountPaid: 0,
//       status: 'pending',
//       createdBy: createdById ?? s.createdBy,
//     })

//     created++
//   }

//   return { created, skipped, periodLabel }
// }

import { Student } from '../models/Student'
import { Payment } from '../models/Payment'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function buildLabel(year: number, month: number): string {
  return `${MONTHS[month - 1]} ${year}`
}

interface GenerateResult {
  created: number
  skipped: number
  periodLabel: string
}

export async function generatePendingPayments(
  year: number,
  month: number,
  createdById: string | null
): Promise<GenerateResult> {
  const periodLabel = buildLabel(year, month)

  const students = await Student.find({
    isActive: true,
    hasPayment: true,
    status: 'active',
  }).select('_id paymentType defaultAmount createdBy')

  const existing = await Payment.find({
    periodYear: year,
    periodMonth: month,
    isActive: true,
  }).select('student')

  const existingStudentIds = new Set(existing.map((p) => p.student.toString()))

  let created = 0
  let skipped = 0

  for (const s of students) {
    if (existingStudentIds.has(s._id.toString())) {
      skipped++
      continue
    }

    const amountDue = s.defaultAmount ?? 0

    await Payment.create({
      student: s._id,
      paymentType: s.paymentType ?? null,
      typeName: '',
      typeAmount: amountDue,
      periodYear: year,
      periodMonth: month,
      periodLabel,
      amountDue,
      amountPaid: 0,
      status: 'pending',
      createdBy: createdById ?? s.createdBy,
    })

    created++
  }

  return { created, skipped, periodLabel }
}
