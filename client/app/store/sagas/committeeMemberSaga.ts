import { call, put, takeLatest, select } from 'redux-saga/effects'
import { committeeMemberAPI } from '@/app/lib/api'
import {
  getMembersStart,
  getMembersSuccess,
  getMembersFailure,
  getMemberByIdStart,
  getMemberByIdSuccess,
  getMemberByIdFailure,
  createMemberStart,
  createMemberSuccess,
  createMemberFailure,
  updateMemberStart,
  updateMemberSuccess,
  updateMemberFailure,
  toggleMemberStatusStart,
  toggleMemberStatusSuccess,
  toggleMemberStatusFailure,
  deleteMemberStart,
  deleteMemberSuccess,
  deleteMemberFailure,
} from '../slices/committeeMemberSlice'
import { AxiosResponse } from 'axios'
import { RootState } from '../store'

// Get all members
function* handleGetMembers(action: any) {
  try {
    const state: RootState = yield select()
    const filters = action.payload?.filters || state.committeeMembers.filters

    const response: AxiosResponse = yield call(
      committeeMemberAPI.getAll,
      filters
    )
    yield put(getMembersSuccess(response.data.data))
  } catch (error: any) {
    yield put(
      getMembersFailure(
        error.response?.data?.message || 'Failed to fetch committee members'
      )
    )
  }
}

// Get member by ID
function* handleGetMemberById(action: any) {
  try {
    const response: AxiosResponse = yield call(
      committeeMemberAPI.getById,
      action.payload
    )
    yield put(getMemberByIdSuccess(response.data.data))
  } catch (error: any) {
    yield put(
      getMemberByIdFailure(
        error.response?.data?.message || 'Failed to fetch member'
      )
    )
  }
}

// Create member
function* handleCreateMember(action: any) {
  try {
    const response: AxiosResponse = yield call(
      committeeMemberAPI.create,
      action.payload
    )
    yield put(createMemberSuccess(response.data.data))
  } catch (error: any) {
    yield put(
      createMemberFailure(
        error.response?.data?.message || 'Failed to create member'
      )
    )
  }
}

// Update member
function* handleUpdateMember(action: any) {
  try {
    const { id, data } = action.payload
    const response: AxiosResponse = yield call(
      committeeMemberAPI.update,
      id,
      data
    )
    yield put(updateMemberSuccess(response.data.data))
  } catch (error: any) {
    yield put(
      updateMemberFailure(
        error.response?.data?.message || 'Failed to update member'
      )
    )
  }
}

// Toggle status
function* handleToggleStatus(action: any) {
  try {
    const response: AxiosResponse = yield call(
      committeeMemberAPI.toggleStatus,
      action.payload
    )
    yield put(toggleMemberStatusSuccess(response.data.data))
  } catch (error: any) {
    yield put(
      toggleMemberStatusFailure(
        error.response?.data?.message || 'Failed to toggle status'
      )
    )
  }
}

// Delete member
function* handleDeleteMember(action: any) {
  try {
    yield call(committeeMemberAPI.delete, action.payload)
    yield put(deleteMemberSuccess(action.payload))
  } catch (error: any) {
    yield put(
      deleteMemberFailure(
        error.response?.data?.message || 'Failed to delete member'
      )
    )
  }
}

export function* committeeMemberSaga() {
  yield takeLatest(getMembersStart.type, handleGetMembers)
  yield takeLatest(getMemberByIdStart.type, handleGetMemberById)
  yield takeLatest(createMemberStart.type, handleCreateMember)
  yield takeLatest(updateMemberStart.type, handleUpdateMember)
  yield takeLatest(toggleMemberStatusStart.type, handleToggleStatus)
  yield takeLatest(deleteMemberStart.type, handleDeleteMember)
}
