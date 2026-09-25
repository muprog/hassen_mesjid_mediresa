// import { configureStore } from '@reduxjs/toolkit'
// import createSagaMiddleware from 'redux-saga'
// import authReducer from './slices/authSlice'
// import rootSaga from './sagas/rootSaga'

// const sagaMiddleware = createSagaMiddleware()

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       thunk: false,
//       serializableCheck: false,
//     }).concat(sagaMiddleware),
// })

// sagaMiddleware.run(rootSaga)

// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch

// import { configureStore } from '@reduxjs/toolkit'
// import createSagaMiddleware from 'redux-saga'
// import authReducer from './slices/authSlice'
// import studentReducer from './slices/studentSlice'
// import rootSaga from './sagas/rootSaga'

// const sagaMiddleware = createSagaMiddleware()

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     students: studentReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       thunk: false,
//       serializableCheck: false,
//     }).concat(sagaMiddleware),
// })

// sagaMiddleware.run(rootSaga)

// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch

import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import authReducer from './slices/authSlice'
import studentReducer from './slices/studentSlice'
import teacherReducer from './slices/teacherSlice'
import paymentTypeReducer from './slices/paymentTypeSlice'
import rootSaga from './sagas/rootSaga'
import committeeMemberReducer from './slices/committeeMemberSlice'
import paymentReducer from './slices/paymentSlice'
import reportReducer from './slices/reportSlice'
const sagaMiddleware = createSagaMiddleware()
import directorReducer from './slices/directorSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    teachers: teacherReducer,
    committeeMembers: committeeMemberReducer,
    directors: directorReducer,
    paymentTypes: paymentTypeReducer,
    payments: paymentReducer,
    reports: reportReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
