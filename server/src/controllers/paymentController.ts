// import { Request, Response } from 'express'
// import { Types } from 'mongoose'
// import { Payment, PaymentMethod } from '../models/Payment'
// import { Student } from '../models/Student'
// import { PaymentType } from '../models/PaymentType'
// import { generatePendingPayments } from '../utils/generatePendingPayments'

// const getErrorMessage = (err: unknown): string =>
//   err instanceof Error ? err.message : 'Unknown error'

// // ============================================
// // LIST PAYMENTS
// // ============================================
// export const getPayments = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const {
//       year,
//       month,
//       status,
//       search,
//       studentId,
//       haleqa,
//       section,
//       hasDue, // 'true' → only rows where amountPaid < amountDue
//     } = req.query

//     const filter: Record<string, unknown> = { isActive: true }

//     if (typeof year === 'string') filter.periodYear = Number(year)
//     if (typeof month === 'string') filter.periodMonth = Number(month)
//     if (typeof status === 'string') filter.status = status
//     if (typeof studentId === 'string')
//       filter.student = new Types.ObjectId(studentId)
//     if (hasDue === 'true') {
//       filter.$expr = { $lt: ['$amountPaid', '$amountDue'] }
//     }

//     // student-based filters (haleqa, section, name/code search)
//     if (haleqa || section || search) {
//       const studentFilter: Record<string, unknown> = {
//         isActive: true,
//         hasPayment: true,
//       }
//       if (typeof haleqa === 'string') studentFilter.haleqa = haleqa
//       if (typeof section === 'string') studentFilter.section = section
//       if (typeof search === 'string') {
//         studentFilter.$or = [
//           { fullName: { $regex: search, $options: 'i' } },
//           { code: { $regex: search, $options: 'i' } },
//         ]
//       }
//       const students = await Student.find(studentFilter).select('_id')
//       filter.student = { $in: students.map((s) => s._id) }
//     }

//     const payments = await Payment.find(filter)
//       .populate({
//         path: 'student',
//         select: 'code fullName haleqa section hasPayment',
//       })
//       .populate('paymentType', 'name defaultAmount period')
//       .populate('receivedBy', 'name fullName email')
//       .sort({ periodYear: -1, periodMonth: -1, createdAt: -1 })

//     return res.status(200).json({
//       success: true,
//       count: payments.length,
//       data: payments,
//     })
//   } catch (err) {
//     console.error('Get payments error:', getErrorMessage(err))
//     return res
//       .status(500)
//       .json({ success: false, message: 'Error fetching payments' })
//   }
// }

// // ============================================
// // GET BY ID
// // ============================================
// export const getPaymentById = async (
//   req: Request<{ id: string }>,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const payment = await Payment.findById(req.params.id)
//       .populate('student', 'code fullName haleqa section')
//       .populate('paymentType', 'name defaultAmount period')
//       .populate('receivedBy', 'name fullName email')

//     if (!payment) {
//       return res
//         .status(404)
//         .json({ success: false, message: 'Payment not found' })
//     }
//     return res.status(200).json({ success: true, data: payment })
//   } catch (err) {
//     console.error('Get payment error:', getErrorMessage(err))
//     return res
//       .status(500)
//       .json({ success: false, message: 'Error fetching payment' })
//   }
// }

// // ============================================
// // MARK PAID (one-click)
// // ============================================
// export const markPaymentPaid = async (
//   req: Request<{ id: string }>,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const payment = await Payment.findById(req.params.id)
//     if (!payment) {
//       return res
//         .status(404)
//         .json({ success: false, message: 'Payment not found' })
//     }

//     // If unassigned (no type/amount), we can't mark paid directly
//     if (!payment.paymentType || payment.amountDue <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Set a payment type and amount first',
//       })
//     }

//     payment.amountPaid = payment.amountDue
//     payment.status = 'paid'
//     payment.paidDate = new Date()
//     payment.method = payment.method ?? 'cash'
//     payment.receivedBy = req.user?._id ?? null
//     await payment.save()

//     return res.status(200).json({
//       success: true,
//       message: 'Payment marked as paid',
//       data: payment,
//     })
//   } catch (err) {
//     console.error('Mark paid error:', getErrorMessage(err))
//     return res
//       .status(500)
//       .json({ success: false, message: 'Error marking paid' })
//   }
// }

