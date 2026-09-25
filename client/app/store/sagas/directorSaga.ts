import { call, put, takeLatest, select } from 'redux-saga/effects'
import { directorAPI } from '@/app/lib/api'
import {
  getDirectorsStart,
  getDirectorsSuccess,
  getDirectorsFailure,
  getDirectorByIdStart,
  getDirectorByIdSuccess,
  getDirectorByIdFailure,
  createDirectorStart,
  createDirectorSuccess,
  createDirectorFailure,
  updateDirectorStart,
  updateDirectorSuccess,
  updateDirectorFailure,
  toggleDirectorStatusStart,
  toggleDirectorStatusSuccess,
  toggleDirectorStatusFailure,
  deleteDirectorStart,
  deleteDirectorSuccess,
  deleteDirectorFailure,
} from '../slices/directorSlice'
import { AxiosResponse } from 'axios'
import { RootState } from '../store'

// Get all directors
function* handleGetDirectors(action: any) {
  try {
    const state: RootState = yield select()
    const filters = action.payload?.filters || state.directors.filters

    const response: AxiosResponse = yield call(directorAPI.getAll, filters)
    yield put(getDirectorsSuccess(response.data.data))
  } catch (error: any) {
    yield put(
      getDirectorsFailure(
        error.response?.data?.message || 'Failed to fetch directors'
      )
    )
  }
}

// Get director by ID
function* handleGetDirectorById(action: any) {
  try {
    const response: AxiosResponse = yield call(
      directorAPI.getById,
      action.payload
    )
    yield put(getDirectorByIdSuccess(response.data.data))
  } catch (error: any) {
    yield put(
      getDirectorByIdFailure(
        error.response?.data?.message || 'Failed to fetch director'
      )
    )
  }
}

// Create director
function* handleCreateDirector(action: any) {
  try {
    const response: AxiosResponse = yield call(
      directorAPI.create,
      action.payload
    )
    yield put(createDirectorSuccess(response.data.data))
  } catch (error: any) {
    yield put(
      createDirectorFailure(
        error.response?.data?.message || 'Failed to create director'
      )
    )
  }
}

// Update director
function* handleUpdateDirector(action: any) {
  try {
    const { id, data } = action.payload
    const response: AxiosResponse = yield call(directorAPI.update, id, data)
    yield put(updateDirectorSuccess(response.data.data))
  } catch (error: any) {
    yield put(
      updateDirectorFailure(
        error.response?.data?.message || 'Failed to update director'
      )
    )
  }
}

// Toggle status
function* handleToggleStatus(action: any) {
  try {
    const response: AxiosResponse = yield call(
      directorAPI.toggleStatus,
      action.payload
    )
    yield put(toggleDirectorStatusSuccess(response.data.data))
  } catch (error: any) {
    yield put(
      toggleDirectorStatusFailure(
        error.response?.data?.message || 'Failed to toggle status'
      )
    )
  }
}

// Delete director
function* handleDeleteDirector(action: any) {
  try {
    yield call(directorAPI.delete, action.payload)
    yield put(deleteDirectorSuccess(action.payload))
  } catch (error: any) {
    yield put(
      deleteDirectorFailure(
        error.response?.data?.message || 'Failed to delete director'
      )
    )
  }
}

export function* directorSaga() {
  yield takeLatest(getDirectorsStart.type, handleGetDirectors)
  yield takeLatest(getDirectorByIdStart.type, handleGetDirectorById)
  yield takeLatest(createDirectorStart.type, handleCreateDirector)
  yield takeLatest(updateDirectorStart.type, handleUpdateDirector)
  yield takeLatest(toggleDirectorStatusStart.type, handleToggleStatus)
  yield takeLatest(deleteDirectorStart.type, handleDeleteDirector)
}
