// import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'waived'
// export type PaymentMethod = 'cash' | 'bank' | 'mobile_money' | 'other'

// export interface Payment {
//   _id: string
//   student: {
//     _id: string
//     code: string
//     fullName: string
//     haleqa: string
//     section: string
//     hasPayment: boolean
//   }
//   paymentType?: {
//     _id: string
//     name: string
//     defaultAmount: number
//     period: string
//   } | null
//   typeName: string
//   typeAmount: number
//   periodYear: number
//   periodMonth: number
//   periodLabel: string
//   amountDue: number
//   amountPaid: number
//   status: PaymentStatus
//   paidDate?: string | null
//   method?: PaymentMethod | null
//   receivedBy?: {
//     _id: string
//     name?: string
//     fullName?: string
//     email: string
//   } | null
//   note?: string
//   createdAt: string
//   updatedAt: string
// }

// interface PaymentStats {
//   collectedThisMonth: number
//   pendingThisMonth: number
//   totalOutstanding: number
//   studentsInArrears: number
//   currentPeriod: string
// }

// interface PaymentState {
//   payments: Payment[]
//   selectedPayment: Payment | null
//   stats: PaymentStats | null
//   isLoading: boolean
//   error: string | null
//   successMessage: string | null
//   filters: {
//     year?: string
//     month?: string
//     status?: string
//     search?: string
//     haleqa?: string
//     section?: string
//     hasDue?: string
//   }
// }

// const initialState: PaymentState = {
//   payments: [],
//   selectedPayment: null,
//   stats: null,
//   isLoading: false,
//   error: null,
//   successMessage: null,
//   filters: {},
// }

// const paymentSlice = createSlice({
//   name: 'payments',
//   initialState,
//   reducers: {
//     getPaymentsStart: (
//       state,
//       action: PayloadAction<{ filters?: PaymentState['filters'] }>
//     ) => {
//       state.isLoading = true
//       state.error = null
//       if (action.payload?.filters) state.filters = action.payload.filters
//     },
//     getPaymentsSuccess: (state, action: PayloadAction<Payment[]>) => {
//       state.isLoading = false
//       state.payments = action.payload
//     },
//     getPaymentsFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     getPaymentStatsStart: (state) => {
//       state.isLoading = true
//     },
//     getPaymentStatsSuccess: (state, action: PayloadAction<PaymentStats>) => {
//       state.isLoading = false
//       state.stats = action.payload
//     },
//     getPaymentStatsFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     markPaidStart: (state, _action: PayloadAction<string>) => {
//       state.isLoading = true
//       state.error = null
//       state.successMessage = null
//     },
//     markPaidSuccess: (state, action: PayloadAction<Payment>) => {
//       state.isLoading = false
//       const idx = state.payments.findIndex((p) => p._id === action.payload._id)
//       if (idx !== -1)
//         state.payments[idx] = { ...state.payments[idx], ...action.payload }
//       state.successMessage = 'Marked as paid'
//     },
//     markPaidFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     undoPaymentStart: (state, _action: PayloadAction<string>) => {
//       state.isLoading = true
//       state.error = null
//     },
//     undoPaymentSuccess: (state, action: PayloadAction<Payment>) => {
//       state.isLoading = false
//       const idx = state.payments.findIndex((p) => p._id === action.payload._id)
//       if (idx !== -1)
//         state.payments[idx] = { ...state.payments[idx], ...action.payload }
//       state.successMessage = 'Payment reverted'
//     },
//     undoPaymentFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     updatePaymentStart: (
//       state,
//       _action: PayloadAction<{ id: string; data: unknown }>
//     ) => {
//       state.isLoading = true
//       state.error = null
//     },
//     updatePaymentSuccess: (state, action: PayloadAction<Payment>) => {
//       state.isLoading = false
//       const idx = state.payments.findIndex((p) => p._id === action.payload._id)
//       if (idx !== -1)
//         state.payments[idx] = { ...state.payments[idx], ...action.payload }
//       state.selectedPayment = action.payload
//       state.successMessage = 'Payment updated'
//     },
//     updatePaymentFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     generateMonthStart: (state) => {
//       state.isLoading = true
//       state.error = null
//     },
//     generateMonthSuccess: (
//       state,
//       action: PayloadAction<{
//         created: number
//         skipped: number
//         periodLabel: string
//       }>
//     ) => {
//       state.isLoading = false
//       state.successMessage = `${action.payload.created} records created for ${action.payload.periodLabel}`
//     },
//     generateMonthFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     clearPaymentError: (state) => {
//       state.error = null
//     },
//     clearPaymentSuccess: (state) => {
//       state.successMessage = null
//     },
//     clearSelectedPayment: (state) => {
//       state.selectedPayment = null
//     },
//   },
// })