// // ============================================
// // UNDO PAID
// // ============================================
// export const undoPayment = async (
//   req: Request<{ id: string }>,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const payment = await Payment.findById(req.params.id)
//     if (!payment) {
//       return res
//         .status(404)
//         .json({ success: false, message: 'Payment not found' })
//     }

//     payment.amountPaid = 0
//     payment.status = 'pending'
//     payment.paidDate = null
//     payment.method = null
//     payment.receivedBy = null
//     await payment.save()

//     return res.status(200).json({
//       success: true,
//       message: 'Payment reverted to pending',
//       data: payment,
//     })
//   } catch (err) {
//     console.error('Undo payment error:', getErrorMessage(err))
//     return res
//       .status(500)
//       .json({ success: false, message: 'Error undoing payment' })
//   }
// }

// // ============================================
// // EDIT PAYMENT (type, amount due, amount paid, method, note)
// // ============================================
// interface EditPaymentBody {
//   paymentType?: string | null
//   amountDue?: number | string
//   amountPaid?: number | string
//   method?: PaymentMethod | null
//   note?: string
// }

// export const updatePayment = async (
//   req: Request<{ id: string }, {}, EditPaymentBody>,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const payment = await Payment.findById(req.params.id)
//     if (!payment) {
//       return res
//         .status(404)
//         .json({ success: false, message: 'Payment not found' })
//     }

//     const { paymentType, amountDue, amountPaid, method, note } = req.body

//     // If a payment type is being set, snapshot its name and default amount
//     if (paymentType) {
//       const pt = await PaymentType.findById(paymentType)
//       if (!pt) {
//         return res
//           .status(400)
//           .json({ success: false, message: 'Invalid payment type' })
//       }
//       payment.paymentType = pt._id
//       payment.typeName = pt.name
//       payment.typeAmount = pt.defaultAmount

//       // If amountDue not provided, use the type's default
//       if (
//         amountDue === undefined &&
//         (!payment.amountDue || payment.amountDue === 0)
//       ) {
//         payment.amountDue = pt.defaultAmount
//       }

//       // Update the student's default type + amount
//       await Student.findByIdAndUpdate(payment.student, {
//         paymentType: pt._id,
//         defaultAmount: pt.defaultAmount,
//       })
//     }

//     if (amountDue !== undefined) payment.amountDue = Number(amountDue)
//     if (amountPaid !== undefined) payment.amountPaid = Number(amountPaid)
//     if (method !== undefined) payment.method = method
//     if (note !== undefined) payment.note = note

//     // Recompute status
//     if (payment.amountPaid >= payment.amountDue && payment.amountDue > 0) {
//       payment.status = 'paid'
//       if (!payment.paidDate) payment.paidDate = new Date()
//       if (!payment.receivedBy) payment.receivedBy = req.user?._id ?? null
//     } else if (payment.amountPaid > 0) {
//       payment.status = 'partial'
//       payment.paidDate = payment.paidDate ?? new Date()
//       payment.receivedBy = payment.receivedBy ?? req.user?._id ?? null
//     } else {
//       payment.status = 'pending'
//       payment.paidDate = null
//       payment.receivedBy = null
//     }

//     await payment.save()

//     return res.status(200).json({
//       success: true,
//       message: 'Payment updated successfully',
//       data: payment,
//     })
//   } catch (err) {
//     console.error('Update payment error:', getErrorMessage(err))
//     return res
//       .status(500)
//       .json({ success: false, message: 'Error updating payment' })
//   }
// }

// // ============================================
// // GENERATE THIS MONTH (manual trigger)
// // ============================================
// export const generateThisMonth = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const now = new Date()
//     const result = await generatePendingPayments(
//       now.getFullYear(),
//       now.getMonth() + 1,
//       req.user?._id?.toString() ?? null
//     )
//     return res.status(200).json({
//       success: true,
//       message: `${result.created} pending records created for ${result.periodLabel}`,
//       data: result,
//     })
//   } catch (err) {
//     console.error('Generate this month error:', getErrorMessage(err))
//     return res
//       .status(500)
//       .json({ success: false, message: 'Error generating pending records' })
//   }
// }

