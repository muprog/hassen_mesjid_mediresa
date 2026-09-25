// import { all } from 'redux-saga/effects'
// import { authSaga } from './authSaga'

// export default function* rootSaga() {
//   yield all([authSaga()])
// }
// import { all } from 'redux-saga/effects'
// import { authSaga } from './authSaga'
// import { studentSaga } from './studentSaga'

// export default function* rootSaga() {
//   yield all([authSaga(), studentSaga()])
// }

import { all } from 'redux-saga/effects'
import { authSaga } from './authSaga'
import { studentSaga } from './studentSaga'
import { teacherSaga } from './teacherSaga'
import { committeeMemberSaga } from './committeeMemberSaga'
import { directorSaga } from './directorSaga'
import { paymentTypeSaga } from './paymentTypeSaga'
import { paymentSaga } from './paymentSaga'
import { reportSaga } from './reportSaga'
export default function* rootSaga() {
  yield all([
    authSaga(),
    studentSaga(),
    teacherSaga(),
    committeeMemberSaga(),
    directorSaga(),
    paymentTypeSaga(),
    paymentSaga(),
    reportSaga(),
  ])
}
