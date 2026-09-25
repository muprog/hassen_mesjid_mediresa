// import { call, put, takeLatest, select } from 'redux-saga/effects'
// import { AxiosResponse } from 'axios'
// import axios from 'axios'
// import { paymentAPI } from '@/app/lib/api'
// import {
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
//   type Payment,
// } from '../slices/paymentSlice'
// import { RootState } from '../store'

// const getErrorMessage = (err: unknown, fallback: string): string => {
//   if (axios.isAxiosError(err)) {
//     const data = err.response?.data as { message?: string } | undefined
//     return data?.message ?? err.message ?? fallback
//   }
//   if (err instanceof Error) return err.message
//   return fallback
// }

// interface ListResponse {
//   success: boolean
//   count: number
//   data: Payment[]
// }
// interface ItemResponse {
//   success: boolean
//   data: Payment
// }

// function* handleGetPayments(action: {
//   type: string
//   payload: { filters?: Record<string, string> }
// }) {
//   try {
//     const state: RootState = yield select()
//     const filters = action.payload?.filters ?? state.payments.filters
//     const res: AxiosResponse<ListResponse> = yield call(
//       paymentAPI.getAll,
//       filters
//     )
//     yield put(getPaymentsSuccess(res.data.data))
//   } catch (err) {
//     yield put(
//       getPaymentsFailure(getErrorMessage(err, 'Failed to load payments'))
//     )
//   }
// }

// function* handleGetStats() {
//   try {
//     const res: AxiosResponse<{
//       success: boolean
//       data: RootState['payments']['stats']
//     }> = yield call(paymentAPI.getStats)
//     if (res.data.data) yield put(getPaymentStatsSuccess(res.data.data))
//   } catch (err) {
//     yield put(
//       getPaymentStatsFailure(getErrorMessage(err, 'Failed to load stats'))
//     )
//   }
// }

// function* handleMarkPaid(action: { type: string; payload: string }) {
//   try {
//     const res: AxiosResponse<ItemResponse> = yield call(
//       paymentAPI.markPaid,
//       action.payload
//     )
//     yield put(markPaidSuccess(res.data.data))
//   } catch (err) {
//     yield put(markPaidFailure(getErrorMessage(err, 'Failed to mark paid')))
//   }
// }

// function* handleUndo(action: { type: string; payload: string }) {
//   try {
//     const res: AxiosResponse<ItemResponse> = yield call(
//       paymentAPI.undo,
//       action.payload
//     )
//     yield put(undoPaymentSuccess(res.data.data))
//   } catch (err) {
//     yield put(
//       undoPaymentFailure(getErrorMessage(err, 'Failed to undo payment'))
//     )
//   }
// }

// function* handleUpdate(action: {
//   type: string
//   payload: { id: string; data: unknown }
// }) {
//   try {
//     const { id, data } = action.payload
//     const res: AxiosResponse<ItemResponse> = yield call(
//       paymentAPI.update,
//       id,
//       data as never
//     )
//     yield put(updatePaymentSuccess(res.data.data))
//   } catch (err) {
//     yield put(
//       updatePaymentFailure(getErrorMessage(err, 'Failed to update payment'))
//     )
//   }
// }

// function* handleGenerate() {
//   try {
//     const res: AxiosResponse<{
//       success: boolean
//       data: { created: number; skipped: number; periodLabel: string }
//     }> = yield call(paymentAPI.generateThisMonth)
//     yield put(generateMonthSuccess(res.data.data))
//     // refresh list
//     yield put(getPaymentsStart({}))
//   } catch (err) {
//     yield put(
//       generateMonthFailure(getErrorMessage(err, 'Failed to generate month'))
//     )
//   }
// }

// export function* paymentSaga() {
//   yield takeLatest(getPaymentsStart.type, handleGetPayments)
//   yield takeLatest(getPaymentStatsStart.type, handleGetStats)
//   yield takeLatest(markPaidStart.type, handleMarkPaid)
//   yield takeLatest(undoPaymentStart.type, handleUndo)
//   yield takeLatest(updatePaymentStart.type, handleUpdate)
//   yield takeLatest(generateMonthStart.type, handleGenerate)
// }

import { call, put, takeLatest, select } from 'redux-saga/effects'
import { AxiosResponse } from 'axios'
import axios from 'axios'
import { paymentAPI } from '@/app/lib/api'
import {
  getGridStart,
  getGridSuccess,
  getGridFailure,
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
  type Payment,
  type GridStudent,
  type GridPayment,
} from '../slices/paymentSlice'
import { RootState } from '../store'

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined
    return data?.message ?? err.message ?? fallback
  }
  if (err instanceof Error) return err.message
  return fallback
}

interface ListResponse {
  success: boolean
  count: number
  data: Payment[]
}
interface ItemResponse {
  success: boolean
  data: Payment
}
interface GridResponse {
  success: boolean
  data: {
    students: GridStudent[]
    payments: GridPayment[]
    range: {
      fromYear: number
      fromMonth: number
      toYear: number
      toMonth: number
    }
  }
}
interface StatsResponse {
  success: boolean
  data: RootState['payments']['stats']
}