// // ============================================
// // STATS
// // ============================================
// export const getPaymentStats = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const now = new Date()
//     const year = now.getFullYear()
//     const month = now.getMonth() + 1

//     // This month
//     const thisMonth = await Payment.find({
//       isActive: true,
//       periodYear: year,
//       periodMonth: month,
//     })

//     const collectedThisMonth = thisMonth.reduce(
//       (sum, p) => sum + p.amountPaid,
//       0
//     )
//     const pendingThisMonth = thisMonth.reduce(
//       (sum, p) => sum + Math.max(p.amountDue - p.amountPaid, 0),
//       0
//     )

//     // All-time outstanding
//     const all = await Payment.find({ isActive: true })
//     const totalOutstanding = all.reduce(
//       (sum, p) => sum + Math.max(p.amountDue - p.amountPaid, 0),
//       0
//     )

//     // Students in arrears (have at least one unpaid record)
//     const arrearsStudents = new Set(
//       all
//         .filter((p) => p.amountPaid < p.amountDue)
//         .map((p) => p.student.toString())
//     )

//     return res.status(200).json({
//       success: true,
//       data: {
//         collectedThisMonth,
//         pendingThisMonth,
//         totalOutstanding,
//         studentsInArrears: arrearsStudents.size,
//         currentPeriod: `${MONTHS[month - 1]} ${year}`,
//       },
//     })
//   } catch (err) {
//     console.error('Payment stats error:', getErrorMessage(err))
//     return res
//       .status(500)
//       .json({ success: false, message: 'Error fetching stats' })
//   }
// }

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

// // ============================================
// // GET GRID (student rows + payments in a month range)
// // ============================================
// export const getPaymentsGrid = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const { fromYear, fromMonth, toYear, toMonth, search, haleqa, section } =
//       req.query

//     if (!fromYear || !fromMonth || !toYear || !toMonth) {
//       return res.status(400).json({
//         success: false,
//         message: 'fromYear, fromMonth, toYear, toMonth are required',
//       })
//     }

//     const fy = Number(fromYear)
//     const fm = Number(fromMonth)
//     const ty = Number(toYear)
//     const tm = Number(toMonth)

//     if (
//       Number.isNaN(fy) ||
//       Number.isNaN(fm) ||
//       Number.isNaN(ty) ||
//       Number.isNaN(tm) ||
//       fm < 1 ||
//       fm > 12 ||
//       tm < 1 ||
//       tm > 12
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid month/year values',
//       })
//     }

//     // Student filter — only paying, active
//     const studentFilter: Record<string, unknown> = {
//       isActive: true,
//       hasPayment: true,
//       status: 'active',
//     }
//     if (typeof haleqa === 'string' && haleqa) studentFilter.haleqa = haleqa
//     if (typeof section === 'string' && section) studentFilter.section = section
//     if (typeof search === 'string' && search) {
//       studentFilter.$or = [
//         { fullName: { $regex: search, $options: 'i' } },
//         { code: { $regex: search, $options: 'i' } },
//         { fatherPhone: { $regex: search, $options: 'i' } },
//         { motherPhone: { $regex: search, $options: 'i' } },
//       ]
//     }

//     const students = await Student.find(studentFilter)
//       .select(
//         'code fullName fatherPhone motherPhone haleqa section hasPayment paymentType defaultAmount createdAt'
//       )
//       .populate('paymentType', 'name defaultAmount period')
//       .sort({ code: 1 })

//     // Payments in the range
//     // Convert (year, month) to a sortable numeric key: year*100 + month
//     const fromKey = fy * 100 + fm
//     const toKey = ty * 100 + tm

//     // Mongo query: match payments whose key falls in [fromKey, toKey]
//     const paymentFilter = {
//       isActive: true,
//       student: { $in: students.map((s) => s._id) },
//       $expr: {
//         $and: [
//           {
//             $gte: [
//               { $add: [{ $multiply: ['$periodYear', 100] }, '$periodMonth'] },
//               fromKey,
//             ],
//           },
//           {
//             $lte: [
//               { $add: [{ $multiply: ['$periodYear', 100] }, '$periodMonth'] },
//               toKey,
//             ],
//           },
//         ],
//       },
//     }

