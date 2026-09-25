import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { Payment } from '../models/Payment'
import { Student } from '../models/Student'

const MONTHS_FULL = [
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

interface PopulatedStudent {
  _id: Types.ObjectId
  code: string
  fullName: string
  haleqa: string
  section: string
}

interface PopulatedReceiver {
  _id: Types.ObjectId
  name?: string
  fullName?: string
  email?: string
}

interface LeanPayment {
  _id: Types.ObjectId
  student: PopulatedStudent
  amountPaid: number
  amountDue: number
  status: string
  method?: string | null
  paidDate?: Date | null
  periodYear: number
  periodMonth: number
  periodLabel: string
  receivedBy?: PopulatedReceiver | null
}

// ============================================
// GET PAYMENT REPORT
// ============================================
export const getPaymentReport = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { year, month, day, method, receivedBy } = req.query

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: 'year and month are required',
      })
    }

    const y = Number(year)
    const m = Number(month)
    if (Number.isNaN(y) || Number.isNaN(m) || m < 1 || m > 12) {
      return res.status(400).json({
        success: false,
        message: 'Invalid month/year',
      })
    }

    // Start/end of the selected calendar month (based on paidDate)
    const monthStart = new Date(y, m - 1, 1, 0, 0, 0, 0)
    const monthEnd = new Date(y, m, 1, 0, 0, 0, 0) // exclusive

    // Base filter for the payments list of the selected month
    const baseFilter: Record<string, unknown> = {
      isActive: true,
      status: { $in: ['paid', 'partial'] },
      amountPaid: { $gt: 0 },
      paidDate: { $gte: monthStart, $lt: monthEnd },
    }

    if (typeof day === 'string' && day) {
      const dayStart = new Date(`${day}T00:00:00.000Z`)
      const dayEnd = new Date(dayStart)
      dayEnd.setUTCDate(dayEnd.getUTCDate() + 1)
      if (!Number.isNaN(dayStart.getTime())) {
        baseFilter.paidDate = { $gte: dayStart, $lt: dayEnd }
      }
    }

    if (typeof method === 'string' && method) {
      baseFilter.method = method
    }
    if (typeof receivedBy === 'string' && receivedBy) {
      baseFilter.receivedBy = new Types.ObjectId(receivedBy)
    }

    const raw = await Payment.find(baseFilter)
      .populate('student', 'code fullName haleqa section')
      .populate('receivedBy', 'name fullName email')
      .sort({ paidDate: -1 })
      .lean<LeanPayment[]>()

    // ---- Period summary (selected month) ----
    const totalCollected = raw.reduce((s, p) => s + (p.amountPaid || 0), 0)
    const paymentsCount = raw.length
    const uniqueStudents = new Set(
      raw.map((p) => p.student?._id?.toString()).filter(Boolean)
    ).size

    // ---- Day-by-day breakdown (only days with payments) ----
    const byDayMap = new Map<string, { amount: number; count: number }>()
    for (const p of raw) {
      if (!p.paidDate) continue
      const d = new Date(p.paidDate)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(d.getDate()).padStart(2, '0')}`
      const entry = byDayMap.get(key) ?? { amount: 0, count: 0 }
      entry.amount += p.amountPaid || 0
      entry.count += 1
      byDayMap.set(key, entry)
    }
    const byDay = Array.from(byDayMap.entries())
      .map(([d, v]) => ({ day: d, amount: v.amount, count: v.count }))
      .sort((a, b) => (a.day < b.day ? -1 : 1))

    // ---- Group by student + day + method + receiver ----
    const groupKey = (p: LeanPayment): string => {
      const d = p.paidDate ? new Date(p.paidDate) : null
      const dayKey = d
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            '0'
          )}-${String(d.getDate()).padStart(2, '0')}`
        : 'unknown'
      return [
        p.student?._id?.toString() ?? 'nostudent',
        dayKey,
        p.method ?? 'nomethod',
        p.receivedBy?._id?.toString() ?? 'noreceiver',
      ].join('|')
    }

    const grouped = new Map<
      string,
      {
        student: PopulatedStudent
        dayKey: string
        method: string | null
        receivedBy: PopulatedReceiver | null
        totalAmount: number
        forMonths: {
          label: string
          periodYear: number
          periodMonth: number
          amount: number
        }[]
        paymentIds: string[]
      }
    >()

    for (const p of raw) {
      const key = groupKey(p)
      let g = grouped.get(key)
      if (!g) {
        const d = p.paidDate ? new Date(p.paidDate) : null
        const dayKey = d
          ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
              2,
              '0'
            )}-${String(d.getDate()).padStart(2, '0')}`
          : ''
        g = {
          student: p.student,
          dayKey,
          method: p.method ?? null,
          receivedBy: p.receivedBy ?? null,
          totalAmount: 0,
          forMonths: [],
          paymentIds: [],
        }
        grouped.set(key, g)
      }
      g.totalAmount += p.amountPaid || 0
      g.forMonths.push({
        label:
          p.periodLabel || `${MONTHS_FULL[p.periodMonth - 1]} ${p.periodYear}`,
        periodYear: p.periodYear,
        periodMonth: p.periodMonth,
        amount: p.amountPaid || 0,
      })
      g.paymentIds.push(p._id.toString())
    }

    const payments = Array.from(grouped.values()).sort((a, b) => {
      if (a.dayKey !== b.dayKey) return a.dayKey < b.dayKey ? 1 : -1
      return (a.student?.code ?? '').localeCompare(b.student?.code ?? '')
    })

    // ---- Top summary cards (today / this month / this year) ----
    const now = new Date()
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    )
    const todayEnd = new Date(todayStart)
    todayEnd.setDate(todayEnd.getDate() + 1)

    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    const thisYearStart = new Date(now.getFullYear(), 0, 1)
    const thisYearEnd = new Date(now.getFullYear() + 1, 0, 1)

    const summaryBase = {
      isActive: true,
      status: { $in: ['paid', 'partial'] },
      amountPaid: { $gt: 0 },
    }

    const [todayAgg, thisMonthAgg, thisYearAgg] = await Promise.all([
      Payment.aggregate([
        {
          $match: {
            ...summaryBase,
            paidDate: { $gte: todayStart, $lt: todayEnd },
          },
        },
        {
          $group: {
            _id: null,
            amount: { $sum: '$amountPaid' },
            count: { $sum: 1 },
          },
        },
      ]),
      Payment.aggregate([
        {
          $match: {
            ...summaryBase,
            paidDate: { $gte: thisMonthStart, $lt: thisMonthEnd },
          },
        },
        {
          $group: {
            _id: null,
            amount: { $sum: '$amountPaid' },
            count: { $sum: 1 },
          },
        },
      ]),
      Payment.aggregate([
        {
          $match: {
            ...summaryBase,
            paidDate: { $gte: thisYearStart, $lt: thisYearEnd },
          },
        },
        {
          $group: {
            _id: null,
            amount: { $sum: '$amountPaid' },
            count: { $sum: 1 },
          },
        },
      ]),
    ])

    const today = todayAgg[0] ?? { amount: 0, count: 0 }
    const thisMonth = thisMonthAgg[0] ?? { amount: 0, count: 0 }
    const thisYear = thisYearAgg[0] ?? { amount: 0, count: 0 }

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          today: { amount: today.amount, count: today.count },
          thisMonth: { amount: thisMonth.amount, count: thisMonth.count },
          thisYear: { amount: thisYear.amount, count: thisYear.count },
        },
        period: {
          label: `${MONTHS_FULL[m - 1]} ${y}`,
          year: y,
          month: m,
          collected: totalCollected,
          count: paymentsCount,
          uniqueStudents,
        },
        byDay,
        payments,
      },
    })
  } catch (err) {
    console.error('Get payment report error:', getErrorMessage(err))
    return res
      .status(500)
      .json({ success: false, message: 'Error fetching report' })
  }
}
// ============================================
// GET UNPAID STUDENTS FOR A PERIOD MONTH
// ============================================
export const getUnpaidReport = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { year, month, haleqa, section } = req.query

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: 'year and month are required',
      })
    }

    const y = Number(year)
    const m = Number(month)
    if (Number.isNaN(y) || Number.isNaN(m) || m < 1 || m > 12) {
      return res.status(400).json({
        success: false,
        message: 'Invalid month/year',
      })
    }

    // 1. All active paying students
    const studentFilter: Record<string, unknown> = {
      isActive: true,
      hasPayment: true,
      status: 'active',
    }
    if (typeof haleqa === 'string' && haleqa) studentFilter.haleqa = haleqa
    if (typeof section === 'string' && section) studentFilter.section = section

    const students = await Student.find(studentFilter)
      .select(
        'code fullName haleqa section hasPayment paymentType defaultAmount'
      )
      .populate('paymentType', 'name defaultAmount period')
      .sort({ code: 1 })
      .lean<
        Array<{
          _id: Types.ObjectId
          code: string
          fullName: string
          haleqa: string
          section: string
          hasPayment: boolean
          paymentType?: { _id: Types.ObjectId; defaultAmount: number } | null
          defaultAmount?: number
        }>
      >()

    if (students.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          period: {
            label: `${MONTHS_FULL[m - 1]} ${y}`,
            year: y,
            month: m,
          },
          summary: {
            outstanding: 0,
            studentsOwing: 0,
            fullyUnpaid: 0,
            partial: 0,
          },
          unpaid: [],
        },
      })
    }

    // 2. Existing payment records for this period
    const records = await Payment.find({
      isActive: true,
      periodYear: y,
      periodMonth: m,
      student: { $in: students.map((s) => s._id) },
    }).lean<
      Array<{
        _id: Types.ObjectId
        student: Types.ObjectId
        amountDue: number
        amountPaid: number
      }>
    >()

    // Map student -> record
    const recordByStudent = new Map<string, (typeof records)[number]>()
    for (const r of records) {
      recordByStudent.set(r.student.toString(), r)
    }

    // 3. Build unpaid list
    const unpaidRows: Array<{
      _id: string
      student: {
        _id: string
        code: string
        fullName: string
        haleqa: string
        section: string
      }
      amountDue: number
      amountPaid: number
      balance: number
      status: 'pending' | 'partial' | 'no-record'
    }> = []

    let outstanding = 0
    let fullyUnpaid = 0
    let partial = 0

    for (const s of students) {
      const rec = recordByStudent.get(s._id.toString())

      // Amount this student is expected to pay
      const expectedDue = s.defaultAmount ?? s.paymentType?.defaultAmount ?? 0

      const amountDue = rec ? rec.amountDue : expectedDue
      const amountPaid = rec ? rec.amountPaid : 0
      const balance = Math.max(amountDue - amountPaid, 0)

      // Fully paid → skip
      if (balance <= 0 && amountDue > 0) continue
      // If expected amount is 0 and there's no record, we can't decide — skip
      if (!rec && expectedDue <= 0) continue

      outstanding += balance

      let status: 'pending' | 'partial' | 'no-record' = 'pending'
      if (!rec) {
        status = 'no-record'
        fullyUnpaid += 1
      } else if (amountPaid > 0 && balance > 0) {
        status = 'partial'
        partial += 1
      } else {
        fullyUnpaid += 1
      }

      unpaidRows.push({
        _id: rec ? rec._id.toString() : `no-record-${s._id}`,
        student: {
          _id: s._id.toString(),
          code: s.code,
          fullName: s.fullName,
          haleqa: s.haleqa,
          section: s.section,
        },
        amountDue,
        amountPaid,
        balance,
        status,
      })
    }

    return res.status(200).json({
      success: true,
      data: {
        period: {
          label: `${MONTHS_FULL[m - 1]} ${y}`,
          year: y,
          month: m,
        },
        summary: {
          outstanding,
          studentsOwing: unpaidRows.length,
          fullyUnpaid,
          partial,
        },
        unpaid: unpaidRows,
      },
    })
  } catch (err) {
    console.error('Get unpaid report error:', getErrorMessage(err))
    return res
      .status(500)
      .json({ success: false, message: 'Error fetching unpaid report' })
  }
}
