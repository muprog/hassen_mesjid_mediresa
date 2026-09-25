import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ReportSummaryBucket {
  amount: number
  count: number
}

export interface UnpaidSummary {
  outstanding: number
  studentsOwing: number
  fullyUnpaid: number
  partial: number
}
export interface UnpaidStudent {
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
  // status: 'pending' | 'partial'
  status: 'pending' | 'partial' | 'no-record'
}

export interface ReportSummary {
  today: ReportSummaryBucket
  thisMonth: ReportSummaryBucket
  thisYear: ReportSummaryBucket
}

export interface ReportPeriod {
  label: string
  year: number
  month: number
  collected: number
  count: number
  uniqueStudents: number
}

export interface ReportByDay {
  day: string
  amount: number
  count: number
}

export interface ReportPaymentMonth {
  label: string
  periodYear: number
  periodMonth: number
  amount: number
}

export interface ReportPaymentGroup {
  student: {
    _id: string
    code: string
    fullName: string
    haleqa: string
    section: string
  }
  dayKey: string
  method: string | null
  receivedBy: { _id: string; name?: string; fullName?: string } | null
  totalAmount: number
  forMonths: ReportPaymentMonth[]
  paymentIds: string[]
}

export interface ReportFilters {
  year: number
  month: number
  day?: string
  method?: string
  receivedBy?: string
}

interface ReportState {
  summary: ReportSummary | null
  period: ReportPeriod | null
  byDay: ReportByDay[]
  payments: ReportPaymentGroup[]
  filters: ReportFilters
  isLoading: boolean
  error: string | null
  unpaidSummary: UnpaidSummary | null
  unpaidPeriod: { label: string; year: number; month: number } | null
  unpaidList: UnpaidStudent[]
  unpaidLoading: boolean
}

const now = new Date()

const initialState: ReportState = {
  summary: null,
  period: null,
  byDay: [],
  payments: [],
  filters: {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  },
  isLoading: false,
  error: null,
  unpaidSummary: null,
  unpaidPeriod: null,
  unpaidList: [],
  unpaidLoading: false,
}

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    getPaymentReportStart: (
      state,
      action: PayloadAction<Partial<ReportFilters>>
    ) => {
      state.isLoading = true
      state.error = null
      state.filters = { ...state.filters, ...action.payload }
    },
    getPaymentReportSuccess: (
      state,
      action: PayloadAction<{
        summary: ReportSummary
        period: ReportPeriod
        byDay: ReportByDay[]
        payments: ReportPaymentGroup[]
      }>
    ) => {
      state.isLoading = false
      state.summary = action.payload.summary
      state.period = action.payload.period
      state.byDay = action.payload.byDay
      state.payments = action.payload.payments
    },
    getPaymentReportFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    clearReportError: (state) => {
      state.error = null
    },
    getUnpaidReportStart: (
      state,
      _action: PayloadAction<{ year: number; month: number }>
    ) => {
      state.unpaidLoading = true
      state.error = null
    },
    getUnpaidReportSuccess: (
      state,
      action: PayloadAction<{
        period: { label: string; year: number; month: number }
        summary: UnpaidSummary
        unpaid: UnpaidStudent[]
      }>
    ) => {
      state.unpaidLoading = false
      state.unpaidPeriod = action.payload.period
      state.unpaidSummary = action.payload.summary
      state.unpaidList = action.payload.unpaid
    },
    getUnpaidReportFailure: (state, action: PayloadAction<string>) => {
      state.unpaidLoading = false
      state.error = action.payload
    },
  },
})

export const {
  getPaymentReportStart,
  getPaymentReportSuccess,
  getPaymentReportFailure,
  clearReportError,
  getUnpaidReportStart,
  getUnpaidReportSuccess,
  getUnpaidReportFailure,
} = reportSlice.actions

export default reportSlice.reducer