//     const payments = await Payment.find(paymentFilter)
//       .populate('paymentType', 'name defaultAmount period')
//       .populate('receivedBy', 'name fullName email')
//       .lean()

//     return res.status(200).json({
//       success: true,
//       data: {
//         students,
//         payments,
//         range: {
//           fromYear: fy,
//           fromMonth: fm,
//           toYear: ty,
//           toMonth: tm,
//         },
//       },
//     })
//   } catch (err) {
//     console.error('Get payments grid error:', getErrorMessage(err))
//     return res.status(500).json({
//       success: false,
//       message: 'Error fetching payments grid',
//     })
//   }
// }

import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { Payment, PaymentMethod } from '../models/Payment'
import { Student } from '../models/Student'
import { PaymentType } from '../models/PaymentType'
import { generatePendingPayments } from '../utils/generatePendingPayments'

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

const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : 'Unknown error'

// ============================================
// LIST PAYMENTS (legacy — kept for edit page)
// ============================================
export const getPayments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { year, month, status, search, studentId, haleqa, section } =
      req.query

    const filter: Record<string, unknown> = { isActive: true }

    if (typeof year === 'string') filter.periodYear = Number(year)
    if (typeof month === 'string') filter.periodMonth = Number(month)
    if (typeof status === 'string') filter.status = status
    if (typeof studentId === 'string')
      filter.student = new Types.ObjectId(studentId)

    if (haleqa || section || search) {
      const studentFilter: Record<string, unknown> = {
        isActive: true,
        hasPayment: true,
      }
      if (typeof haleqa === 'string') studentFilter.haleqa = haleqa
      if (typeof section === 'string') studentFilter.section = section
      if (typeof search === 'string') {
        studentFilter.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
        ]
      }
      const students = await Student.find(studentFilter).select('_id')
      filter.student = { $in: students.map((s) => s._id) }
    }

    const payments = await Payment.find(filter)
      .populate({
        path: 'student',
        select:
          'code fullName fatherPhone motherPhone haleqa section hasPayment',
      })
      .populate('paymentType', 'name defaultAmount period')
      .populate('receivedBy', 'name fullName email')
      .sort({ periodYear: -1, periodMonth: -1, createdAt: -1 })

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    })
  } catch (err) {
    console.error('Get payments error:', getErrorMessage(err))
    return res
      .status(500)
      .json({ success: false, message: 'Error fetching payments' })
  }
}

// ============================================
// GET BY ID
// ============================================
export const getPaymentById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate(
        'student',
        'code fullName fatherPhone motherPhone haleqa section'
      )
      .populate('paymentType', 'name defaultAmount period')
      .populate('receivedBy', 'name fullName email')

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: 'Payment not found' })
    }
    return res.status(200).json({ success: true, data: payment })
  } catch (err) {
    console.error('Get payment error:', getErrorMessage(err))
    return res
      .status(500)
      .json({ success: false, message: 'Error fetching payment' })
  }
}

// ============================================
// MARK PAID
// ============================================
export const markPaymentPaid = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const payment = await Payment.findById(req.params.id)
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: 'Payment not found' })
    }

    if (!payment.paymentType || payment.amountDue <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Set a payment type and amount first',
      })
    }

    payment.amountPaid = payment.amountDue
    payment.status = 'paid'
    payment.paidDate = new Date()
    payment.method = payment.method ?? 'cash'
    payment.receivedBy = req.user?._id ?? null
    await payment.save()

    const populated = await Payment.findById(payment._id)
      .populate({
        path: 'student',
        select:
          'code fullName fatherPhone motherPhone haleqa section hasPayment',
      })
      .populate('paymentType', 'name defaultAmount period')
      .populate('receivedBy', 'name fullName email')

    return res.status(200).json({
      success: true,
      message: 'Payment marked as paid',
      data: populated,
    })
  } catch (err) {
    console.error('Mark paid error:', getErrorMessage(err))
    return res
      .status(500)
      .json({ success: false, message: 'Error marking paid' })
  }
}

