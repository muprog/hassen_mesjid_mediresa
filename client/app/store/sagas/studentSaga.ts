// import { call, put, takeLatest, select } from 'redux-saga/effects'
// import { studentAPI } from '@/app/lib/api'
// import {
//   getStudentsStart,
//   getStudentsSuccess,
//   getStudentsFailure,
//   getStudentByIdStart,
//   getStudentByIdSuccess,
//   getStudentByIdFailure,
//   createStudentStart,
//   createStudentSuccess,
//   createStudentFailure,
//   updateStudentStart,
//   updateStudentSuccess,
//   updateStudentFailure,
//   deleteStudentStart,
//   deleteStudentSuccess,
//   deleteStudentFailure,
// } from '../slices/studentSlice'
// import { AxiosResponse } from 'axios'
// import { RootState } from '../store'

// // Get all students
// function* handleGetStudents(action: any) {
//   try {
//     const state: RootState = yield select()
//     const filters = action.payload?.filters || state.students.filters
//     const page = action.payload?.page || state.students.pagination.page

//     const response: AxiosResponse = yield call(studentAPI.getAll, {
//       ...filters,
//       page,
//       limit: 10,
//     })

//     yield put(
//       getStudentsSuccess({
//         students: response.data.data,
//         total: response.data.count,
//       })
//     )
//   } catch (error: any) {
//     yield put(
//       getStudentsFailure(
//         error.response?.data?.message || 'Failed to fetch students'
//       )
//     )
//   }
// }

// // Get student by ID
// function* handleGetStudentById(action: any) {
//   try {
//     const response: AxiosResponse = yield call(
//       studentAPI.getById,
//       action.payload
//     )
//     yield put(getStudentByIdSuccess(response.data.data))
//   } catch (error: any) {
//     yield put(
//       getStudentByIdFailure(
//         error.response?.data?.message || 'Failed to fetch student'
//       )
//     )
//   }
// }

// // Create student
// function* handleCreateStudent(action: any) {
//   try {
//     const response: AxiosResponse = yield call(
//       studentAPI.create,
//       action.payload
//     )
//     yield put(createStudentSuccess(response.data.data))
//   } catch (error: any) {
//     yield put(
//       createStudentFailure(
//         error.response?.data?.message || 'Failed to create student'
//       )
//     )
//   }
// }

// // Update student
// function* handleUpdateStudent(action: any) {
//   try {
//     const { id, data } = action.payload
//     const response: AxiosResponse = yield call(studentAPI.update, id, data)
//     yield put(updateStudentSuccess(response.data.data))
//   } catch (error: any) {
//     yield put(
//       updateStudentFailure(
//         error.response?.data?.message || 'Failed to update student'
//       )
//     )
//   }
// }

// // Delete student
// function* handleDeleteStudent(action: any) {
//   try {
//     yield call(studentAPI.delete, action.payload)
//     yield put(deleteStudentSuccess(action.payload))
//   } catch (error: any) {
//     yield put(
//       deleteStudentFailure(
//         error.response?.data?.message || 'Failed to delete student'
//       )
//     )
//   }
// }

// export function* studentSaga() {
//   yield takeLatest(getStudentsStart.type, handleGetStudents)
//   yield takeLatest(getStudentByIdStart.type, handleGetStudentById)
//   yield takeLatest(createStudentStart.type, handleCreateStudent)
//   yield takeLatest(updateStudentStart.type, handleUpdateStudent)
//   yield takeLatest(deleteStudentStart.type, handleDeleteStudent)
// }

import { call, put, takeLatest, select } from 'redux-saga/effects'
import { studentAPI } from '@/app/lib/api'
import {
  getStudentsStart,
  getStudentsSuccess,
  getStudentsFailure,
  getStudentByIdStart,
  getStudentByIdSuccess,
  getStudentByIdFailure,
  createStudentStart,
  createStudentSuccess,
  createStudentFailure,
  updateStudentStart,
  updateStudentSuccess,
  updateStudentFailure,
  deleteStudentStart,
  deleteStudentSuccess,
  deleteStudentFailure,
} from '../slices/studentSlice'
import { AxiosResponse } from 'axios'
import { RootState } from '../store'

// Get all students
function* handleGetStudents(action: any) {
  try {
    const state: RootState = yield select()
    const filters = action.payload?.filters || state.students.filters
    const page = action.payload?.page || state.students.pagination.page

    const response: AxiosResponse = yield call(studentAPI.getAll, {
      ...filters,
      page,
      limit: 10,
    })

    yield put(
      getStudentsSuccess({
        students: response.data.data,
        total: response.data.count,
      })
    )
  } catch (error: any) {
    yield put(
      getStudentsFailure(
        error.response?.data?.message || 'Failed to fetch students'
      )
    )
  }
}

// Get student by ID
function* handleGetStudentById(action: any) {
  try {
    const response: AxiosResponse = yield call(
      studentAPI.getById,
      action.payload
    )
    yield put(getStudentByIdSuccess(response.data.data))
  } catch (error: any) {
    yield put(
      getStudentByIdFailure(
        error.response?.data?.message || 'Failed to fetch student'
      )
    )
  }
}

// Create student
function* handleCreateStudent(action: any) {
  try {
    const response: AxiosResponse = yield call(
      studentAPI.create,
      action.payload
    )
    yield put(createStudentSuccess(response.data.data))
  } catch (error: any) {
    yield put(
      createStudentFailure(
        error.response?.data?.message || 'Failed to create student'
      )
    )
  }
}

// Update student
function* handleUpdateStudent(action: any) {
  try {
    const { id, data } = action.payload
    const response: AxiosResponse = yield call(studentAPI.update, id, data)
    yield put(updateStudentSuccess(response.data.data))
  } catch (error: any) {
    yield put(
      updateStudentFailure(
        error.response?.data?.message || 'Failed to update student'
      )
    )
  }
}

// Delete student
function* handleDeleteStudent(action: any) {
  try {
    yield call(studentAPI.delete, action.payload)
    yield put(deleteStudentSuccess(action.payload))
  } catch (error: any) {
    yield put(
      deleteStudentFailure(
        error.response?.data?.message || 'Failed to delete student'
      )
    )
  }
}

export function* studentSaga() {
  yield takeLatest(getStudentsStart.type, handleGetStudents)
  yield takeLatest(getStudentByIdStart.type, handleGetStudentById)
  yield takeLatest(createStudentStart.type, handleCreateStudent)
  yield takeLatest(updateStudentStart.type, handleUpdateStudent)
  yield takeLatest(deleteStudentStart.type, handleDeleteStudent)
}
