// import express from 'express'
// import {
//   getPayments,
//   getPaymentById,
//   markPaymentPaid,
//   undoPayment,
//   updatePayment,
//   generateThisMonth,
//   getPaymentStats,
//   getPaymentsGrid,
// } from '../controllers/paymentController'
// import { isAuthenticated, authorize } from '../middleware/auth'

// const router = express.Router()

// router.use(isAuthenticated)

// // Read — all authenticated users
// router.get('/grid', getPaymentsGrid)
// router.get('/', getPayments)
// router.get('/stats', getPaymentStats)
// router.get('/:id', getPaymentById)

// // Write — Committee Leader + Director
// router.post(
//   '/generate-this-month',
//   authorize('committee_leader', 'director'),
//   generateThisMonth
// )
// router.patch(
//   '/:id/mark-paid',
//   authorize('committee_leader', 'director'),
//   markPaymentPaid
// )
// router.patch(
//   '/:id/undo',
//   authorize('committee_leader', 'director'),
//   undoPayment
// )
// router.put('/:id', authorize('committee_leader', 'director'), updatePayment)

// export default router

import express from 'express'
import {
  getPayments,
  getPaymentById,
  markPaymentPaid,
  undoPayment,
  updatePayment,
  generateThisMonth,
  getPaymentStats,
  getPaymentsGrid,
  createPaymentForMonth,
  generateForMonth,
} from '../controllers/paymentController'
import { isAuthenticated, authorize } from '../middleware/auth'

const router = express.Router()

router.use(isAuthenticated)

// Read — all authenticated users
router.get('/grid', getPaymentsGrid)
router.get('/', getPayments)
router.get('/stats', getPaymentStats)
router.get('/:id', getPaymentById)

router.post(
  '/create-for-month',
  authorize('committee_leader', 'director'),
  createPaymentForMonth
)
router.post(
  '/generate-month',
  authorize('committee_leader', 'director'),
  generateForMonth
)
// Write — Committee Leader + Director
router.post(
  '/generate-this-month',
  authorize('committee_leader', 'director'),
  generateThisMonth
)
router.patch(
  '/:id/mark-paid',
  authorize('committee_leader', 'director'),
  markPaymentPaid
)
router.patch(
  '/:id/undo',
  authorize('committee_leader', 'director'),
  undoPayment
)
router.put('/:id', authorize('committee_leader', 'director'), updatePayment)

export default router