// ============================================
// UNDO PAID
// ============================================
export const undoPayment = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const payment = await Payment.findById(req.params.id)
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: 'Payment not found' })
    }

    payment.amountPaid = 0
    payment.status = 'pending'
    payment.paidDate = null
    payment.method = null
    payment.receivedBy = null
    await payment.save()

    const populated = await Payment.findById(payment._id)
      .populate({
        path: 'student',
        select:
          'code fullName fatherPhone motherPhone haleqa section hasPayment',
      })
      .populate('paymentType', 'name defaultAmount period')
      .populate('receivedBy', 'name fullName email')

    return res.status(200).json({
      success: true,
      message: 'Payment reverted to pending',
      data: populated,
    })
  } catch (err) {
    console.error('Undo payment error:', getErrorMessage(err))
    return res
      .status(500)
      .json({ success: false, message: 'Error undoing payment' })
  }
}

// ============================================
// EDIT PAYMENT
// ============================================
interface EditPaymentBody {
  paymentType?: string | null
  amountDue?: number | string
  amountPaid?: number | string
  method?: PaymentMethod | null
  note?: string
}

export const updatePayment = async (
  req: Request<{ id: string }, {}, EditPaymentBody>,
  res: Response
): Promise<Response> => {
  try {
    const payment = await Payment.findById(req.params.id)
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: 'Payment not found' })
    }

    const { paymentType, amountDue, amountPaid, method, note } = req.body

    if (paymentType) {
      const pt = await PaymentType.findById(paymentType)
      if (!pt) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid payment type' })
      }
      payment.paymentType = pt._id
      payment.typeName = pt.name
      payment.typeAmount = pt.defaultAmount

      if (
        amountDue === undefined &&
        (!payment.amountDue || payment.amountDue === 0)
      ) {
        payment.amountDue = pt.defaultAmount
      }

      await Student.findByIdAndUpdate(payment.student, {
        paymentType: pt._id,
        defaultAmount: pt.defaultAmount,
      })
    }

    if (amountDue !== undefined) payment.amountDue = Number(amountDue)
    if (amountPaid !== undefined) payment.amountPaid = Number(amountPaid)
    if (method !== undefined) payment.method = method
    if (note !== undefined) payment.note = note

    if (payment.amountPaid >= payment.amountDue && payment.amountDue > 0) {
      payment.status = 'paid'
      if (!payment.paidDate) payment.paidDate = new Date()
      if (!payment.receivedBy) payment.receivedBy = req.user?._id ?? null
    } else if (payment.amountPaid > 0) {
      payment.status = 'partial'
      payment.paidDate = payment.paidDate ?? new Date()
      payment.receivedBy = payment.receivedBy ?? req.user?._id ?? null
    } else {
      payment.status = 'pending'
      payment.paidDate = null
      payment.receivedBy = null
    }

    await payment.save()

    const populated = await Payment.findById(payment._id)
      .populate({
        path: 'student',
        select:
          'code fullName fatherPhone motherPhone haleqa section hasPayment',
      })
      .populate('paymentType', 'name defaultAmount period')
      .populate('receivedBy', 'name fullName email')

    return res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: populated,
    })
  } catch (err) {
    console.error('Update payment error:', getErrorMessage(err))
    return res
      .status(500)
      .json({ success: false, message: 'Error updating payment' })
  }
}

// ============================================
// GENERATE THIS MONTH
// ============================================
export const generateThisMonth = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const now = new Date()
    const result = await generatePendingPayments(
      now.getFullYear(),
      now.getMonth() + 1,
      req.user?._id?.toString() ?? null
    )
    return res.status(200).json({
      success: true,
      message: `${result.created} pending records created for ${result.periodLabel}`,
      data: result,
    })
  } catch (err) {
    console.error('Generate this month error:', getErrorMessage(err))
    return res.status(500).json({
      success: false,
      message: 'Error generating pending records',
    })
  }
}