// export const {
//   getPaymentsStart,
//   getPaymentsSuccess,
//   getPaymentsFailure,
//   getPaymentStatsStart,
//   getPaymentStatsSuccess,
//   getPaymentStatsFailure,
//   markPaidStart,
//   markPaidSuccess,
//   markPaidFailure,
//   undoPaymentStart,
//   undoPaymentSuccess,
//   undoPaymentFailure,
//   updatePaymentStart,
//   updatePaymentSuccess,
//   updatePaymentFailure,
//   generateMonthStart,
//   generateMonthSuccess,
//   generateMonthFailure,
//   clearPaymentError,
//   clearPaymentSuccess,
//   clearSelectedPayment,
// } = paymentSlice.actions

// export default paymentSlice.reducer

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'waived'
export type PaymentMethod = 'cash' | 'bank' | 'mobile_money' | 'other'

export interface GridStudent {
  _id: string
  code: string
  fullName: string
  fatherPhone?: string
  motherPhone?: string
  haleqa: string
  section: string
  hasPayment: boolean
  paymentType?: {
    _id: string
    name: string
    defaultAmount: number
    period: string
  } | null
  defaultAmount?: number
  createdAt: string
}

export interface GridPayment {
  _id: string
  student: string
  paymentType?: {
    _id: string
    name: string
    defaultAmount: number
    period: string
  } | null
  typeName: string
  typeAmount: number
  periodYear: number
  periodMonth: number
  periodLabel: string
  amountDue: number
  amountPaid: number
  status: PaymentStatus
  paidDate?: string | null
  method?: PaymentMethod | null
  receivedBy?: {
    _id: string
    name?: string
    fullName?: string
    email: string
  } | null
  note?: string
}

export interface Payment {
  _id: string
  student: {
    _id: string
    code: string
    fullName: string
    fatherPhone?: string
    motherPhone?: string
    haleqa: string
    section: string
    hasPayment: boolean
  }
  paymentType?: {
    _id: string
    name: string
    defaultAmount: number
    period: string
  } | null
  typeName: string
  typeAmount: number
  periodYear: number
  periodMonth: number
  periodLabel: string
  amountDue: number
  amountPaid: number
  status: PaymentStatus
  paidDate?: string | null
  method?: PaymentMethod | null
  receivedBy?: {
    _id: string
    name?: string
    fullName?: string
    email: string
  } | null
  note?: string
  createdAt: string
  updatedAt: string
}

export interface PaymentStats {
  collectedThisMonth: number
  pendingThisMonth: number
  totalOutstanding: number
  studentsInArrears: number
  currentPeriod: string
}

export interface ColumnWindow {
  fromYear: number
  fromMonth: number
  toYear: number
  toMonth: number
}

interface PaymentFilters {
  search?: string
  haleqa?: string
  section?: string
}

interface PaymentState {
  gridStudents: GridStudent[]
  gridPayments: GridPayment[]
  window: ColumnWindow
  payments: Payment[]
  selectedPayment: Payment | null
  stats: PaymentStats | null
  isLoading: boolean
  error: string | null
  successMessage: string | null
  filters: PaymentFilters
}

// -- helpers -------------------------------------------------------------

function shiftMonth(
  year: number,
  month: number,
  delta: number
): { year: number; month: number } {
  const total = year * 12 + (month - 1) + delta
  return { year: Math.floor(total / 12), month: (total % 12) + 1 }
}

function shiftWindowBy(w: ColumnWindow, delta: number): ColumnWindow {
  const f = shiftMonth(w.fromYear, w.fromMonth, delta)
  const t = shiftMonth(w.toYear, w.toMonth, delta)
  return {
    fromYear: f.year,
    fromMonth: f.month,
    toYear: t.year,
    toMonth: t.month,
  }
}

// function buildInitialWindow(): ColumnWindow {
//   if (typeof window !== 'undefined') {
//     try {
//       const raw = localStorage.getItem('payments_window')
//       if (raw) return JSON.parse(raw) as ColumnWindow
//     } catch {
//       /* ignore */
//     }
//   }
//   const now = new Date()
//   const y = now.getFullYear()
//   const m = now.getMonth() + 1
//   let fromY = y
//   let fromM = m - 2
//   if (fromM <= 0) {
//     fromM += 12
//     fromY -= 1
//   }
//   let toY = y
//   let toM = m + 8
//   while (toM > 8) {
//     toM -= 8
//     toY += 8
//   }
//   return { fromYear: fromY, fromMonth: fromM, toYear: toY, toMonth: toM }
// }
function buildInitialWindow(): ColumnWindow {
  if (typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem('payments_window')
      if (raw) {
        const parsed = JSON.parse(raw) as ColumnWindow
        // sanity check
        if (
          parsed.fromYear &&
          parsed.fromMonth &&
          parsed.toYear &&
          parsed.toMonth
        ) {
          return parsed
        }
      }
    } catch {
      /* ignore */
    }
  }

  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth() + 1

  let fromY = y
  let fromM = m - 2
  if (fromM <= 0) {
    fromM += 12
    fromY -= 1
  }

  let toY = y
  let toM = m + 8
  while (toM > 12) {
    toM -= 12
    toY += 1
  }

  return { fromYear: fromY, fromMonth: fromM, toYear: toY, toMonth: toM }
}

