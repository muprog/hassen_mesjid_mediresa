import { call, put, takeLatest, select } from 'redux-saga/effects'
import { AxiosResponse } from 'axios'
import axios from 'axios'
import { reportAPI } from '@/app/lib/api'
import {
  getPaymentReportStart,
  getPaymentReportSuccess,
  getPaymentReportFailure,
  getUnpaidReportStart,
  getUnpaidReportSuccess,
  getUnpaidReportFailure,
  type ReportFilters,
  type ReportSummary,
  type ReportPeriod,
  type ReportByDay,
  type ReportPaymentGroup,
  type UnpaidSummary,
  type UnpaidStudent,
} from '../slices/reportSlice'
import { RootState } from '../store'

interface UnpaidResponse {
  success: boolean
  data: {
    period: { label: string; year: number; month: number }
    summary: UnpaidSummary
    unpaid: UnpaidStudent[]
  }
}
const getErrorMessage = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined
    return data?.message ?? err.message ?? fallback
  }
  if (err instanceof Error) return err.message
  return fallback
}

interface ReportResponse {
  success: boolean
  data: {
    summary: ReportSummary
    period: ReportPeriod
    byDay: ReportByDay[]
    payments: ReportPaymentGroup[]
  }
}

function* handleGetPaymentReport(action: {
  type: string
  payload: Partial<ReportFilters>
}) {
  try {
    const state: RootState = yield select()
    const merged: ReportFilters = {
      ...state.reports.filters,
      ...action.payload,
    }

    const res: AxiosResponse<ReportResponse> = yield call(() =>
      reportAPI.getPaymentReport({
        year: merged.year,
        month: merged.month,
        day: merged.day,
        method: merged.method,
        receivedBy: merged.receivedBy,
      })
    )
    yield put(
      getPaymentReportSuccess({
        summary: res.data.data.summary,
        period: res.data.data.period,
        byDay: res.data.data.byDay,
        payments: res.data.data.payments,
      })
    )
  } catch (err) {
    yield put(
      getPaymentReportFailure(getErrorMessage(err, 'Failed to load report'))
    )
  }
}

function* handleGetUnpaidReport(action: {
  type: string
  payload: { year: number; month: number }
}) {
  try {
    const res: AxiosResponse<UnpaidResponse> = yield call(() =>
      reportAPI.unpaid({
        year: action.payload.year,
        month: action.payload.month,
      })
    )
    yield put(
      getUnpaidReportSuccess({
        period: res.data.data.period,
        summary: res.data.data.summary,
        unpaid: res.data.data.unpaid,
      })
    )
  } catch (err) {
    yield put(
      getUnpaidReportFailure(
        getErrorMessage(err, 'Failed to load unpaid report')
      )
    )
  }
}

export function* reportSaga() {
  yield takeLatest(getPaymentReportStart.type, handleGetPaymentReport)
  yield takeLatest(getUnpaidReportStart.type, handleGetUnpaidReport)
}