// ============================================
// STATS
// ============================================
export const getPaymentStats = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    const thisMonth = await Payment.find({
      isActive: true,
      periodYear: year,
      periodMonth: month,
    })

    const collectedThisMonth = thisMonth.reduce(
      (sum, p) => sum + p.amountPaid,
      0
    )
    const pendingThisMonth = thisMonth.reduce(
      (sum, p) => sum + Math.max(p.amountDue - p.amountPaid, 0),
      0
    )

    const all = await Payment.find({ isActive: true })
    const totalOutstanding = all.reduce(
      (sum, p) => sum + Math.max(p.amountDue - p.amountPaid, 0),
      0
    )

    const arrearsStudents = new Set(
      all
        .filter((p) => p.amountPaid < p.amountDue)
        .map((p) => p.student.toString())
    )

    return res.status(200).json({
      success: true,
      data: {
        collectedThisMonth,
        pendingThisMonth,
        totalOutstanding,
        studentsInArrears: arrearsStudents.size,
        currentPeriod: `${MONTHS[month - 1]} ${year}`,
      },
    })
  } catch (err) {
    console.error('Payment stats error:', getErrorMessage(err))
    return res
      .status(500)
      .json({ success: false, message: 'Error fetching stats' })
  }
}

// ============================================
// GRID
// ============================================
export const getPaymentsGrid = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { fromYear, fromMonth, toYear, toMonth, search, haleqa, section } =
      req.query

    if (!fromYear || !fromMonth || !toYear || !toMonth) {
      return res.status(400).json({
        success: false,
        message: 'fromYear, fromMonth, toYear, toMonth are required',
      })
    }

    const fy = Number(fromYear)
    const fm = Number(fromMonth)
    const ty = Number(toYear)
    const tm = Number(toMonth)

    if (
      Number.isNaN(fy) ||
      Number.isNaN(fm) ||
      Number.isNaN(ty) ||
      Number.isNaN(tm) ||
      fm < 1 ||
      fm > 12 ||
      tm < 1 ||
      tm > 12
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid month/year values' })
    }

    const studentFilter: Record<string, unknown> = {
      isActive: true,
      hasPayment: true,
      status: 'active',
    }
    if (typeof haleqa === 'string' && haleqa) studentFilter.haleqa = haleqa
    if (typeof section === 'string' && section) studentFilter.section = section
    if (typeof search === 'string' && search) {
      studentFilter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { fatherPhone: { $regex: search, $options: 'i' } },
        { motherPhone: { $regex: search, $options: 'i' } },
      ]
    }

    const students = await Student.find(studentFilter)
      .select(
        'code fullName fatherPhone motherPhone haleqa section hasPayment paymentType defaultAmount createdAt'
      )
      .populate('paymentType', 'name defaultAmount period')
      .sort({ code: 1 })
      .lean()

    const fromKey = fy * 100 + fm
    const toKey = ty * 100 + tm

    const paymentFilter = {
      isActive: true,
      student: { $in: students.map((s) => s._id) },
      $expr: {
        $and: [
          {
            $gte: [
              { $add: [{ $multiply: ['$periodYear', 100] }, '$periodMonth'] },
              fromKey,
            ],
          },
          {
            $lte: [
              { $add: [{ $multiply: ['$periodYear', 100] }, '$periodMonth'] },
              toKey,
            ],
          },
        ],
      },
    }

    const payments = await Payment.find(paymentFilter)
      .populate('paymentType', 'name defaultAmount period')
      .populate('receivedBy', 'name fullName email')
      .lean()

    return res.status(200).json({
      success: true,
      data: {
        students,
        payments,
        range: { fromYear: fy, fromMonth: fm, toYear: ty, toMonth: tm },
      },
    })
  } catch (err) {
    console.error('Get payments grid error:', getErrorMessage(err))
    return res
      .status(500)
      .json({ success: false, message: 'Error fetching payments grid' })
  }
}
// ============================================
// CREATE OR GET PAYMENT FOR STUDENT + MONTH
// ============================================
interface CreatePaymentBody {
  studentId: string
  periodYear: number | string
  periodMonth: number | string
  markPaid?: boolean
  paymentType?: string | null
  amountDue?: number | string
  method?: PaymentMethod | null
  note?: string
}

