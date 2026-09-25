import { call, put, takeLatest, select } from 'redux-saga/effects'
import { AxiosResponse } from 'axios'
import axios from 'axios'
import { paymentTypeAPI } from '@/app/lib/api'
import {
  getPaymentTypesStart,
  getPaymentTypesSuccess,
  getPaymentTypesFailure,
  getPaymentTypeByIdStart,
  getPaymentTypeByIdSuccess,
  getPaymentTypeByIdFailure,
  createPaymentTypeStart,
  createPaymentTypeSuccess,
  createPaymentTypeFailure,
  updatePaymentTypeStart,
  updatePaymentTypeSuccess,
  updatePaymentTypeFailure,
  togglePaymentTypeStatusStart,
  togglePaymentTypeStatusSuccess,
  togglePaymentTypeStatusFailure,
  deletePaymentTypeStart,
  deletePaymentTypeSuccess,
  deletePaymentTypeFailure,
  type PaymentType,
} from '../slices/paymentTypeSlice'
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
  data: PaymentType[]
}

interface ItemResponse {
  success: boolean
  data: PaymentType
}

function* handleGetPaymentTypes(action: {
  type: string
  payload: { filters?: Record<string, string> }
}) {
  try {
    const state: RootState = yield select()
    const filters = action.payload?.filters ?? state.paymentTypes.filters
    const response: AxiosResponse<ListResponse> = yield call(
      paymentTypeAPI.getAll,
      filters
    )
    yield put(getPaymentTypesSuccess(response.data.data))
  } catch (err) {
    yield put(
      getPaymentTypesFailure(
        getErrorMessage(err, 'Failed to load payment types')
      )
    )
  }
}

function* handleGetPaymentTypeById(action: { type: string; payload: string }) {
  try {
    const response: AxiosResponse<ItemResponse> = yield call(
      paymentTypeAPI.getById,
      action.payload
    )
    yield put(getPaymentTypeByIdSuccess(response.data.data))
  } catch (err) {
    yield put(
      getPaymentTypeByIdFailure(
        getErrorMessage(err, 'Failed to load payment type')
      )
    )
  }
}

function* handleCreatePaymentType(action: {
  type: string
  payload: { name: string; defaultAmount: number; period?: string }
}) {
  try {
    const response: AxiosResponse<ItemResponse> = yield call(
      paymentTypeAPI.create,
      action.payload as never
    )
    yield put(createPaymentTypeSuccess(response.data.data))
  } catch (err) {
    yield put(
      createPaymentTypeFailure(
        getErrorMessage(err, 'Failed to create payment type')
      )
    )
  }
}

function* handleUpdatePaymentType(action: {
  type: string
  payload: { id: string; data: Record<string, unknown> }
}) {
  try {
    const { id, data } = action.payload
    const response: AxiosResponse<ItemResponse> = yield call(
      paymentTypeAPI.update,
      id,
      data as never
    )
    yield put(updatePaymentTypeSuccess(response.data.data))
  } catch (err) {
    yield put(
      updatePaymentTypeFailure(
        getErrorMessage(err, 'Failed to update payment type')
      )
    )
  }
}

function* handleToggleStatus(action: { type: string; payload: string }) {
  try {
    const response: AxiosResponse<ItemResponse> = yield call(
      paymentTypeAPI.toggleStatus,
      action.payload
    )
    yield put(togglePaymentTypeStatusSuccess(response.data.data))
  } catch (err) {
    yield put(
      togglePaymentTypeStatusFailure(
        getErrorMessage(err, 'Failed to toggle payment type status')
      )
    )
  }
}

function* handleDelete(action: { type: string; payload: string }) {
  try {
    yield call(paymentTypeAPI.delete, action.payload)
    yield put(deletePaymentTypeSuccess(action.payload))
  } catch (err) {
    yield put(
      deletePaymentTypeFailure(
        getErrorMessage(err, 'Failed to delete payment type')
      )
    )
  }
}

export function* paymentTypeSaga() {
  yield takeLatest(getPaymentTypesStart.type, handleGetPaymentTypes)
  yield takeLatest(getPaymentTypeByIdStart.type, handleGetPaymentTypeById)
  yield takeLatest(createPaymentTypeStart.type, handleCreatePaymentType)
  yield takeLatest(updatePaymentTypeStart.type, handleUpdatePaymentType)
  yield takeLatest(togglePaymentTypeStatusStart.type, handleToggleStatus)
  yield takeLatest(deletePaymentTypeStart.type, handleDelete)
}