function* handleGetGrid(action: {
  type: string
  payload: {
    window?: RootState['payments']['window']
    filters?: RootState['payments']['filters']
  }
}) {
  try {
    const state: RootState = yield select()
    const w = action.payload.window ?? state.payments.window
    const filters = action.payload.filters ?? state.payments.filters

    const params = {
      fromYear: w.fromYear,
      fromMonth: w.fromMonth,
      toYear: w.toYear,
      toMonth: w.toMonth,
      search: filters.search,
      haleqa: filters.haleqa,
      section: filters.section,
    }

    const res: AxiosResponse<GridResponse> = yield call(() =>
      paymentAPI.getGrid(params)
    )

    yield put(
      getGridSuccess({
        students: res.data.data.students,
        payments: res.data.data.payments,
      })
    )
  } catch (err) {
    yield put(getGridFailure(getErrorMessage(err, 'Failed to load grid')))
  }
}

function* handleGetPayments(action: {
  type: string
  payload: { filters?: Record<string, string> }
}) {
  try {
    const state: RootState = yield select()
    const filters = action.payload?.filters ?? state.payments.filters

    const res: AxiosResponse<ListResponse> = yield call(() =>
      paymentAPI.getAll(filters as Record<string, string | number | undefined>)
    )
    yield put(getPaymentsSuccess(res.data.data))
  } catch (err) {
    yield put(
      getPaymentsFailure(getErrorMessage(err, 'Failed to load payments'))
    )
  }
}

function* handleGetStats() {
  try {
    const res: AxiosResponse<StatsResponse> = yield call(() =>
      paymentAPI.getStats()
    )
    if (res.data.data) yield put(getPaymentStatsSuccess(res.data.data))
  } catch (err) {
    yield put(
      getPaymentStatsFailure(getErrorMessage(err, 'Failed to load stats'))
    )
  }
}

function* handleMarkPaid(action: { type: string; payload: string }) {
  try {
    const id = action.payload
    const res: AxiosResponse<ItemResponse> = yield call(() =>
      paymentAPI.markPaid(id)
    )
    yield put(markPaidSuccess(res.data.data))
  } catch (err) {
    yield put(markPaidFailure(getErrorMessage(err, 'Failed to mark paid')))
  }
}

function* handleUndo(action: { type: string; payload: string }) {
  try {
    const id = action.payload
    const res: AxiosResponse<ItemResponse> = yield call(() =>
      paymentAPI.undo(id)
    )
    yield put(undoPaymentSuccess(res.data.data))
  } catch (err) {
    yield put(
      undoPaymentFailure(getErrorMessage(err, 'Failed to undo payment'))
    )
  }
}

function* handleUpdate(action: {
  type: string
  payload: { id: string; data: unknown }
}) {
  try {
    const { id, data } = action.payload
    const res: AxiosResponse<ItemResponse> = yield call(() =>
      paymentAPI.update(id, data as never)
    )
    yield put(updatePaymentSuccess(res.data.data))
  } catch (err) {
    yield put(
      updatePaymentFailure(getErrorMessage(err, 'Failed to update payment'))
    )
  }
}

function* handleGenerate() {
  try {
    const res: AxiosResponse<{
      success: boolean
      data: { created: number; skipped: number; periodLabel: string }
    }> = yield call(() => paymentAPI.generateThisMonth())
    yield put(generateMonthSuccess(res.data.data))
    yield put(getGridStart({}))
  } catch (err) {
    yield put(
      generateMonthFailure(getErrorMessage(err, 'Failed to generate month'))
    )
  }
}
function* handleCreateForMonth(action: {
  type: string
  payload: {
    studentId: string
    periodYear: number
    periodMonth: number
    markPaid: boolean
    paymentType?: string | null
    amountDue?: number
    method?: string | null
    note?: string
  }
}) {
  try {
    const res: AxiosResponse<ItemResponse> = yield call(() =>
      paymentAPI.createForMonth({
        studentId: action.payload.studentId,
        periodYear: action.payload.periodYear,
        periodMonth: action.payload.periodMonth,
        markPaid: action.payload.markPaid,
        paymentType: action.payload.paymentType,
        amountDue: action.payload.amountDue,
        method: (action.payload.method as never) ?? undefined,
        note: action.payload.note,
      })
    )
    yield put(createForMonthSuccess(res.data.data))
  } catch (err) {
    yield put(
      createForMonthFailure(getErrorMessage(err, 'Failed to create payment'))
    )
  }
}

function* handleGenerateForMonth(action: {
  type: string
  payload: { year: number; month: number }
}) {
  try {
    const res: AxiosResponse<{
      success: boolean
      data: { created: number; skipped: number; periodLabel: string }
    }> = yield call(() =>
      paymentAPI.generateForMonth(action.payload.year, action.payload.month)
    )
    yield put(generateForMonthSuccess(res.data.data))
    yield put(getGridStart({}))
  } catch (err) {
    yield put(
      generateForMonthFailure(getErrorMessage(err, 'Failed to generate month'))
    )
  }
}

export function* paymentSaga() {
  yield takeLatest(getGridStart.type, handleGetGrid)
  yield takeLatest(getPaymentsStart.type, handleGetPayments)
  yield takeLatest(getPaymentStatsStart.type, handleGetStats)
  yield takeLatest(markPaidStart.type, handleMarkPaid)
  yield takeLatest(undoPaymentStart.type, handleUndo)
  yield takeLatest(updatePaymentStart.type, handleUpdate)
  yield takeLatest(generateMonthStart.type, handleGenerate)

  yield takeLatest(createForMonthStart.type, handleCreateForMonth)
  yield takeLatest(generateForMonthStart.type, handleGenerateForMonth)
}