export const createPaymentForMonth = async (
  req: Request<{}, {}, CreatePaymentBody>,
  res: Response
): Promise<Response> => {
  try {
    const {
      studentId,
      periodYear,
      periodMonth,
      markPaid,
      paymentType,
      amountDue,
      method,
      note,
    } = req.body

    if (!studentId || !periodYear || !periodMonth) {
      return res.status(400).json({
        success: false,
        message: 'studentId, periodYear, periodMonth are required',
      })
    }

    const student = await Student.findById(studentId)
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: 'Student not found' })
    }

    if (!student.hasPayment) {
      return res.status(400).json({
        success: false,
        message: 'This student does not pay fees',
      })
    }

    const year = Number(periodYear)
    const month = Number(periodMonth)
    if (Number.isNaN(year) || Number.isNaN(month) || month < 1 || month > 12) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid month/year' })
    }

    // Reject if already exists
    const existing = await Payment.findOne({
      student: student._id,
      periodYear: year,
      periodMonth: month,
      isActive: true,
    })
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A payment for this month already exists',
      })
    }

    // Resolve type + amount
    let resolvedType = student.paymentType ?? null
    let resolvedTypeName = ''
    let resolvedTypeAmount = student.defaultAmount ?? 0
    let resolvedAmountDue = student.defaultAmount ?? 0

    if (paymentType) {
      const pt = await PaymentType.findById(paymentType)
      if (!pt) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid payment type' })
      }
      resolvedType = pt._id
      resolvedTypeName = pt.name
      resolvedTypeAmount = pt.defaultAmount
      resolvedAmountDue = pt.defaultAmount
    } else if (student.paymentType) {
      const pt = await PaymentType.findById(student.paymentType)
      if (pt) {
        resolvedTypeName = pt.name
        resolvedTypeAmount = pt.defaultAmount
        if (!resolvedAmountDue) resolvedAmountDue = pt.defaultAmount
      }
    }

    if (amountDue !== undefined) resolvedAmountDue = Number(amountDue)

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
    const periodLabel = `${MONTHS[month - 1]} ${year}`

    const isPaid = !!markPaid && resolvedAmountDue > 0

    const payment = await Payment.create({
      student: student._id,
      paymentType: resolvedType,
      typeName: resolvedTypeName,
      typeAmount: resolvedTypeAmount,
      periodYear: year,
      periodMonth: month,
      periodLabel,
      amountDue: resolvedAmountDue,
      amountPaid: isPaid ? resolvedAmountDue : 0,
      status: isPaid ? 'paid' : 'pending',
      paidDate: isPaid ? new Date() : null,
      method: isPaid ? method ?? 'cash' : method ?? null,
      receivedBy: isPaid ? req.user?._id ?? null : null,
      note: note ?? '',
      createdBy: req.user?._id,
    })

    // If a type was explicitly chosen, update the student's default
    if (paymentType && resolvedType) {
      await Student.findByIdAndUpdate(student._id, {
        paymentType: resolvedType,
        defaultAmount: resolvedTypeAmount,
      })
    }

    const populated = await Payment.findById(payment._id)
      .populate({
        path: 'student',
        select:
          'code fullName fatherPhone motherPhone haleqa section hasPayment',
      })
      .populate('paymentType', 'name defaultAmount period')
      .populate('receivedBy', 'name fullName email')

    return res.status(201).json({
      success: true,
      message: isPaid
        ? 'Payment created and marked paid'
        : 'Pending payment created',
      data: populated,
    })
  } catch (err) {
    console.error('Create payment for month error:', getErrorMessage(err))
    return res
      .status(500)
      .json({ success: false, message: 'Error creating payment' })
  }
}

// ============================================
// GENERATE PENDING FOR A SPECIFIC MONTH
// ============================================
export const generateForMonth = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { year, month } = req.body as {
      year?: number | string
      month?: number | string
    }

    let y: number
    let m: number

    if (year && month) {
      y = Number(year)
      m = Number(month)
      if (Number.isNaN(y) || Number.isNaN(m) || m < 1 || m > 12) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid month/year' })
      }
    } else {
      const now = new Date()
      y = now.getFullYear()
      m = now.getMonth() + 1
    }

    const result = await generatePendingPayments(
      y,
      m,
      req.user?._id?.toString() ?? null
    )
    return res.status(200).json({
      success: true,
      message: `${result.created} pending records created for ${result.periodLabel}`,
      data: result,
    })
  } catch (err) {
    console.error('Generate for month error:', getErrorMessage(err))
    return res
      .status(500)
      .json({ success: false, message: 'Error generating pending records' })
  }
}