const initialState: PaymentState = {
  gridStudents: [],
  gridPayments: [],
  window: buildInitialWindow(),
  payments: [],
  selectedPayment: null,
  stats: null,
  isLoading: false,
  error: null,
  successMessage: null,
  filters: {},
}

// -- slice ---------------------------------------------------------------

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    // GRID --------------------------------------------------------------
    getGridStart: (
      state,
      action: PayloadAction<{
        window?: ColumnWindow
        filters?: PaymentFilters
      }>
    ) => {
      state.isLoading = true
      state.error = null
      // if (action.payload.window) state.window = action.payload.window
      // if (action.payload.filters) state.filters = action.payload.filters
    },
    getGridSuccess: (
      state,
      action: PayloadAction<{
        students: GridStudent[]
        payments: GridPayment[]
      }>
    ) => {
      state.isLoading = false
      state.gridStudents = action.payload.students
      state.gridPayments = action.payload.payments
    },
    getGridFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // WINDOW ------------------------------------------------------------
    shiftWindow: (state, action: PayloadAction<number>) => {
      state.window = shiftWindowBy(state.window, action.payload)
    },
    setWindow: (state, action: PayloadAction<ColumnWindow>) => {
      state.window = action.payload
    },

    // FILTERS -----------------------------------------------------------
    setPaymentFilters: (state, action: PayloadAction<PaymentFilters>) => {
      state.filters = { ...state.filters, ...action.payload }
    },

    // LEGACY LIST -------------------------------------------------------
    getPaymentsStart: (
      state,
      action: PayloadAction<{ filters?: Record<string, string> }>
    ) => {
      state.isLoading = true
      state.error = null
      // legacy filter — reuse as needed
      if (action.payload.filters) {
        state.filters = {
          search: action.payload.filters.search,
          haleqa: action.payload.filters.haleqa,
          section: action.payload.filters.section,
        }
      }
    },
    getPaymentsSuccess: (state, action: PayloadAction<Payment[]>) => {
      state.isLoading = false
      state.payments = action.payload
    },
    getPaymentsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // STATS -------------------------------------------------------------
    getPaymentStatsStart: (state) => {
      state.isLoading = true
    },
    getPaymentStatsSuccess: (state, action: PayloadAction<PaymentStats>) => {
      state.isLoading = false
      state.stats = action.payload
    },
    getPaymentStatsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // MARK PAID ---------------------------------------------------------
    markPaidStart: (state, _action: PayloadAction<string>) => {
      state.isLoading = true
      state.error = null
      state.successMessage = null
    },
    markPaidSuccess: (state, action: PayloadAction<Payment>) => {
      state.isLoading = false
      // patch grid
      const gIdx = state.gridPayments.findIndex(
        (p) => p._id === action.payload._id
      )
      if (gIdx !== -1) {
        state.gridPayments[gIdx] = {
          ...state.gridPayments[gIdx],
          amountPaid: action.payload.amountPaid,
          status: action.payload.status,
          paidDate: action.payload.paidDate,
          method: action.payload.method,
          receivedBy: action.payload.receivedBy,
          paymentType: action.payload.paymentType,
          typeName: action.payload.typeName,
          typeAmount: action.payload.typeAmount,
          amountDue: action.payload.amountDue,
        }
      }
      const idx = state.payments.findIndex((p) => p._id === action.payload._id)
      if (idx !== -1)
        state.payments[idx] = { ...state.payments[idx], ...action.payload }
      state.successMessage = 'Marked as paid'
    },
    markPaidFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // UNDO --------------------------------------------------------------
    undoPaymentStart: (state, _action: PayloadAction<string>) => {
      state.isLoading = true
      state.error = null
    },
    undoPaymentSuccess: (state, action: PayloadAction<Payment>) => {
      state.isLoading = false
      const gIdx = state.gridPayments.findIndex(
        (p) => p._id === action.payload._id
      )
      if (gIdx !== -1) {
        state.gridPayments[gIdx] = {
          ...state.gridPayments[gIdx],
          amountPaid: action.payload.amountPaid,
          status: action.payload.status,
          paidDate: action.payload.paidDate,
          method: action.payload.method,
          receivedBy: action.payload.receivedBy,
        }
      }
      const idx = state.payments.findIndex((p) => p._id === action.payload._id)
      if (idx !== -1)
        state.payments[idx] = { ...state.payments[idx], ...action.payload }
      state.successMessage = 'Payment reverted'
    },
    undoPaymentFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // UPDATE ------------------------------------------------------------
    updatePaymentStart: (
      state,
      _action: PayloadAction<{ id: string; data: unknown }>
    ) => {
      state.isLoading = true
      state.error = null
    },
    updatePaymentSuccess: (state, action: PayloadAction<Payment>) => {
      state.isLoading = false
      const gIdx = state.gridPayments.findIndex(
        (p) => p._id === action.payload._id
      )
      if (gIdx !== -1) {
        state.gridPayments[gIdx] = {
          ...state.gridPayments[gIdx],
          paymentType: action.payload.paymentType,
          typeName: action.payload.typeName,
          typeAmount: action.payload.typeAmount,
          amountDue: action.payload.amountDue,
          amountPaid: action.payload.amountPaid,
          status: action.payload.status,
          paidDate: action.payload.paidDate,
          method: action.payload.method,
          receivedBy: action.payload.receivedBy,
          note: action.payload.note,
        }
      }
      const idx = state.payments.findIndex((p) => p._id === action.payload._id)
      if (idx !== -1)
        state.payments[idx] = { ...state.payments[idx], ...action.payload }
      state.selectedPayment = action.payload
      state.successMessage = 'Payment updated'
    },
    updatePaymentFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // GENERATE ----------------------------------------------------------
    generateMonthStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    generateMonthSuccess: (
      state,
      action: PayloadAction<{
        created: number
        skipped: number
        periodLabel: string
      }>
    ) => {
      state.isLoading = false
      state.successMessage = `${action.payload.created} records created for ${action.payload.periodLabel}`
    },
    generateMonthFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    createForMonthStart: (
      state,
      _action: PayloadAction<{
        studentId: string
        periodYear: number
        periodMonth: number
        markPaid: boolean
        paymentType?: string | null
        amountDue?: number
        method?: string | null
        note?: string
      }>
    ) => {
      state.isLoading = true
      state.error = null
      state.successMessage = null
    },
    createForMonthSuccess: (state, action: PayloadAction<Payment>) => {
      state.isLoading = false
      // add to grid
      const asGrid: GridPayment = {
        _id: action.payload._id,
        student: action.payload.student._id,
        paymentType: action.payload.paymentType,
        typeName: action.payload.typeName,
        typeAmount: action.payload.typeAmount,
        periodYear: action.payload.periodYear,
        periodMonth: action.payload.periodMonth,
        periodLabel: action.payload.periodLabel,
        amountDue: action.payload.amountDue,
        amountPaid: action.payload.amountPaid,
        status: action.payload.status,
        paidDate: action.payload.paidDate,
        method: action.payload.method,
        receivedBy: action.payload.receivedBy,
        note: action.payload.note,
      }
      const gIdx = state.gridPayments.findIndex(
        (p) => p._id === action.payload._id
      )
      if (gIdx === -1) state.gridPayments.push(asGrid)
      else state.gridPayments[gIdx] = asGrid

      state.successMessage = 'Payment created'
    },
    createForMonthFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    generateForMonthStart: (
      state,
      _action: PayloadAction<{ year: number; month: number }>
    ) => {
      state.isLoading = true
      state.error = null
    },
    generateForMonthSuccess: (
      state,
      action: PayloadAction<{
        created: number
        skipped: number
        periodLabel: string
      }>
    ) => {
      state.isLoading = false
      state.successMessage = `${action.payload.created} records created for ${action.payload.periodLabel}`
    },
    generateForMonthFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // MISC --------------------------------------------------------------
    clearPaymentError: (state) => {
      state.error = null
    },
    clearPaymentSuccess: (state) => {
      state.successMessage = null
    },
    clearSelectedPayment: (state) => {
      state.selectedPayment = null
    },
  },
})

export const {
  getGridStart,
  getGridSuccess,
  getGridFailure,
  shiftWindow,
  setWindow,
  setPaymentFilters,
  getPaymentsStart,
  getPaymentsSuccess,
  getPaymentsFailure,
  getPaymentStatsStart,
  getPaymentStatsSuccess,
  getPaymentStatsFailure,
  markPaidStart,
  markPaidSuccess,
  markPaidFailure,
  undoPaymentStart,
  undoPaymentSuccess,
  undoPaymentFailure,
  updatePaymentStart,
  updatePaymentSuccess,
  updatePaymentFailure,
  generateMonthStart,
  generateMonthSuccess,
  generateMonthFailure,

  createForMonthStart,
  createForMonthSuccess,
  createForMonthFailure,
  generateForMonthStart,
  generateForMonthSuccess,
  generateForMonthFailure,

  clearPaymentError,
  clearPaymentSuccess,
  clearSelectedPayment,
} = paymentSlice.actions

export default paymentSlice.reducer
