import { call, put, takeLatest, select } from 'redux-saga/effects'
import { teacherAPI } from '@/app/lib/api'
import {
  getTeachersStart,
  getTeachersSuccess,
  getTeachersFailure,
  getTeacherByIdStart,
  getTeacherByIdSuccess,
  getTeacherByIdFailure,
  createTeacherStart,
  createTeacherSuccess,
  createTeacherFailure,
  updateTeacherStart,
  updateTeacherSuccess,
  updateTeacherFailure,
  deleteTeacherStart,
  deleteTeacherSuccess,
  deleteTeacherFailure,
} from '../slices/teacherSlice'
import { AxiosResponse } from 'axios'
import { RootState } from '../store'

// Get all teachers
function* handleGetTeachers(action: any) {
  try {
    const state: RootState = yield select()
    const filters = action.payload?.filters || state.teachers.filters

    const response: AxiosResponse = yield call(teacherAPI.getAll, filters)
    yield put(getTeachersSuccess(response.data.data))
  } catch (error: any) {
    yield put(
      getTeachersFailure(
        error.response?.data?.message || 'Failed to fetch teachers'
      )
    )
  }
}

// Get teacher by ID
function* handleGetTeacherById(action: any) {
  try {
    const response: AxiosResponse = yield call(
      teacherAPI.getById,
      action.payload
    )
    yield put(getTeacherByIdSuccess(response.data.data))
  } catch (error: any) {
    yield put(
      getTeacherByIdFailure(
        error.response?.data?.message || 'Failed to fetch teacher'
      )
    )
  }
}

// Create teacher
function* handleCreateTeacher(action: any) {
  try {
    const response: AxiosResponse = yield call(
      teacherAPI.create,
      action.payload
    )
    yield put(createTeacherSuccess(response.data.data))
  } catch (error: any) {
    yield put(
      createTeacherFailure(
        error.response?.data?.message || 'Failed to create teacher'
      )
    )
  }
}

// Update teacher
function* handleUpdateTeacher(action: any) {
  try {
    const { id, data } = action.payload
    const response: AxiosResponse = yield call(teacherAPI.update, id, data)
    yield put(updateTeacherSuccess(response.data.data))
  } catch (error: any) {
    yield put(
      updateTeacherFailure(
        error.response?.data?.message || 'Failed to update teacher'
      )
    )
  }
}

// Delete teacher
function* handleDeleteTeacher(action: any) {
  try {
    yield call(teacherAPI.delete, action.payload)
    yield put(deleteTeacherSuccess(action.payload))
  } catch (error: any) {
    yield put(
      deleteTeacherFailure(
        error.response?.data?.message || 'Failed to delete teacher'
      )
    )
  }
}

export function* teacherSaga() {
  yield takeLatest(getTeachersStart.type, handleGetTeachers)
  yield takeLatest(getTeacherByIdStart.type, handleGetTeacherById)
  yield takeLatest(createTeacherStart.type, handleCreateTeacher)
  yield takeLatest(updateTeacherStart.type, handleUpdateTeacher)
  yield takeLatest(deleteTeacherStart.type, handleDeleteTeacher)
}
